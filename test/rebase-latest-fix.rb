# frozen_string_literal: true

module Jekyll
  module RebaseContentFilter

    def custom_highlight(content)
      content = content.clone

      # remove multiple class highlight
      content.gsub!(%r{<div class="highlight">(.*?)</div>}m, '\1')

      # if use liquid {% highlight %} tag, why rendering with figure?.
      content.gsub!(%r{<figure class="highlight"><pre><code class="language-(.*?)" data-lang="(.*?)">(.*?)</code></pre></figure>}m) do
        "<div class=\"language-#{$2} highlighter-rouge\"><pre class=\"highlight\"><code>#{$3}</code></pre></div>"
      end

      content.gsub!(%r{<div class="language-(\w+)\s(.*?)"><pre class="highlight"><code>(.*?)</code></pre></div>}m) do
        code_header = "<header class=\"code-header\" code-lang=\"#{$1}\"></header>"
        "<div class=\"language-#{$1} #{$2}\">#{code_header}<pre class=\"highlight\"><code data-lang=\"#{$1}\">#{$3}</code></pre></div>"
      end

      content.gsub!(%r{<td class="gutter gl">(.*?)</td>}m) do
        "<td class=\"rouge-gutter gl\">#{$1}</td>"
      end

      content.gsub!(%r{<td class="code">(.*?)</td>}m) do
        "<td class=\"rouge-code\">#{$1}</td>"
      end

      content
    end

    def regex_match(input, pattern)
      begin
        regex = Regexp.new(pattern)
        matches = input.scan(regex).flatten
        matches.empty? ? nil : matches
      rescue RegexpError => e
        raise "Invalid regex pattern: #{e.message}"
      end
    end

    def regex_replace(input, pattern, replacement)
      begin
        regex = Regexp.new(pattern)
        input.gsub(regex, replacement)
      rescue RegexpError => e
        raise "Invalid regex pattern: #{e.message}"
      end
    end

    def regex_append(input, pattern, append_text)
      begin
        regex = Regexp.new(pattern)
        input.gsub(regex) { |match| "#{match}#{append_text}" }
      rescue RegexpError => e
        raise "Invalid regex pattern: #{e.message}"
      end
    end

    def regex_prepend(input, pattern, prepend_text)
      begin
        regex = Regexp.new(pattern)
        input.gsub(regex) { |match| "#{prepend_text}#{match}" }
      rescue RegexpError => e
        raise "Invalid regex pattern: #{e.message}"
      end
    end

  end
end

Liquid::Template.register_filter(Jekyll::RebaseContentFilter)
