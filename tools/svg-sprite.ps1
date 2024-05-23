Set-StrictMode -Off
$ProgressPreference = 'SilentlyContinue'
$ErrorActionPreference = 'Stop'

$prefix = '' # e.g., 'tabler-'
$outputFile = [System.IO.Path]::GetFullPath("$PSScriptRoot/../assets/tabler-icons.svg")
$sourceFiles = [System.IO.Directory]::EnumerateFiles("$PSScriptRoot", '*.svg', 'AllDirectories')
$attributes = 'width="24" height="24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"'
$new_attributes = 'fill-rule="evenodd" clip-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2" viewBox="0 0 24 24"'

# Function to convert SVG file to <symbol> element in SVG sprite
function ConvertTo-SVGSymbol {
  foreach ($svgFile in $sourceFiles) {
    $symbolID = [System.IO.Path]::GetFileNameWithoutExtension($svgFile)
    $contentSVG = [System.IO.File]::ReadAllText($svgFile)
    $classesSVG = [regex]::Matches($contentSVG, 'class="([^"]*)"')

    if ($classesSVG -match 'outline') {
      $contentSVG = $contentSVG -replace 'xmlns="http://www.w3.org/2000/svg"', ''
      $contentSVG = $contentSVG -replace '<svg', "<symbol id=`"$prefix$symbolID`" class=`"sprite`""
      $contentSVG = $contentSVG -replace $attributes, $new_attributes
      $contentSVG = $contentSVG -replace $classesSVG, ''
      # $contentSVG = $contentSVG -replace '<path stroke="none" d="M0 0h24v24H0z"/>', ''
      $contentSVG = $contentSVG -replace '</svg>', '</symbol>'
      $contentSVG = $contentSVG -replace '\s{2,}', ' '
      $contentSVG + "`n"
    }
  }
}

# Generate sprite SVG
$svgSprites = @"
---
permalink: /assets/:basename:output_ext
---
<!--
  Tabler Icons 3.4.0 by tabler - https://tabler.io
  License - https://github.com/tabler/outline-icons/blob/master/LICENSE
-->

<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true">
 <defs><style>.sprite {display:none;}.sprite:target{display:inline;}</style></defs>
 $(ConvertTo-SVGSymbol)
</svg>
"@

# Ensure the directory exists before writing the file
$outputDir = [System.IO.Path]::GetDirectoryName($outputFile)
if (-not ([System.IO.Path]::Exists($outputDir))) {
  $null = [System.IO.Directory]::CreateDirectory($outputDir)
}
[System.IO.File]::WriteAllText($outputFile, $svgSprites)
[System.Console]::WriteLine("SVG sprite created successfully: $outputFile")
