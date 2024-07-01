const fs = require("fs");
const path = require("path");
const { minify } = require("html-minifier");

const minifyOptions = {
  removeAttributeQuotes: true,
  collapseWhitespace: true,
  removeComments: true,
  minifyCSS: true,
  minifyJS: true,
};

const walk = function (dir, done) {
  let results = [];
  fs.readdir(dir, function (err, list) {
    if (err) return done(err);
    let pending = list.length;
    if (!pending) return done(null, results);
    list.forEach(function (file) {
      file = path.resolve(dir, file);
      fs.stat(file, function (err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function (err, res) {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
          results.push(file);
          if (!--pending) done(null, results);
        }
      });
    });
  });
};

const minifyHtmlFiles = function (dir, ext = ".html") {
  walk(dir, function (err, results) {
    if (err) throw err;
    results.forEach(function (file) {
      if (path.extname(file) === ext) {
        fs.readFile(file, "utf8", function (err, data) {
          if (err) throw err;
          const minified = minify(data, minifyOptions);
          fs.writeFile(file, minified, function (err) {
            if (err) throw err;
            console.log(`Minified ${file}`);
          });
        });
      }
    });
  });
};

minifyHtmlFiles("_site");
minifyHtmlFiles("_site", ".css");
