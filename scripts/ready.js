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

function addDescriptionAndFileExtension(imagePaths) {
  const descriptionRe = /(\w*)\.\w{3,4}$/;
  const extensionRe = /\w{3,4}$/;
  return imagePaths.map(path => {
    const description = path.match(descriptionRe)[1];
    const relativePathFromInsideScriptsFolder = `../content_draft/${path}`;
    const extension = extensionRe.exec(path)[0];
    return {
      description,
      relativePathFromInsideScriptsFolder,
      extension
    };
  });
}

function resizeAndCreateWebp(description, extension, path, width) {
  const outputPath = `../content_ready/images/${description}_w_${width}.${extension}`;
  const webpOutputPath = `../content_ready/images/${description}_w_${width}.webp`;

  return new Promise((resolve, reject) => {
    sharp(path)
      .resize({ width, options: { withoutEnlargement: true } })
      .toFile(outputPath)
      .then(_ => {
        sharp(outputPath)
          .webp({ lossless: true })
          .toFile(webpOutputPath)
          .then(_ => {
            resolve([outputPath, webpOutputPath]);
          })
          .catch(err => {
            reject(err);
          });
      })
      .catch(err => {
        reject(err);
      });
  });
}

function resizeImages(imagePaths, desktopWidth, mobileWidth) {
  const createdImages = [];
  const resizePromises = [];

  // The first referenced image will always be an svg. We do not need to resize this
  const svgIcon = imagePaths[0];
  imagePaths.shift();

  const images = addDescriptionAndFileExtension(imagePaths);

  images.forEach(async image => {
    let desktopImages = [];
    let mobileImages = [];

    const {
      relativePathFromInsideScriptsFolder,
      description,
      extension
    } = image;
    try {
      desktopImages = await resizeAndCreateWebp(
        description,
        extension,
        relativePathFromInsideScriptsFolder,
        desktopWidth
      );
      mobileImages = await resizeAndCreateWebp(
        description,
        extension,
        relativePathFromInsideScriptsFolder,
        mobileWidth
      );
      console.log(desktopImages, mobileImages)
      createdImages.push(...desktopImages, ...mobileImages);
    } catch (e) {
      console.log(e);
    }
  });
  console.log('finished', createdImages);
}
