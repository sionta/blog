# frozen_string_literal: true

require 'yaml'

module Jekyll
  module RebaseContentFilter
    METADATA = YAML.load_file(File.join(Dir.pwd, '_data', 'metadata.yml'))

    def custom_content(content)
      content = content.clone

      process_highlight_div(content)
      process_highlight_figure(content)
      process_code_blocks(content)
      # process_pre_code_blocks(content) # BUG
      process_td_classes(content)
      process_task_list_checkboxes(content)
      process_alert_blocks(content)

      content
    end

    private

    def process_highlight_div(content)
      content.gsub!(%r{<div class="highlight">(.*?)</div>}m, '\1')
    end

    def process_highlight_figure(content)
      content.gsub!(%r{<figure class="highlight"><pre><code class="language-(.*?)" data-lang="(.*?)">(.*?)</code></pre></figure>}m) do
        process_code_block($2, "", $3, false)
      end
    end

    def process_code_blocks(content)
      content.gsub!(%r{<div class="language-(\w+)\s(.*?)"><pre class="highlight"><code>(.*?)</code></pre></div>}m) do
        process_code_block($1, $2, $3, false)
      end
    end

    def process_pre_code_blocks(content)
      content.gsub!(%r{<pre><code class="language-(.*?)">(.*?)</code></pre>}m) do |match|
        language = $1
        code = $2
        language.include?("mermaid") ? match : process_code_block(language, "", code, true)
      end
    end

    def process_code_block(language, extra_classes, code, is_pre_code = false)
      language_data = find_language_data(language)
      return "" unless language_data

      icon = language_data['icon']
      title = language_data['title'] || language.capitalize
      code_header = create_code_header(icon, title, language)
      container_class = is_pre_code ? "" : "highlighter-rouge"

      "<div class=\"language-#{language} #{extra_classes} #{container_class}\">#{code_header}<pre class=\"highlight\"><code class=\"rouge-code\">#{code}</code></pre></div>"
    end

    def process_td_classes(content)
      content.gsub!(%r{<td class="gutter gl">(.*?)</td>}m, '<td class="rouge-gutter gl">\1</td>')
      content.gsub!(%r{<td class="code">(.*?)</td>}m, '<td class="rouge-code">\1</td>')
    end

    def process_task_list_checkboxes(content)
      content.gsub!(%r{<input type="checkbox" class="task-list-item-checkbox" disabled="disabled" checked="checked"(.*?)>}m) do
        "#{create_svg_sprite('checkbox', 'task-list-checked')}\s"
      end
      content.gsub!(%r{<input type="checkbox" class="task-list-item-checkbox" disabled(.*?)>}m) do
        "#{create_svg_sprite('square', 'task-list-unchecked')}\s"
      end
    end

    def process_alert_blocks(content)
      METADATA['alerts'].each do |alert|
        alert_name = alert['name']
        alert_icon = alert['icon'].downcase
        alert_subclass = "alert-#{alert_name.downcase}"
        alert_svg_class = "alert-icon #{alert_subclass}-icon"
        current_element = "<blockquote class=\"alert #{alert_subclass}\">"

        new_element = <<~HTML
          <blockquote class="alert #{alert_subclass}" role="alert">
            <div class="alert-header">
              #{create_svg_sprite(alert_icon, alert_svg_class)}
              <span class="#{alert_subclass}-title">#{alert_name}</span>
            </div>
        HTML

        content.gsub!(current_element, new_element)
      end
    end

    def find_language_data(language)
      METADATA['code_blocks']['language'].find do |lang|
        aliases = lang['alias'].split(',').map(&:strip)
        aliases.include?(language)
      end
    end

    def create_svg_sprite(icon, class_name)
      "<svg class=\"#{class_name}\" width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><use href=\"/assets/tabler-icons.svg##{icon}\"></use></svg>"
    end

    def create_code_header(icon, title, language)
      copy_label = METADATA['code_blocks']['label']['copy']
      success_label = METADATA['code_blocks']['label']['success']
      error_label = METADATA['code_blocks']['label']['error']

      <<~HTML
        <header class="code-header" code-lang="#{language}">
          #{create_svg_sprite(icon, 'code-icon')}
          <span class="code-title">#{title}</span>
          <button class="code-button" copy-label="#{copy_label}" success-label="#{success_label}" error-label="#{error_label}" aria-label="Copy #{title} code to clipboard" aria-live="polite" aria-atomic="true">
            <span class="code-tooltip"></span>
            #{create_svg_sprite('copy', 'icon-clipboard')}
            #{create_svg_sprite('check', 'icon-success')}
          </button>
        </header>
      HTML
    end
  end
end

Liquid::Template.register_filter(Jekyll::RebaseContentFilter)
