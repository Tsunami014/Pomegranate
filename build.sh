#!/bin/sh
set -e

minify extras/tln.js -o extras/tln.min.js
minify extras/tln.css -o extras/tln.min.css

for dir in ./main ./pseudocode; do
    cd "$dir"
    echo "$dir"
    mkdir -p build
    cat main.js | minify --type js -o build/main.js
    minify style.css -o build/style.css
    if [[ "$dir" = "./main" ]]; then
        minify debug.html -o ../index.html
        sed -i 's|\./|./main/build/|g' ../index.html
    else
        minify debug.html -o index.html
        sed -i 's|\./|./build/|g' index.html
    fi
    cd - >/dev/null
done
