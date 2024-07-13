# _plugins/category_tag_generator.rb

module Jekyll
  class CategoryTagGenerator < Generator
    safe true

    def generate(site)
      generate_category_pages(site)
      generate_tag_pages(site)
    end

    def generate_category_pages(site)
      site.categories.each do |category, posts|
        site.pages << create_category_page(site, category, posts)
      end
    end

    def generate_tag_pages(site)
      site.tags.each do |tag, posts|
        site.pages << create_tag_page(site, tag, posts)
      end
    end

    def create_category_page(site, category, posts)
      CategoryPage.new(site, site.source, File.join('categories', category), category, posts)
    end

    def create_tag_page(site, tag, posts)
      TagPage.new(site, site.source, File.join('tags', tag), tag, posts)
    end
  end

  class CategoryPage < Page
    def initialize(site, base, dir, category, posts)
      @site = site
      @base = base
      @dir = dir
      @name = 'index.html'

      self.process(@name)
      self.read_yaml(File.join(base, '_layouts'), 'category.html')
      self.data['category'] = category
      self.data['posts'] = posts
    end
  end

  class TagPage < Page
    def initialize(site, base, dir, tag, posts)
      @site = site
      @base = base
      @dir = dir
      @name = 'index.html'

      self.process(@name)
      self.read_yaml(File.join(base, '_layouts'), 'tag.html')
      self.data['tag'] = tag
      self.data['posts'] = posts
    end
  end
end
