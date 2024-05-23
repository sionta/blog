Set-StrictMode -Off

$ErrorActionPreference = 'Stop'

if (Test-Path "$PSScriptRoot/../_config.yml") {
    Set-Location "$PSScriptRoot/.."
} else {
    Write-Error "'_config.yml' not found."
    exit 1
}

ruby --version
gem --version
gem install bundler jekyll
bundle --version
jekyll --version

bundle install
bundle exec jekyll clean
bundle exec jekyll serve --watch
