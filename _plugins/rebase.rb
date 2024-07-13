# frozen_string_literal: true

require 'yaml'

module Jekyll
  module RebaseContentFilter
    # Load data from _data/metadata.yml file.
    METADATA = YAML.load_file(File.join(Dir.pwd, '_data', 'metadata.yml'))

    def rebase_content(content)
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

      # Adjust td classes for rouge-table
      content.gsub!(%r{<td class="gutter gl">(.*?)</td>}m) do
        "<td class=\"rouge-gutter gl\">#{$1}</td>"
      end
      content.gsub!(%r{<td class="code">(.*?)</td>}m) do
        "<td class=\"rouge-code\">#{$1}</td>"
      end

      content.gsub!(%r{<input type="checkbox" class="task-list-item-checkbox" disabled="disabled" checked="checked"(.*?)>}m) do
        "#{svg_sprite('checkbox', 'task-list-checked')}\s"
      end
      content.gsub!(%r{<input type="checkbox" class="task-list-item-checkbox" disabled(.*?)>}m) do
        "#{svg_sprite('square', 'task-list-unchecked')}\s"
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
              #{svg_sprite(alert_icon, alert_svg_class)}
              <span class="#{alert_subclass}-title">#{alert_name}</span>
            </div>
        HTML

        content.gsub!(current_element, new_element)
      end

      # OUTPUT
      content
    end

    private

    def find_lang(language)
      METADATA['code_blocks']['language'].find do |lang|
        aliases = lang['alias'].split(',').map(&:strip)
        aliases.include?(language)
      end
    end

    def svg_sprite(icon, class_name)
      baseurl = Jekyll.sites[0].config['baseurl']
      url = File.join(baseurl, 'assets/tabler-icons.svg')
      "<svg class=\"#{class_name}\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><use href=\"#{url}##{icon}\"></use></svg>"
    end

    def process_code_block(language, extra_classes, code, is_pre_code = false)
      copy_label = METADATA['code_blocks']['label']['copy']
      success_label = METADATA['code_blocks']['label']['success']
      lang = find_lang(language)
      title = lang ? lang['title'] || language.capitalize : language.capitalize
      <<~HTML
        <div class="code-blocks">
          <div class="code-header">
          <span code-lang="#{language}">#{title}</span>
          <button type="button" success-label="#{success_label}" aria-label="Copy #{title} code to clipboard">#{copy_label}</button>
          </div>
          <pre class="highlight"><code class="language-#{language}">#{code}</code></pre>
      </div>
      HTML
    end
  end
end

Liquid::Template.register_filter(Jekyll::RebaseContentFilter)
