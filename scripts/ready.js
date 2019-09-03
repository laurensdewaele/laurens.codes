const chalk = require("chalk");
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
const showdown = require("showdown");

ready();

async function ready() {
  const blogpost = {
    filename: "",
    markdown: "",
    html: "",
    title: "",
    createdDate: null,
    thumbnailSvg: "",
    images: [
      {
        example: [
          {
            mobile: {
              original: "example_w_500.png",
              webP: "example_w_500.webp"
            },
            desktop: {
              original: "example_w_1200.png",
              webP: "example_w_1200.webp"
            }
          }
        ]
      }
    ]
  };

  const { filename } = await promtFilename();
  blogpost.filename = filename;
  const file = `../content_draft/${filename}.md`;

  const exists = filenameExists(file);
  if (!exists) {
    console.log(chalk.red(`${filename}.md not present in content_draft`));
    return;
  }

  blogpost.createdDate = extractCreatedDate(file);
  blogpost.markdown = fs.readFileSync(file, { encoding: "UTF-8" });
  blogpost.html = convertMarkdownToHtml(blogpost.markdown);
  blogpost.title = blogpost.html.match(/<h1>(.*)<\/h1>/)[1];

  const allImagesRe = /(\.\/images\/.*(?=\)))/g;
  const imagePaths = blogpost.markdown.match(allImagesRe);
  const { thumbnailSvg, images } = await resizeImages(imagePaths, 1200, 500);
  blogpost.thumbnailSvg = thumbnailSvg;
  blogpost.images = images;
  console.log("created images", JSON.stringify(images));
  optimizeImages(images);
}

function promtFilename() {
  return prompts({
    type: "text",
    name: "filename",
    message: `Enter the draft blogpost filename that's ready (without extension)`
  });
}

function filenameExists(file) {
  return fs.existsSync(file);
}

function extractCreatedDate(file) {
  const { birthTime } = fs.statSync(file);
  return moment(birthTime).format("YYYY-MM-DD");
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
  const webPOutputPath = `../content_ready/images/${description}_w_${width}.webp`;

  return new Promise((resolve, reject) => {
    sharp(path)
      .resize({ width, options: { withoutEnlargement: true } })
      .toFile(outputPath)
      .then(_ => {
        sharp(outputPath)
          .webp({ lossless: true })
          .toFile(webPOutputPath)
          .then(_ => {
            const image = {
              [description]: {
                mobile: {
                  orginal: outputPath,
                  webP: webPOutputPath
                }
              }
            };
            resolve(image);
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

function copySvg(svgIconPathRelativeToDraft) {
  const draftPath = `../content_draft/${svgIconPathRelativeToDraft}`;
  const readyPath = `../content_ready/${svgIconPathRelativeToDraft}`;
  fs.copyFileSync(draftPath, readyPath, e => {
    e && console.log(e);
  });
  return readyPath;
}

function resizeImages(imagePaths, desktopWidth, mobileWidth) {
  const createdImages = {
    thumbnailSvg: "",
    images: []
  };
  const resizePromises = [];

  // The first referenced image will always be an svg.
  const thumbnailSvgPath = imagePaths[0];
  createdImages.thumbnailSvg = copySvg(thumbnailSvgPath);

  // Remove svg. We do not need to resize this.
  imagePaths.shift();

  const images = addDescriptionAndFileExtension(imagePaths);

  images.forEach(image => {
    const {
      relativePathFromInsideScriptsFolder,
      description,
      extension
    } = image;

    resizePromises.push(
      resizeAndCreateWebp(
        description,
        extension,
        relativePathFromInsideScriptsFolder,
        desktopWidth
      )
    );
    resizePromises.push(
      resizeAndCreateWebp(
        description,
        extension,
        relativePathFromInsideScriptsFolder,
        mobileWidth
      )
    );
  });

  return new Promise((resolve, reject) => {
    Promise.all(resizePromises)
      .then(images => {
        createdImages.images.push(...images.flat());
        resolve(createdImages);
      })
      .catch(e => {
        console.log(e);
        reject();
      });
  });
}

async function optimizeImages(images) {
  const svgImages = images.filter(image => /svg$/.test(image));
  const jpegImages = images.filter(image => /jpe?g$/.test(image));
  const pngImages = images.filter(image => /png$/.test(image));
  const webPImages = images.filter(image => /webp$/.test(image));

  const destination = "../content_ready/images_optimized";

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

  Promise.all(promises)
    .then(f => console.log("successfully optimized all images"))
    .catch(e => console.log(e));
}

function convertMarkdownToHtml(markdown) {
  const converter = new showdown.Converter({ noHeaderId: true });
  const html = converter.makeHtml(markdown);
  return runPrettierOnHtml(html);
}

function runPrettierOnHtml(file) {
  return prettier.format(file, { parser: "html" });
}
