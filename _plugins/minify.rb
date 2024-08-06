# frozen_string_literal: true

require 'open3'
require 'fileutils'

def test_command(cmd, args)
  command = File.absolute_path("./node_modules/.bin/#{cmd}")
  stdout, stderr, status = Open3.capture3(command, *args)

  return if status.success?

  Jekyll.logger.error "#{File.basename(__FILE__)}:", "#{command} failed with status #{status.exitstatus}"
  Jekyll.logger.error "Error: #{stderr.strip}" unless stderr.strip.empty?
  Jekyll.logger.error "Output: #{stdout.strip}" unless stdout.strip.empty?
end

# Register hooks to run after Jekyll site is written
Jekyll::Hooks.register :site, :post_write do |site|
  source_dir = site.dest
  # Configuration for minification
  config = site.config['minify'] || {}
  current_env = Jekyll.env
  # Exclude patterns for files and directories
  exclude_patterns = [%r{vendor/}, %r{lib/}, /\.min\./]

  Jekyll.logger.info "#{File.basename(__FILE__)}:", "Compressing for #{source_dir}..."

  # Remove 'assets/lib' directory if 'self_host' configuration doesn't match
  self_host = site.config['self_host'] || false
  self_host_dir = File.join(source_dir, 'assets', 'lib')
  FileUtils.rm_rf(self_host_dir) if (self_host == false || self_host != current_env) && Dir.exist?(self_host_dir)

  # Minify HTML files
  html_enabled = config['html']
  if html_enabled == true || html_enabled == current_env
    opts = [
      '--input-dir', source_dir,
      '--output-dir', source_dir,
      '--file-ext', 'html',
      '--use-short-doctype',
      '--remove-comments',
      '--collapse-whitespace',
      '--minify-css',
      '--minify-js'
    ]
    test_command('html-minifier', opts)
  end

  # Minify CSS files
  css_enabled = config['css']
  if css_enabled == true || css_enabled == current_env
    c = Dir.glob("#{source_dir}/**/*.css").reject do |file|
      exclude_patterns.any? { |pattern| pattern.match?(file) }
    end
    c.each do |file|
      test_command('csso', ['-i', file, '-o', file])
    end
  end

  # Minify JS files
  js_enabled = config['js']
  if js_enabled == true || js_enabled == current_env
    j = Dir.glob("#{source_dir}/**/*.js").reject do |file|
      exclude_patterns.any? do |pattern|
        pattern.match?(file)
      end
    end
    j.each do |file|
      opts = [file, '-o', file, '--compress', '--mangle', '--validate']
      test_command('uglifyjs', opts)
    end
  end
end
