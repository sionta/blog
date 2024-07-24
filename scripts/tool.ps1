[CmdletBinding()]
param (
    [Parameter(Mandatory)]
    [ValidateSet('init', 'test', 'build')]
    [Alias('c')][string]$Command,

    [Parameter()]
    [Alias('a')][string[]]$Optional
)

Set-StrictMode -Off
$ProgressPreference = 'SilentlyContinue'
$ErrorActionPreference = 'Stop'

if (Test-Path '../_config.yml' -PathType Leaf) {
    $ROOT = Resolve-Path '../'
} else {
    $ROOT = $PSScriptRoot
}

Set-Location $ROOT

function Install {
    if (-not (Test-Path 'package-lock.json' -PathType Leaf)) {
        Write-Host 'Installing Node.js packages...'
        & npm install
    } else {
        Write-Host 'Node.js packages already installed.'
    }

    if (-not (Test-Path 'Gemfile.lock' -PathType Leaf)) {
        Write-Host 'Installing Ruby gems...'
        & bundle install
    } else {
        Write-Host 'Ruby gems already installed.'
    }
}

function Build {
    Write-Host 'Building Jekyll site...'
    & bundle exec jekyll build @($Optional)
}

function Test {
    Write-Host 'Cleaning Jekyll site...'
    & bundle exec jekyll clean

    Write-Host 'Serving Jekyll site...'
    & bundle exec jekyll serve --watch @($Optional)
}

switch ($Command) {
    'init' {
        Install
    }
    'build' {
        Build
    }
    'test' {
        Test
    }
}
