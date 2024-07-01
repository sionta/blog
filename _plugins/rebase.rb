# frozen_string_literal: true

require 'yaml'

module Jekyll
  module RebaseContentFilter
    # Load data from _data/metadata.yml file.
    METADATA = YAML.load_file(File.join(Dir.pwd, '_data', 'metadata.yml'))

    def custom_content(content)
      content = content.clone

      # Remove multiple class highlight
      content.gsub!(%r{<div class="highlight">(.*?)</div>}m, '\1')

      # If use liquid {% highlight %} tag, why rendering with figure?.
      content.gsub!(%r{<figure class="highlight"><pre><code class="language-(.*?)" data-lang="(.*?)">(.*?)</code></pre></figure>}m) do
        "<div class=\"language-#{$2} highlighter-rouge\"><pre class=\"highlight\"><code>#{$3}</code></pre></div>"
      end

      # Process code blocks with language class
      content.gsub!(%r{<div class="language-(\w+)\s(.*?)"><pre class="highlight"><code>(.*?)</code></pre></div>}m) do
        process_code_block($1, $2, $3)
      end

      # Process pre > code blocks
      content.gsub!(%r{<pre><code class="language-(.*?)">(.*?)</code></pre>}m) do |match|
        language = $1
        code = $2
        if language.include?("mermaid")
          match
        else
          process_code_block(language, "", code, true)
        end
      end

      # Adjust td classes for rouge
      content.gsub!(%r{<td class="gutter gl">(.*?)</td>}m) do
        "<td class=\"rouge-gutter gl\">#{$1}</td>"
      end

      content.gsub!(%r{<td class="code">(.*?)</td>}m) do
        "<td class=\"rouge-code\">#{$1}</td>"
      end

      content.gsub!(%r{<input type="checkbox" class="task-list-item-checkbox" disabled="disabled" checked="checked"(.*?)>}m) do
        "#{create_svg_sprite('checkbox', 'task-list-checked')}\s"
      end
      content.gsub!(%r{<input type="checkbox" class="task-list-item-checkbox" disabled(.*?)>}m) do
        "#{create_svg_sprite('square', 'task-list-unchecked')}\s"
      end

      # Process alert blocks
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

      # OUTPUT
      content
    end

    private

    def find_language_data(language)
      METADATA['code_blocks']['language'].find do |lang|
        aliases = lang['alias'].split(',').map(&:strip)
        aliases.include?(language)
      end
    end

    def create_svg_sprite(icon, class_name)
      baseurl = Jekyll.sites[0].config['baseurl']
      url = File.join(baseurl, 'assets/tabler-icons.svg')
      "<svg class=\"#{class_name}\" width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><use href=\"#{url}##{icon}\"></use></svg>"
    end

    def create_code_header(icon, title, language)
      copy_label = METADATA['code_blocks']['label']['copy']
      success_label = METADATA['code_blocks']['label']['success']
      error_label = METADATA['code_blocks']['label']['error']

      code_header_element = <<~HTML
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

      code_header_element
    end

    def process_code_block(language, extra_classes, code, is_pre_code = false)
      language_data = find_language_data(language)
      icon = language_data ? language_data['icon'] : 'code'
      title = language_data ? language_data['title'] || language.capitalize : language.capitalize

      code_header = create_code_header(icon, title, language)
      if is_pre_code
        "<div class=\"language-#{language}\">#{code_header}<pre class=\"highlight\"><code class=\"rouge-code\">#{code}</code></pre></div>"
      else
        "<div class=\"language-#{language} #{extra_classes}\">#{code_header}<pre class=\"highlight\"><code>#{code}</code></pre></div>"
      end
    end
  end
end

Liquid::Template.register_filter(Jekyll::RebaseContentFilter)
