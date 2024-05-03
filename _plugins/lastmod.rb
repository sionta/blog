module Jekyll
  # Jekyll plugin for adding last modified date to a page
  class LastModifiedDateTag < Liquid::Tag
    def initialize(tag_name, text, tokens)
      super
      @format = text.strip # Save the provided date format
    end

    def render(context)
      # Retrieve the content data being rendered
      page = context.registers[:page]

      # Check for modified_date metadata in the page
      modified_date = page["modified_date"]

      # If modified_date is not available, use File.mtime
      if modified_date.nil?
        file_path = page["path"]
        modified_date = File.mtime(file_path)
      end

      # If no format is provided, use default format
      if @format.nil? || @format.empty?
        @format = "%Y-%m-%d %H:%M:%S"
      end

      # Format the date according to the provided date format
      modified_date.strftime(@format)
    end
  end
end

# Register the Liquid tag for last modified date
# Liquid::Template.register_tag('modified_date', Jekyll::LastModifiedDateTag)
