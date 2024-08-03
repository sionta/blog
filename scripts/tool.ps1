[CmdletBinding()]
param (
    [Parameter(Mandatory)]
    [ValidateSet('install', 'build', 'test')]
    [Alias('c')][string]$Command,

    [Parameter()]
    [Alias('a')][string[]]$Optional
)

Set-StrictMode -Off
$ProgressPreference = 'SilentlyContinue'
$ErrorActionPreference = 'Stop'

if (Test-Path '../Gemfile' -PathType Leaf) {
    $ROOT = Resolve-Path '../'
} else {
    $ROOT = $PSScriptRoot
}

Set-Location $ROOT

function Install($Force = $false) {
    if ($Force) {
        ('node_modules', 'package-lock.json', 'Gemfile.lock').ForEach({ if (Test-Path $_) { Remove-Item $_ -Recurse -Force } })
        npm install && bundle install
    } else {
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
