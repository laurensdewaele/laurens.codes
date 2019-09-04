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
  const desktopWidth = 1200;
  const mobileWidth = 500;
  const blogpost = {
    filename: "",
    file: "",
    markdown: "",
    html: "",
    title: "",
    createdDate: null,
    svg: {
      originalHtml: "",
      originalPath: "",
      alt: "",
      description: "",
      extension: "",
      relativePathFromInsideScriptsFolder: ""
    },
    images: [
      {
        description: "",
        extension: "",
        relativePathFromInsideScriptsFolder: "",
        originalPath: "",
        originalHtml: "",
        repsonsiveHtml: "",
        alt: "",
        optimizedImages: {
          mobile: {
            originalFormat: "example_w_500.png",
            webP: "example_w_500.webp"
          },
          desktop: {
            originalFormat: "example_w_1200.png",
            webP: "example_w_1200.webp"
          },
          html: ""
        }
      }
    ]
  };
  const { file, filename } = await getFile();
  blogpost.file = file;
  blogpost.filename = filename;
  blogpost.createdDate = extractCreatedDate(blogpost.file);
  blogpost.markdown = fs.readFileSync(blogpost.file, {
    encoding: "UTF-8"
  });
  blogpost.html = convertMarkdownToHtml(blogpost.markdown);
  blogpost.title = blogpost.html.match(/<h1>(.*)<\/h1>/)[1];

  const foundImagesWithCapturingGroups = [
    ...blogpost.html.matchAll(/<img src="(.*)" alt="(.*)" \/>/g)
  ];
  const images = mapImages(foundImagesWithCapturingGroups);
  // The first referenced image will always be the blogpost logo svg
  blogpost.svg = images[0];
  images.shift();
  blogpost.images = await resizeImages(images, desktopWidth, mobileWidth);
  await optimizeImages(extractAllImagePaths(blogpost.images));
  blogpost.images = createResponsiveImageHtml(
    blogpost.images,
    desktopWidth,
    mobileWidth
  );
  blogpost.html = runPrettierOnHtml(
    insertResponsiveImages(blogpost.html, blogpost.images)
  );
  // console.log(__dirname);
  console.log(blogpost.html);
  // console.log(JSON.stringify(blogpost.images));
  // console.log(blogpost.images[0].optimizedImages.mobile);
  // console.log(blogpost.images[0].optimizedImages.desktop);
  // //Inline svg
}

function stripPathForImages(path) {
  return path.replace("../website/", "./");
}

function createResponsiveImageHtml(images, desktopWidth, mobileWidth) {
  return images.map(image => ({
    ...image,
    optimizedImages: {
      ...image.optimizedImages,
      html: `
              <picture>
                <source
                  type="image/webp"
                  srcset="
                    ${stripPathForImages(
                      image.optimizedImages.desktop.webP
                    )}  ${desktopWidth}w,
                    ${stripPathForImages(
                      image.optimizedImages.mobile.webP
                    )}  ${mobileWidth}w,
                  "
                />
                <source
                  srcset="
                  ${stripPathForImages(
                    image.optimizedImages.desktop.originalFormat
                  )}  ${desktopWidth}w,
                  ${stripPathForImages(
                    image.optimizedImages.mobile.originalFormat
                  )}  ${mobileWidth}w,
                  "
                />
                <img src="${stripPathForImages(
                  image.optimizedImages.desktop.originalFormat
                )}" alt="${image.alt}" />
              </picture>
            `
    }
  }));
}

function insertResponsiveImages(html, images) {
  let newHtml = html;
  images.forEach(image => {
    newHtml = newHtml.replace(image.originalHtml, image.optimizedImages.html);
  });
  return newHtml;
}

function mapImages(foundImagesWithRegex) {
  return foundImagesWithRegex.map(([originalHtml, originalPath, alt]) => {
    return {
      originalHtml,
      originalPath,
      alt,
      description: originalPath.match(/(\w*)\.\w{3,4}$/)[1],
      extension: /\w{3,4}$/.exec(originalPath)[0],
      relativePathFromInsideScriptsFolder: `../content_draft/${originalPath}`
    };
  });
}

function getFile() {
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

    resolve({ file, filename });
  });
}

function extractCreatedDate(file) {
  const { birthTime } = fs.statSync(file);
  return moment(birthTime).format("YYYY-MM-DD");
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
  const readyPath = `../website/assets/images/${svgIconPathRelativeToDraft}`;
  fs.copyFileSync(draftPath, readyPath, e => {
    e && console.log(e);
  });
  return readyPath;
}

function resizeImages(images, desktopWidth, mobileWidth) {
  const mobilePromises = [];
  const desktopPromises = [];

  images.forEach(image => {
    const { originalPath, description, extension } = image;
    const desktopOutputPath = `../website/assets/images/${description}_w_${desktopWidth}.${extension}`;
    const desktopWebPOutputPath = `../website/assets/images/${description}_w_${desktopWidth}.webp`;
    const mobileOutputPath = `../website/assets/images/${description}_w_${mobileWidth}.${extension}`;
    const mobileWebPOutputPath = `../website/assets/images/${description}_w_${mobileWidth}.webp`;
    const inputPath = `../content_draft/${originalPath}`;

    desktopPromises.push(
      resizeAndCreateWebp(
        inputPath,
        desktopOutputPath,
        desktopWebPOutputPath,
        desktopWidth
      )
    );
    mobilePromises.push(
      resizeAndCreateWebp(
        inputPath,
        mobileOutputPath,
        mobileWebPOutputPath,
        mobileWidth
      )
    );
  });

  return new Promise((resolve, reject) => {
    Promise.all([...desktopPromises, ...mobilePromises])
      .then(createdImages => {
        const createdDesktop = createdImages.slice(0, images.length);
        const createdMobile = createdImages.slice(
          images.length,
          images.length * 2
        );

        const optimizedImages = images.map((image, imageIndex) => {
          return {
            ...image,
            optimizedImages: {
              desktop: createdDesktop[imageIndex],
              mobile: createdMobile[imageIndex]
            }
          };
        });
        resolve(optimizedImages);
      })
      .catch(e => {
        console.log(e);
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
        console.log("successfully optimized all images");
        resolve();
      })
      .catch(e => {
        console.log(e);
        reject(e);
      });
  });
}

function convertMarkdownToHtml(markdown) {
  const converter = new showdown.Converter({ noHeaderId: true });
  const html = converter.makeHtml(markdown);
  return runPrettierOnHtml(html);
}

function runPrettierOnHtml(file) {
  return prettier.format(file, { parser: "html" });
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
