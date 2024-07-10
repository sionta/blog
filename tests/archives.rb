# _plugins/paginater.rb

module Jekyll
  class Paginater < Generator
    safe true
    priority :lowest

    # add in _config.yml:
    # paginater: 10
    # paginater_path: "page:num"

    def generate(site)
      paginate(site, site.posts.docs)
      paginate_by_category(site)
      paginate_by_tags(site)
    end

    def paginate(site, posts)
      paginate_collection(site, posts, "index.html", "page")
    end

    def paginate_by_category(site)
      site.categories.each do |category, posts|
        paginate_collection(site, posts, "category/#{category}.html", "category/#{category}/page")
      end
    end

    def paginate_by_tags(site)
      site.tags.each do |tag, posts|
        paginate_collection(site, posts, "tag/#{tag}.html", "tag/#{tag}/page")
      end
    end

    def paginate_collection(site, posts, index_page_path, page_path_prefix)
      pages = calculate_pages(posts, site.config['paginater'].to_i)
      pages.each_with_index do |pager, index|
        path = index.zero? ? index_page_path : "#{page_path_prefix}/#{index + 1}/index.html"
        page = PaginaterPage.new(site, site.source, path, pager)
        site.pages << page
      end
    end

    def calculate_pages(posts, per_page)
      pages = []
      num_pages = (posts.size.to_f / per_page).ceil
      num_pages.times do |i|
        pager_posts = posts[i * per_page, per_page] || []
        pages << PaginaterPager.new(i + 1, num_pages, pager_posts)
      end
      pages
    end
  end

  class PaginaterPage < Page
    def initialize(site, base, path, pager)
      @site = site
      @base = base
      @dir = File.dirname(path)
      @name = File.basename(path)
      self.process(@name)
      self.read_yaml(File.join(base, '_layouts'), 'paginater.html')
      self.data['paginater'] = pager
    end
  end

  class PaginaterPager
    attr_reader :page, :total_pages, :posts

    def initialize(page, total_pages, posts)
      @page = page
      @total_pages = total_pages
      @posts = posts
    end

    def previous_page
      @page > 1 ? @page - 1 : nil
    end

    def next_page
      @page < @total_pages ? @page + 1 : nil
    end

    def previous_page_path
      previous_page ? (previous_page == 1 ? "/" : "/page#{previous_page}/") : nil
    end

    def next_page_path
      next_page ? "/page#{next_page}/" : nil
    end
  end
end
