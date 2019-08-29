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
  resizeImages(imagePaths)
    .then(_ => chalk.green('Successfully resized referenced images'))
    .catch(error => chalk.red(`Error in resizing images: ${error}`));
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
  const descriptionRe = /^\.\/images\/(.*)\..{3,4}$/;
  return imagePaths.map(path => {
    const description = path.match(descriptionRe)[1];
    const relativePathFromInsideScriptsFolder = `.${imagePath}`;
    return {
      path,
      description,
      relativePathFromInsideScriptsFolder
    };
  });
}

function resize(path, width, description) {
  return sharp(path)
    .resize(width)
    .toFile(`../content_ready/images/${description}`);
}

function resizeImages(imagePaths, desktopWidth, mobileWidth) {
  const resizeTasks = [];
  const images = addInfoToImagePaths(imagePaths);
  images.forEach(image => {
    const { description, relativePathFromInsideScriptsFolder } = image;
    resizeTasks.push(
      resize(relativePathFromInsideScriptsFolder, desktopWidth, description)
    );
    resizeTasks.push(
      resize(relativePathFromInsideScriptsFolder, mobileWidth, description)
    );
  });
  return Promise.all(resizeTasks);
}
