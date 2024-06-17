# _plugins/readlines.rb

module Jekyll
  module ReadlinesFilter
    def readlines(input)
      input.to_s.split("\n")
    end
  end
end

Liquid::Template.register_filter(Jekyll::ReadlinesFilter)
