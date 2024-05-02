# frozen_string_literal: true

source "https://rubygems.org"
gem "jekyll", "~> 4.3"

group :jekyll_plugins do
  # gem "jemoji" # Enable emoji shortcodes
  # gem "jekyll-gist" # Enable embed GitHub gists
  gem "jekyll-feed", "~> 0.17"
  gem "jekyll-seo-tag", "~> 2.8"
  gem "jekyll-sitemap", "~> 1.4"
  gem "kramdown-math-katex", "~> 1.0"
  gem "jekyll-redirect-from", "~> 0.16"
end

# Windows and JRuby does not include zoneinfo files, so bundle the tzinfo-data gem
# and associated library.
platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem "tzinfo", ">= 1", "< 3"
  gem "tzinfo-data"
end

# Performance-booster for watching directories on Windows
gem "wdm", "~> 0.1.1", :platforms => [:mingw, :x64_mingw, :mswin]
