#!/bin/sh
set -e

for dir in ./main ./extras ./pseudocode; do
    cd "$dir"
    echo "$dir"
    ./build.sh
    cd - >/dev/null
done
