[CmdletBinding()]
param (
    [Parameter(Mandatory = $true)]
    [Alias('s')][string]$Source,
    [Parameter(Mandatory = $true)]
    [Alias('o')][string]$Output,
    [Alias('r')][switch]$Recurse
)

Set-StrictMode -Off
$ProgressPreference = 'SilentlyContinue'
$ErrorActionPreference = 'Stop'

if ($Recurse) {
    $searchOption = [System.IO.SearchOption]::AllDirectories
}
else {
    $searchOption = [System.IO.SearchOption]::TopDirectoryOnly
}

$sourceDir = [System.IO.Path]::GetDirectoryName($Source)
$outputFile = [System.IO.Path]::GetFullPath($Output)
$svgFiles = [System.IO.Directory]::EnumerateFiles($sourceDir, '*.svg', $searchOption)

# Convert SVG file to <symbol> element in SVG sprite
function ConvertTo-SVGSymbol {
    foreach ($svgFile in $svgFiles) {
        $symbolID = [System.IO.Path]::GetFileNameWithoutExtension($svgFile)
        $contentSVG = [System.IO.File]::ReadAllText($svgFile)
        $classesSVG = [regex]::Matches($contentSVG, 'class="([^"]*)"')

        if ($classesSVG -match 'outline') {
            $contentSVG = $contentSVG -replace 'xmlns="http://www.w3.org/2000/svg"', ''
            $contentSVG = $contentSVG -replace '<svg', "<symbol id=`"$symbolID`" class=`"icon icon-tabler`""
            $contentSVG = $contentSVG -replace '</svg>', '</symbol>'
            $contentSVG = $contentSVG -replace $classesSVG, ''
            $contentSVG = $contentSVG -replace '\s{2,}', ' '
            $contentSVG = $contentSVG + "`n"
            $contentSVG
        }
    }
}

# Generate sprite SVG
$svgSprites = @"
<!--
  Tabler Icons 3.4.0 by tabler - https://tabler.io
  License - https://github.com/tabler/tabler-icons/blob/master/LICENSE
-->

<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true">
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
