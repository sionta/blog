[CmdletBinding()]
param (
    [Parameter(Mandatory = $true)]
    [Alias('s')][string]$Source
)


if (Test-Path "../_config.yml" -PathType Leaf) {
    Set-Location ".."
}

if (-not(Test-Path "node_modules/.bin/*")) {
    npm install
}

$BUILD_DIR = Resolve-Path($Source)

# Minify HTML files
html-minifier --input-dir "$BUILD_DIR" --output-dir "$BUILD_DIR" --file-ext html --collapse-whitespace --remove-comments --remove-attribute-quotes --minify-css --minify-js

# Minify CSS files
cleancss -o "$BUILD_DIR/assets/css/style.css" "$BUILD_DIR/assets/css/style.css"

# Minify JS files
uglifyjs -o "$BUILD_DIR/assets/js/main.js" "$BUILD_DIR/assets/js/main.js"
