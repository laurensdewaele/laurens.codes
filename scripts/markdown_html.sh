#!/bin/sh

echo 'Converting markdown files to html...'
FILES=../content_ready/*.md
for f in $FILES
do
	echo "Processing $f files..."
done


# pandoc -f markdown-auto_identifiers ../content_ready/*.md -o ../content_ready/*.html
echo 'Prettifying files...'
prettier --write ../content_ready/*.html