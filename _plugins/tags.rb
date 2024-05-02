module Jekyll
  class TagPageGenerator < Generator
    safe true

    # Generate tag pages for each unique tag found in the site's posts
    def generate(site)
      # Collect all unique tags from the site's posts
      tags = site.posts.docs.flat_map { |post| post.data['tags'] || [] }.uniq

      # For each unique tag, create a tag page
      tags.each do |tag|
        site.pages << TagPage.new(site, site.source, tag)
      end
    end
  end

  class TagPage < Page
    # Initialize a tag page for the given tag
    def initialize(site, base, tag)
      @site = site
      @base = base
      @dir = File.join('tags', tag) # Set the directory to 'tags/<tag>'
      @name = 'index.html' # Name the file index.html

      # Process the page and set the appropriate layout
      self.process(@name)
      # Read the layout from the '_layouts' directory
      self.read_yaml(File.join(base, '_layouts'), 'tag.html')
      # Set the tag and title data for the page
      self.data['tag'] = tag
      self.data['title'] = "Tag: #{tag}"
    end
  end
end
