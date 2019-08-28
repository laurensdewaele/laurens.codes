const chalk = require('chalk');
const fs = require('fs');
const moment = require('moment');
const prompts = require('prompts');

ready();

async function ready() {
  const { filename } = await promtFilename();
  const file = `../content_draft/${filename}.md`;

  const exists = filenameExists(file);
  if (!exists) {
    console.log(chalk.red(`${filename}.md not present in content_draft`));
    return;
  }

  const createdDate = extractCreatedDate(file)
  const allImagesRe = /(\.\/images\/.*(?=\)))/g;
  const fileContent = fs.readFileSync(file, { encoding: 'UTF-8'})
  console.log(fileContent.match(allImagesRe));
}

function promtFilename() {
  return prompts({
    type: 'text',
    name: 'filename',
    message: `Enter the draft blogpost filename that's ready`
  });
}

function filenameExists(file) {
  return fs.existsSync(file);
}

function extractCreatedDate(file) {
  const { birthTime } = fs.statSync(file);
  return moment(birthTime).format('YYYY-MM-DD');
}
