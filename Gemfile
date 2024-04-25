# frozen_string_literal: true

source "https://rubygems.org"
gem "jekyll", "~> 4.0"

group :test do
    gem "html-proofer", ">= 5"
end

group :jekyll_plugins do
    gem "jekyll-feed", "~> 0.17"
    gem "jekyll-seo-tag", "~> 2.8"
    gem "jekyll-sitemap", "~> 1.4"
    gem "jekyll-paginate", "~> 1.1"
    gem "jemoji", "~> 0.13"
    gem "jekyll-gist", "~> 1.5"
    gem "jekyll-archives", "~> 2.2"
    gem "jekyll-redirect-from", "~> 0.16"
    gem "jekyll-include-cache", "~> 0.2"
    gem "jekyll-last-modified-at", "~> 1.3"
end

# Windows and JRuby does not include zoneinfo files, so bundle the tzinfo-data gem
# and associated library.
platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem "tzinfo", ">= 1", "< 3"
  gem "tzinfo-data"
end

gem "wdm", "~> 0.1.1", :install_if => Gem.win_platform?
