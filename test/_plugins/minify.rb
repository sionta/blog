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
  Jekyll.logger.info "#{File.basename(__FILE__)}:", "Starting minification for '#{output_dir}'"

  current_env = Jekyll.env
  output_dir = site.dest

  # Configuration for minification
  config = site.config['minify'] || {}
  html_config = config['html']
  css_config = config['css']
  js_config = config['js']

  # Exclude patterns for files and directories
  excludes = ['vendor/', 'lib/', '.min.*']

  # Remove 'assets/lib' directory if 'self_host' configuration doesn't match
  self_host = site.config['self_host'] || false
  self_host_dir = File.join(output_dir, 'assets', 'lib')
  FileUtils.rm_rf(self_host_dir) if (self_host == false || self_host != current_env) && Dir.exist?(self_host_dir)

  # HTML
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

  # CSS
  if css_config == true || css_config == current_env
    css_files = Dir.glob("#{output_dir}/**/*.css").reject { |i| excludes.any? { |e| i.include?(e) } }
    css_files.each do |css_file|
      css_opts = ["-i \"#{css_file}\"", "-o \"#{css_file}\""]
      run_command('csso', css_opts)
    end
  end

  # JS
  if js_config == true || js_config == current_env
    js_files = Dir.glob("#{output_dir}/**/*.js").reject { |i| excludes.any? { |e| i.include?(e) } }
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
end
