# frozen_string_literal: true

require 'open3'
require 'fileutils'

def run_command(cmd, args)
  tool_path = File.absolute_path("./node_modules/.bin/#{cmd}")
  command = "#{tool_path} #{args.join(' ')}"

  stdout_str, error_str, status = Open3.capture3(command)

  return if status.success?

  Jekyll.logger.error "#{File.basename(__FILE__)}:", "#{tool_path} failed with status #{status.exitstatus}"
  Jekyll.logger.error "Error: #{error_str.strip}" unless error_str.strip.empty?
  Jekyll.logger.error "Output: #{stdout_str.strip}" unless stdout_str.strip.empty?
end

# Register hooks to run after Jekyll site is written
Jekyll::Hooks.register :site, :post_write do |site|
  current_env = Jekyll.env
  output_dir = site.dest

  # Configuration for minification
  config = site.config['minify'] || {}
  html_config = config['html']
  css_config = config['css']
  js_config = config['js']

  # Exclude patterns for files and directories
  excludes = ['lib/', 'vendor/', '.min.css', '.min.js']

  # Log information about the minification process
  Jekyll.logger.info "#{File.basename(__FILE__)}:", "Starting minification for '#{output_dir}'"

  # Minify HTML files
  if html_config == true || html_config == current_env
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

  # Minify CSS files
  if css_config == true || css_config == current_env
    css_files = Dir.glob("#{output_dir}/**/*.css").reject { |file| excludes.any? { |ex| File.fnmatch?(ex, file) } }
    css_files.each do |css_file|
      css_opts = ["-i \"#{css_file}\"", "-o \"#{css_file}\""]
      run_command('csso', css_opts)
    end
  end

  # Minify JS files
  if js_config == true || js_config == current_env
    js_files = Dir.glob("#{output_dir}/**/*.js").reject { |file| excludes.any? { |ex| File.fnmatch?(ex, file) } }
    js_files.each do |js_file|
      js_opts = [
        "\"#{js_file}\"",
        "-o \"#{js_file}\"",
        '--compress',
        '--mangle',
        '--validate'
      ]
      run_command('uglifyjs', js_opts)
    end
  end

  # Remove 'assets/lib' directory if 'self_host' configuration doesn't match
  self_host = site.config['self_host'] || false
  if (self_host == false || self_host != current_env) && Dir.exist?(File.join(output_dir, 'assets', 'lib'))
    FileUtils.rm_rf(File.join(output_dir, 'assets', 'lib'))
  end
end
