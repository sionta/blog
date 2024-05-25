$ErrorActionPreference = 'Stop'

$sourceDir = $args[0]
$removeName = $args[1]

Get-ChildItem -Path "$sourceDir/*.woff?" -File | Rename-Item -NewName { $_.FullName -replace [regex]::Escape($removeName), '' }
