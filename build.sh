#!/bin/sh
set -e

cat src/main.js | minify --type js -o build/index.js
minify base/main.css -o build/index.css
minify base/main.html -o index.html
