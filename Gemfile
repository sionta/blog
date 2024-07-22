# frozen_string_literal: true

source 'https://rubygems.org'
gem 'jekyll', '~> 4.3'

# If you have any plugins, put them here!
group :jekyll_plugins do
  gem 'jekyll-feed', '~> 0.17'
  gem 'jekyll-include-cache', '~> 0.2'
  gem 'jekyll-paginate', '~> 1.1'
  gem 'jekyll-redirect-from', '~> 0.16'
  gem 'jekyll-seo-tag', '~> 2.8'
  gem 'jekyll-sitemap', '~> 1.4'
end

group :development do
  gem 'html-proofer'
  gem 'nokogiri'
end

# Windows and JRuby does not include zoneinfo files, so bundle the tzinfo-data gem
# and associated library.
platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem 'tzinfo', '>= 1', '< 3'
  gem 'tzinfo-data'
end

# Performance-booster for watching directories on Windows
gem 'wdm', '>= 0.1.0' if Gem.win_platform?
