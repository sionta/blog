[CmdletBinding()]
param (
    [Parameter(Mandatory, ValueFromPipeline)]
    [Alias('s', 'Path')][string[]]$Source,

    [Parameter()]
    [Alias('o', 'Outfile')][string]$Output,

    [Parameter()]
    [Alias('p', 'Filter')][string]$Pattern = '*.svg',

    [Parameter()]
    [Alias('m', 'Max')][int]$Total,

    [Parameter()]
    [switch]$Minify,

    [Parameter()]
    [Alias('r')][switch]$Recurse
)

Set-StrictMode -Off
$ProgressPreference = 'SilentlyContinue'
$ErrorActionPreference = 'Stop'

# Get the list of files matching the pattern
$files = Get-ChildItem $Source -Filter $Pattern -Recurse:$Recurse

# If $Total is not defined, process all files
if (-not $Total) {
    $filesToProcess = $files
} else {
    # Limit the number of files to process
    $filesToProcess = $files | Select-Object -First $Total
}

# Initialize a list to store processed content
$content = @()
$newLines = if ($Minify) { '' } else { "`n" }

foreach ($file in $filesToProcess) {
    # Get svg id with the base name of the file
    $name = $file.BaseName

    # Read the file content as a single string
    $text = Get-Content $file -Raw

    # Remove 'class' and 'xmlns' attributes
    $text = $text -replace '(class|xmlns)="[^"]*"\s*', ''

    if ($Minify) {
        # Minify by removing unnecessary spaces around tags
        $text = $text -replace '\s*/>\s*', '/>' -replace '\s*>\s*', '>'
    }

    # Replace <svg> tag with <symbol> and add 'id' attribute
    $text = $text -replace '<svg', "<symbol id=`"$name`"" -replace '</svg>', '</symbol>'

    # Add the processed content to the array
    $content += $text
}

# Wrap the content in an <svg> tag
$content = @"
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true">$newLines$content</svg>
"@

# Output the results to the console or save to a file
if ($Output) {
    try {
        # Save the results to the specified file
        $content | Out-File $Output -Encoding UTF8
        Write-Host "Processed SVGs saved to $Output"
    } catch {
        Write-Error "Failed to write to $Output`: $_"
    }
} else {
    # Display the results in the console
    $content
}
