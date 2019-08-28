#!/bin/sh

echo 'Converting markdown files to html...'
files=../content_ready/*.md
for file in $files
do
	regex='/.md/'
	echo $regex
	echo "Processing $file file..."
done


# pandoc -f markdown-auto_identifiers ../content_ready/*.md -o ../content_ready/*.html
echo 'Prettifying files...'
prettier --write ../content_ready/*.html