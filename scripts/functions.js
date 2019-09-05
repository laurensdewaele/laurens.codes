/**
 * These are functions that do not reference any self created ones. Only third party ones.
 */

const fs = require("fs");
const imagemin = require("imagemin");
const imageminJpegtran = require("imagemin-jpegtran");
const imageminPngquant = require("imagemin-pngquant");
const imageminSvgo = require("imagemin-svgo");
const imageminWebp = require("imagemin-webp");
const moment = require("moment");
const prettier = require("prettier");
const prompts = require("prompts");
const sharp = require("sharp");

module.exports = {
  copySvg,
  extractAllImagePaths,
  extractCreatedDate,
  findAllImages,
  getDescription,
  getFile,
  getKeywords,
  insertResponsiveImages,
  mapImages,
  optimizeImages,
  removeHeaderAndSvgFromHtml,
  resizeAndCreateWebp,
  runPrettierOnHtml,
  stripRelativePathForImages
};

function runPrettierOnHtml(file) {
  return prettier.format(file, { parser: "html" });
}

function mapImages(foundImagesWithRegex) {
  return foundImagesWithRegex.map(([originalHtml, originalPath, alt]) => {
    return {
      originalHtml,
      originalPath,
      alt,
      description: originalPath.match(/(\w*)\.\w{3,4}$/)[1],
      extension: /\w{3,4}$/.exec(originalPath)[0],
      relativePath: `../content_draft/${originalPath}`
    };
  });
}

function resizeAndCreateWebp(inputPath, outputPath, webPOutputPath, width) {
  return new Promise((resolve, reject) => {
    sharp(inputPath)
      .resize({ width, options: { withoutEnlargement: true } })
      .toFile(outputPath)
      .then(_ => {
        sharp(outputPath)
          .webp({ lossless: true })
          .toFile(webPOutputPath)
          .then(_ => {
            resolve({
              originalFormat: outputPath,
              webP: webPOutputPath
            });
          })
          .catch(e => {
            reject(e);
          });
      })
      .catch(e => {
        reject(e);
      });
  });
}

function optimizeImages(images) {
  const svgImages = images.filter(image => /svg$/.test(image));
  const jpegImages = images.filter(image => /jpe?g$/.test(image));
  const pngImages = images.filter(image => /png$/.test(image));
  const webPImages = images.filter(image => /webp$/.test(image));

  const destination = "../website/assets/images";

  const promises = [
    imagemin(svgImages, { destination, plugins: [imageminSvgo({})] }),
    imagemin(jpegImages, { destination, plugins: [imageminJpegtran()] }),
    imagemin(pngImages, {
      destination,
      plugins: [imageminPngquant({ strip: true })]
    }),
    imagemin(webPImages, {
      destination,
      plugins: [imageminWebp({ quality: 80 })]
    })
  ];

  return new Promise((resolve, reject) => {
    Promise.all(promises)
      .then(f => {
        console.log("Optimization successful");
        resolve();
      })
      .catch(e => {
        reject(e);
      });
  });
}

function getFile() {
  return new Promise(async (resolve, reject) => {
    try {
      const { filename } = await prompts({
        type: "text",
        name: "filename",
        message: `Enter the draft blogpost filename that's ready (without extension)`
      });

      const file = `../content_draft/${filename}.md`;
      if (!fs.existsSync(file)) {
        throw new Error(`${filename}.md not present in ./content_draft`);
      }

      resolve({ file, filename });
    } catch (e) {
      reject(e);
    }
  });
}

function getKeywords() {
  return new Promise(async resolve => {
    const { keywords } = await prompts({
      type: "text",
      name: "keywords",
      message: `Enter some keywords with spaces. E.g.: angular, testing, frontend`
    });
    resolve(keywords);
  });
}

function getDescription() {
  return new Promise(async resolve => {
    const { description } = await prompts({
      type: "text",
      name: "description",
      message: `Enter the blog's description. E.g.: Blogpost about testing in Angular`
    });
    resolve(description);
  });
}

function copySvg(draftPath, description) {
  const readyPath = `../website/assets/images/${description}.svg`;
  fs.copyFileSync(draftPath, readyPath, e => {
    e && console.log(e);
  });
  return readyPath;
}

function findAllImages(html) {
  const foundImagesWithCapturingGroups = [
    ...html.matchAll(/<img src="(.*)" alt="(.*)" \/>/g)
  ];
  return foundImagesWithCapturingGroups;
}

function removeHeaderAndSvgFromHtml(html) {
  return html.replace(/^<h1>.*\n.*<\/p>/gm, "");
}

function stripRelativePathForImages(path) {
  return path.replace("../website/", "./");
}

function insertResponsiveImages(html, images) {
  let newHtml = html;
  images.forEach(image => {
    newHtml = newHtml.replace(image.originalHtml, image.optimizedImages.html);
  });
  return newHtml;
}

function extractCreatedDate(file) {
  const { birthTime } = fs.statSync(file);
  return moment(birthTime).format("YYYY-MM-DD");
}

function extractAllImagePaths(images) {
  const imagePaths = [];
  images.forEach(image => {
    imagePaths.push(image.optimizedImages.desktop.originalFormat);
    imagePaths.push(image.optimizedImages.desktop.webP);
    imagePaths.push(image.optimizedImages.mobile.originalFormat);
    imagePaths.push(image.optimizedImages.mobile.webP);
  });
  return imagePaths;
}
