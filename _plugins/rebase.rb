# Modified Code blokcs | FILTER
module Jekyll
  module RebaseContentFilter
    def fix_rouge(content)
      content = content.clone

      # Remove <div class="highlight"> while keeping its child nodes
      content.gsub!(%r{<div class="highlight">(.*?)</div>}m, '\1')

      # Replace <figure class="highlight"> with <div class="language-... highlighter-rouge">
      content.gsub!(%r{<figure class="highlight"><pre><code class="language-(.*?)">(.*?)</code></pre></figure>}m) do
        language = $1
        code_content = $2
        "<div class=\"language-#{language} highlighter-rouge\"><pre class=\"highlight\" data-lang=\"#{language}\"><code>#{code_content}</code></pre></div>"
      end

      # Fix from figure '<div class="language-..." data-lang=".. highlighter-rouge">'
      content.gsub!(%r{<div class="language-(\w+)" data-lang="\1 highlighter-rouge">}m) do |match|
        match.gsub('" data-lang="' + $1, '')
      end

      # Ensure 'data-lang' is not duplicated in <pre> elements
      content.gsub!(%r{(<pre[^>]*?)\sdata-lang="[^"]*"(.*?>)}m) do
        "#{$1}#{$2}"
      end

      # Add 'data-lang' attribute to <pre> elements based on parent <div> class
      content.gsub!(%r{<div class="language-(.*?) highlighter-rouge"><pre class="highlight">(.*?)</pre></div>}m) do
        language = $1
        pre_content = $2
        "<div class=\"language-#{language} highlighter-rouge\"><pre class=\"highlight\" data-lang=\"#{language}\">#{pre_content}</pre></div>"
      end

      # # Remove 'class' from <code> elements if they have 'data-lang' attribute
      # content.gsub!(%r{<code class="language-(.*?)"(.*?)>(.*?)</code>}m) do
      #   "<code>#{$3}</code>"
      # end

      # Replace <td class="gutter gl"> with <td class="rouge-gutter gl">
      content.gsub!(%r{<td class="gutter gl">(.*?)</td>}m) do
        "<td class=\"rouge-gutter gl\">#{$1}</td>"
      end

      # Replace <td class="code"> with <td class="rouge-code">
      content.gsub!(%r{<td class="code">(.*?)</td>}m) do
        "<td class=\"rouge-code\">#{$1}</td>"
      end

      content
    end
  end
end

Liquid::Template.register_filter(Jekyll::RebaseContentFilter)

# GENERATED TAG
module Jekyll
  class TagPageGenerator < Generator
    safe true

    def generate(site)
      tags = site.posts.docs.flat_map { |post| post.data['tags'] || [] }.to_set
      tags.each do |tag|
        site.pages << TagPage.new(site, site.source, tag)
      end
    end
  end

  class TagPage < Page
    def initialize(site, base, tag)
      @site = site
      @base = base
      @dir  = File.join('tags', tag)
      @name = 'index.html'

      self.process(@name)
      self.read_yaml(File.join(base, '_layouts'), 'tag.html')
      self.data['tag'] = tag
      self.data['title'] = "Tag: #{tag}"
    end
  end
end

# LAST MODIFIED | TAG
module Jekyll
  class LastModifiedAtTag < Liquid::Tag
    def initialize(tag_name, markup, tokens)
      super
      @markup = markup.strip
    end

    def render(context)
      page = context.registers[:page]

      if page
        last_modified_at = page['last_modified_at']
        last_modified_at ||= find_last_modified_from_generator(context)
        format_last_modified_at(last_modified_at, context)
      end
    end

    private

    def find_last_modified_from_generator(context)
      site = context.registers[:site]
      site.posts.docs.each do |post|
        return post['last_modified_at'] if post['last_modified_at']
      end
      nil
    end

    def format_last_modified_at(last_modified_at, context)
      if @markup.empty?
        last_modified_at.strftime("%Y-%m-%d %H:%M:%S %z") if last_modified_at
      else
        date_format = Liquid::Template.parse(context[@markup]).render(context)
        last_modified_at.strftime(date_format) if last_modified_at
      end
    end
  end

  class LastModifiedGenerator < Generator
    priority :low

    def generate(site)
      site.posts.docs.each do |post|
        if post.data['last_modified_at'].nil?
          post.data['last_modified_at'] = File.mtime(post.path)
        end
      end
    end
  end
end

Liquid::Template.register_tag('last_modified_at', Jekyll::LastModifiedAtTag)

# ALTERNATIVE REGEX | FILTER
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
