#!/bin/sh
set -e

minify extras/tln.js -o extras/tln.min.js
minify extras/tln.css -o extras/tln.min.css

for dir in ./main ./pseudocode; do
    cd "$dir"
    echo "$dir"
    mkdir -p build
    cat main.js | minify --type js -o main.min.js
    minify style.css -o style.min.css
    if [[ "$dir" = "./main" ]]; then
        minify main.html -o ../index.html
    else
        minify main.html -o index.html
    fi
    cd - >/dev/null
done
