# _plugins/regex.rb
module Jekyll
  module RegexFilter
    def regex_replace(input, pattern, replacement)
      begin
        regex = Regexp.new(pattern)
        input.gsub(regex, replacement)
      rescue RegexpError => e
        raise "Invalid regex pattern: #{e.message}"
      end
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

Liquid::Template.register_filter(Jekyll::RegexFilter)
