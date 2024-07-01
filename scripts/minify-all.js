const fs = require("fs");
const path = require("path");
const htmlMinifier = require("html-minifier").minify;
const CleanCSS = require("clean-css");
const UglifyJS = require("uglify-js");

// Fungsi untuk minifikasi HTML
async function minifyHTML(dir) {
  const files = await fs.promises.readdir(dir);

  await Promise.all(
    files.map(async (file) => {
      const filePath = path.join(dir, file);
      const stat = await fs.promises.stat(filePath);

      if (stat.isDirectory()) {
        await minifyHTML(filePath);
      } else if (path.extname(file) === ".html") {
        const content = await fs.promises.readFile(filePath, "utf8");
        const minified = htmlMinifier(content, {
          removeAttributeQuotes: true,
          collapseWhitespace: true,
          removeComments: true,
          minifyCSS: true,
          minifyJS: true,
        });
        await fs.promises.writeFile(filePath, minified, "utf8");
        console.log(`Minified HTML: ${filePath}`);
      }
    })
  );
}

// Fungsi untuk minifikasi CSS
function minifyCSS(file) {
  const source = fs.readFileSync(file, "utf8");
  const output = new CleanCSS().minify(source);
  fs.writeFileSync(file, output.styles, "utf8");
  console.log(`Minified CSS: ${file}`);
}

// Fungsi untuk minifikasi JS
function minifyJS(file) {
  const result = UglifyJS.minify(fs.readFileSync(file, "utf8"));
  if (result.error) throw result.error;
  fs.writeFileSync(file, result.code, "utf8");
  console.log(`Minified JS: ${file}`);
}

// Panggil fungsi-fungsi tersebut untuk file yang sesuai
minifyHTML("_site"); // Minify all HTML files in the _site directory
minifyCSS("_site/assets/css/style.css"); // Minify specific CSS file
minifyJS("_site/assets/js/main.js"); // Minify specific JS file
