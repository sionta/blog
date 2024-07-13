require 'fileutils'
require 'open3'

# Function to run a command and handle errors
def run_command(cmd, args)
  if File.exist?(cmd)
    stdout_str, error_str, status = Open3.capture3("#{cmd} #{args}")
    if !status.success?
      Jekyll.logger.error "#{File.basename(__FILE__)}:", "Error running #{cmd}: #{error_str}"
    end
    stdout_str
  else
    Jekyll.logger.error "#{File.basename(__FILE__)}:", "#{File.basename(cmd)} not found. Try running `npm install`"
  end
end

# Function to minify HTML files
def minify_html(output_dir)
  html_cmd = File.expand_path('node_modules/.bin/html-minifier')
  html_opts = "--input-dir \"#{output_dir}\" --output-dir \"#{output_dir}\" --file-ext html --collapse-whitespace --remove-comments --minify-css --minify-js"
  run_command(html_cmd, html_opts)
end

# Function to minify CSS files
def minify_css(output_dir)
  css_cmd = File.expand_path('node_modules/.bin/cleancss')
  css_files = Dir.glob("#{output_dir}/**/*.css").reject { |file| file.include?('vendor') || file.include?('lib') || file.end_with?('.min.css') }
  css_files.each do |css_file|
    css_opts = "--with-rebase -o #{css_file} #{css_file}"
    Jekyll.logger.info "#{File.basename(__FILE__)}:", "Minifying CSS file: #{css_file}"
    run_command(css_cmd, css_opts)
  end
end

# Function to minify JS files
def minify_js(output_dir)
  js_cmd = File.expand_path('node_modules/.bin/uglifyjs')
  js_files = Dir.glob("#{output_dir}/**/*.js").reject { |file| file.include?('vendor') || file.include?('lib') || file.end_with?('.min.js') }
  js_files.each do |js_file|
    js_opts = "-o \"#{js_file}\" \"#{js_file}\""
    Jekyll.logger.info "#{File.basename(__FILE__)}:", "Minifying JS file: #{js_file}"
    run_command(js_cmd, js_opts)
  end
end

# Register hooks to run after Jekyll site is written
Jekyll::Hooks.register :site, :post_write do |site|
  config = site.config['minify'] || {}
  env = config.fetch('env', 'production')
  html_minify = config.fetch('html', true)
  css_minify = config.fetch('css', true)
  js_minify = config.fetch('js', true)

  if Jekyll.env == env
    Jekyll.logger.info "#{File.basename(__FILE__)}:", "Starting minification of HTML, CSS, and JS..."

    output_dir = site.dest

    # Minify HTML
    minify_html(output_dir) if html_minify

    # Minify CSS
    minify_css(output_dir) if css_minify

    # Minify JS
    minify_js(output_dir) if js_minify
  # else
  #   Jekyll.logger.info "#{File.basename(__FILE__)}:", "Skipping minification (env: #{Jekyll.env})"
  end
end
