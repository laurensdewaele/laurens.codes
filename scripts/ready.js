const chalk = require('chalk');
const fs = require('fs');
const moment = require('moment');
const prompts = require('prompts');
const sharp = require('sharp');

ready();

async function ready() {
  const { filename } = await promtFilename();
  const file = `../content_draft/${filename}.md`;

  const exists = filenameExists(file);
  if (!exists) {
    console.log(chalk.red(`${filename}.md not present in content_draft`));
    return;
  }

  const createdDate = extractCreatedDate(file);
  const allImagesRe = /(\.\/images\/.*(?=\)))/g;
  const fileAsText = fs.readFileSync(file, { encoding: 'UTF-8' });
  const imagePaths = fileAsText.match(allImagesRe);
  resizeImages(imagePaths, 1200, 500);
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

function addInfoToImagePaths(imagePaths) {
  const fileRe = /\w*\.\w{3,4}$/;
  return imagePaths.map(path => {
    const file = fileRe.exec(path)[0];
    const relativePathFromInsideScriptsFolder = `../content_draft/${path}`;
    return {
      path,
      file,
      relativePathFromInsideScriptsFolder
    };
  });
}

function resize(file, path, width) {
  return sharp(path)
    .resize(width)
    .toFile(`../content_ready/images/${file}`);
}

function resizeImages(imagePaths, desktopWidth, mobileWidth) {
  const resizeTasks = [];
  const images = addInfoToImagePaths(imagePaths);
  images.forEach(image => {
    const { file, relativePathFromInsideScriptsFolder } = image;
    resizeTasks.push(
      resize(file, relativePathFromInsideScriptsFolder, desktopWidth)
    );
    resizeTasks.push(
      resize(file, relativePathFromInsideScriptsFolder, mobileWidth)
    );
  });
  console.log(resizeTasks);
  Promise.all(resizeTasks)
    .then(_ => console.log('yay'))
    .catch(e => console.log('naay', e));
}
