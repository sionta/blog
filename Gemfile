# frozen_string_literal: true

source "https://rubygems.org"
# gemspec
gem "jekyll", "~> 4.3.3"

group :jekyll_plugins do
  gem "jemoji", "~> 0.13.0"
  gem "jekyll-toc", "0.19.0"
  gem "jekyll-feed", "~> 0.17.0"
  gem "jekyll-gist", "~> 1.5.0"
  gem "jekyll-seo-tag", "~> 2.8.0"
  gem "jekyll-sitemap", "~> 1.4.0"
  gem "jekyll-paginate", "~> 1.1.0"
  gem "jekyll-archives", "~> 2.2.1"
  gem "kramdown-math-katex", "~> 1.0.1"
  gem "jekyll-include-cache", "~> 0.2.1"
  gem "jekyll-redirect-from", "~> 0.16.0"
  gem "jekyll-last-modified-at", "~> 1.3.0"
end

platforms :mingw, :x64_mingw, :mswin, :jruby do
  # Windows and JRuby does not include zoneinfo files, so bundle the tzinfo-data gem
  # and associated library.
  gem "tzinfo", "~> 2.0.6"
  gem "tzinfo-data", "~> 1.2024.1"

  # Performance-booster for watching directories on Windows
  gem "wdm", "~> 0.1.1"

  # Lock `http_parser.rb` gem to `v0.6.x` on JRuby builds since newer versions of the gem
  # do not have a Java counterpart.
  gem "http_parser.rb", "~> 0.8.0"
end
