Set-StrictMode -Off
$ProgressPreference = 'SilentlyContinue'
$ErrorActionPreference = 'Stop'

$prefix = '' # e.g., 'tabler-'
$style = 'outline' # outline, filled
$sourcePath = [System.IO.Path]::GetFullPath("$PSScriptRoot/../assets")
$outputFile =  [System.IO.Path]::GetFullPath("$PSScriptRoot/../assets/tabler-icons.svg")
$svgFiles = [System.IO.Directory]::EnumerateFiles("$PSScriptRoot/svg", '*.svg', 'AllDirectories')

# Function to convert SVG file to <symbol> element in SVG sprite
function ConvertTo-SVGSymbol {
  foreach ($svgFile in $svgFiles) {
    $symbolID = [System.IO.Path]::GetFileNameWithoutExtension($svgFile)
    $symbolID = "id=`"$prefix$symbolID`""
    $contentSVG = [System.IO.File]::ReadAllText($svgFile)
    $classesSVG = [regex]::Matches($contentSVG, 'class="([^"]*)"')
    # $classesSVG = ($classesSVG.Groups[1].Value -split '\s+')[-1]
    if ($classesSVG -match $style) {
      $contentSVG = $contentSVG -replace '<svg', '<symbol aria-hidden="true"'
      $contentSVG = $contentSVG -replace '</svg>', '</symbol>'
      $contentSVG = $contentSVG -replace 'xmlns="http://www.w3.org/2000/svg"', $symbolID
      # $contentSVG = $contentSVG -replace 'class="([^"]*)"', ''
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
  Thanks:
    Tabler Icons 3.4.0 by tabler - https://tabler.io
    License - https://github.com/tabler/tabler-icons/blob/master/LICENSE

  Example:
    <svg class="icon" viewBox="0 0 24 24">
      <use xlink:href="/assets/tabler-icons.svg#$($prefix)brand-github" />
    </svg>
 -->

<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="display: none;">
  $(ConvertTo-SVGSymbol)
</svg>
"@

[System.IO.File]::WriteAllText($outputFile, $svgSprites)
[System.Console]::WriteLine("SVG sprite created successfully: $outputFile")
