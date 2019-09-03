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
    file: "",
    markdown: "",
    html: "",
    title: "",
    createdDate: null,
    thumbnailSvgPath: "",
    images: [
      {
        description: "",
        extension: "",
        relativePathFromInsideScriptsFolder: "",
        originalPath: "",
        originalHtml: "",
        repsonsiveHtml: "",
        alt: "",
        files: {
          mobile: {
            original: "example_w_500.png",
            webP: "example_w_500.webp"
          },
          desktop: {
            original: "example_w_1200.png",
            webP: "example_w_1200.webp"
          }
        }
      }
    ]
  };
  const desktopWidth = 1200;
  const mobileWidth = 500;

  blogpost.file = await getMarkdownFile();
  blogpost.createdDate = extractCreatedDate(blogpost.file);
  blogpost.markdown = fs.readFileSync(blogpost.file, { encoding: "UTF-8" });
  blogpost.html = convertMarkdownToHtml(blogpost.markdown);
  console.log(blogpost.html);
  blogpost.title = blogpost.html.match(/<h1>(.*)<\/h1>/)[1];

  const allImagesRe = /<img src="(.*)" alt="(.*)" \/>/g;
  const foundImagesWithCapturingGroups = [
    ...blogpost.html.matchAll(allImagesRe)
  ];
  blogpost.images = mapImages(foundImagesWithCapturingGroups);
  console.log(blogpost.images);

  // // The first referenced image will always be an svg.
  // blogpost.thumbnailSvgPath = copySvg(allImagePaths[0]);
  // // Remove svg. We do not need to resize this.
  // allImagePaths.shift();
  // const images = await resizeImages(
  //   addDescriptionAndFileExtension(allImagePaths),
  //   desktopWidth,
  //   mobileWidth
  // );
  // blogpost.images = images;
  // console.log("created images", JSON.stringify(images));
  // optimizeImages(images);

  // //TODO : Generate responsive image html
  // //Inline svg
}

function mapImages(foundImagesWithRegex) {
  const images = foundImagesWithRegex.map(
    ([originalHtml, originalPath, alt]) => {
      return {
        originalHtml,
        originalPath,
        alt,
        description: originalPath.match(/(\w*)\.\w{3,4}$/)[1],
        extension: /\w{3,4}$/.exec(originalPath)[0],
        relativePathFromInsideScriptsFolder: `../content_draft/${originalPath}`
      };
    }
  );
  console.log(images);
}

function getMarkdownFile() {
  return new Promise(async resolve => {
    const { filename } = await prompts({
      type: "text",
      name: "filename",
      message: `Enter the draft blogpost filename that's ready (without extension)`
    });

    const file = `../content_draft/${filename}.md`;
    if (!fs.existsSync(file)) {
      throw new Error("`${filename}.md not present in content_draft`");
    }

    resolve(file);
  });
}

function extractCreatedDate(file) {
  const { birthTime } = fs.statSync(file);
  return moment(birthTime).format("YYYY-MM-DD");
}

function resizeAndCreateWebp(description, extension, path, width) {
  const outputPath = `../content_ready/images/${description}_w_${width}.${extension}`;
  const webPOutputPath = `../content_ready/images/${description}_w_${width}.webp`;

  // {
  //   originalHtml: "",
  //   repsonsiveHtml: "",
  //   text: "",
  //   alt: "",
  //   files: {
  //     mobile: {
  //       original: "example_w_500.png",
  //       webP: "example_w_500.webp"
  //     },
  //     desktop: {
  //       original: "example_w_1200.png",
  //       webP: "example_w_1200.webp"
  //     }
  //   }
  // }

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

function resizeImages(images, desktopWidth, mobileWidth) {
  const createdImages = [];
  const resizePromises = [];

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
        createdImages.push(...images.flat());
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

function generateHtmlForImage(image) {
  // Image example
  // {
  //   example: [
  //     {
  //       mobile: {
  //         original: "example_w_500.png",
  //         webP: "example_w_500.webp"
  //       },
  //       desktop: {
  //         original: "example_w_1200.png",
  //         webP: "example_w_1200.webp"
  //       }
  //     }
  //   ]
  // }
}
