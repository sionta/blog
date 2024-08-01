# frozen_string_literal: true

# Function to run a command and handle errors
def run_command(cmd, args)
  tool_path = File.absolute_path("./node_modules/.bin/#{cmd}")
  tool_args = args.join(' ')
  stdout_str, error_str, status = Open3.capture3("#{tool_path} #{tool_args}")
  return if status.success?

  Jekyll.logger.error "#{File.basename(__FILE__)}:", "#{tool_path} failed with status #{status.exitstatus}"
  Jekyll.logger.error "Error: #{error_str.strip}" unless error_str.strip.empty?
  Jekyll.logger.error "Output: #{stdout_str.strip}" unless stdout_str.strip.empty?
end

# Register hooks to run after Jekyll site is written
Jekyll::Hooks.register :site, :post_write do |site|
  # Configuration in _config.yml
  config = site.config['minify'] || {}
  html_config = config['html']
  css_config = config['css']
  js_config = config['js']
  output_dir = site.dest

  current_env = Jekyll.env # Get current ENV value from Jekyll
  excludes = ['vendor/', '.min.css', '.min.js']
  excludes.append('lib/') if current_env == 'development'

  Jekyll.logger.info "#{File.basename(__FILE__)}:", "Minification for '#{output_dir}'"

  # Minify HTML
  if html_config == true || current_env == html_config
    html_opts = [
      "--input-dir=#{output_dir}",
      "--output-dir=#{output_dir}",
      '--file-ext html',
      '--use-short-doctype',
      '--remove-comments',
      '--collapse-whitespace',
      '--minify-css',
      '--minify-js'
    ]
    run_command('html-minifier', html_opts)
  end

  # Minify CSS
  if css_config == true || current_env == css_config
    css_files = Dir.glob("#{output_dir}/**/*.css").reject do |file|
      excludes.any? { |ex| file.include?(ex) }
    end
    css_files.each do |css_file|
      css_opts = ["-i \"#{css_file}\"", "-o \"#{css_file}\""]
      run_command('csso', css_opts)
    end
  end

  # Minify JS
  if js_config == true || current_env == js_config
    js_files = Dir.glob("#{output_dir}/**/*.js").reject do |file|
      excludes.any? { |ex| file.include?(ex) }
    end
    js_files.each do |js_file|
      js_opts = [
        "\"#{js_file}\"",
        "-o \"#{js_file}\"",
        # '--beautify',
        '--compress',
        '--mangle',
        '--validate'
      ]
      run_command('uglifyjs', js_opts)
    end
  end

  # Remove self_host from build
  self_host = site.config['self_host'] || false
  FileUtils.rmtree("#{output_dir}/assets/lib") if self_host == false || current_env != self_host
end
