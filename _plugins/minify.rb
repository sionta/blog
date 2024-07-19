# frozen_string_literal: true

require 'open3'

# Function to run a command and handle errors
def run_command(cmd, args)
  tool_path = File.absolute_path("./node_modules/.bin/#{cmd}")
  tool_args = args.join(' ')
  stdout_str, error_str, status = Open3.capture3("#{tool_path} #{tool_args}")
  return if status.success?

  Jekyll.logger.error "#{File.basename(__FILE__)}:", "#{tool_path}, #{status}, #{stdout_str}"
end

# Function to minify HTML, CSS, and JS files
def minify_files(output_dir, config)
  Jekyll.logger.info "#{File.basename(__FILE__)}:", "Minification for '#{output_dir}'"
  excludes = ['vendor/', 'lib/', '.min.css', '.min.js']

  # Minify HTML
  if config.fetch('html', true)
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
  if config.fetch('css', true)
    css_files = Dir.glob("#{output_dir}/**/*.css").reject { |file| excludes.any? { |ex| file.include?(ex) } }
    css_files.each do |css_file|
      css_opts = [
        "-i \"#{css_file}\"",
        "-o \"#{css_file}\""
      ]
      run_command('csso', css_opts)
    end
  end

  # Minify JS
  return unless config.fetch('js', true)

  js_files = Dir.glob("#{output_dir}/**/*.js").reject { |file| excludes.any? { |ex| file.include?(ex) } }
  js_files.each do |js_file|
    js_opts = [
      "\"#{js_file}\"",
      "-o \"#{js_file}\""
    ]
    run_command('uglifyjs', js_opts)
  end
end

# Register hooks to run after Jekyll site is written
Jekyll::Hooks.register :site, :post_write do |site|
  config = site.config['minify'] || {}
  minify_files(site.dest, config)
end
