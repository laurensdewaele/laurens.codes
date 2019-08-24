#!/bin/sh

echo 'Converting markdown files to html...'

pandoc -f markdown-auto_identifiers ../content/hooks.md -o ../content/hooks.html	


echo 'Prettifying files...'
prettier --write ../content/*.html