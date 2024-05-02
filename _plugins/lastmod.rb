module Jekyll
  # Jekyll plugin for adding last modified date to a page
  class LastModifiedDateTag < Liquid::Tag
    def initialize(tag_name, text, tokens)
      super
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

      # Format the last modified date and return
      modified_date.strftime("%Y-%m-%d %H:%M:%S")
    end
  end
end

# Register the Liquid tag for last modified date
Liquid::Template.register_tag('modified_date', Jekyll::LastModifiedDateTag)
