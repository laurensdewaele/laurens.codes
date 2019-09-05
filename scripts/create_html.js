const fs = require("fs");
const showdown = require("showdown");
const imagemin = require("imagemin");
const imageminJpegtran = require("imagemin-jpegtran");
const imageminPngquant = require("imagemin-pngquant");
const imageminSvgo = require("imagemin-svgo");
const imageminWebp = require("imagemin-webp");
const moment = require("moment");
const prettier = require("prettier");
const prompts = require("prompts");
const sharp = require("sharp");

const {
  createArticleHeader,
  injectBlogIntoGenericHtml
} = require("./inject_blog_into_html");

createHtml();

async function createHtml() {
  try {
    const desktopWidth = 1200;
    const mobileWidth = 500;

    const { file, filename } = await getFile();
    const keywords = await getKeywords();
    const description = await getDescription();
    const createdDate = extractCreatedDate(file);
    const markdown = fs.readFileSync(file, {
      encoding: "UTF-8"
    });
    const markdownConversionHtml = convertMarkdownToHtml(markdown);
    const title = markdownConversionHtml.match(/<h1>(.*)<\/h1>/)[1];
    const allImages = mapImages(findAllImages(markdownConversionHtml));
    // The first referenced image will always be the blogpost's svg
    const svg = await createSvg(allImages[0]);
    const images = allImages.slice(1, allImages.length);
    const imagesWithHtml = await createImages(
      images,
      desktopWidth,
      mobileWidth
    );
    const html = createCompleteHtml(
      markdownConversionHtml,
      imagesWithHtml,
      description,
      keywords,
      svg,
      title,
      createdDate
    );
    fs.writeFileSync(`../website/${filename}.html`, html);

    // Write to index.html
    const indexHtml = fs.readFileSync("../website/index.html", {
      encoding: "UTF-8"
    });
    const newIndexHtml = runPrettierOnHtml(
      indexHtml.replace(
        "<main>",
        `<main>
          <article>
            ${createArticleHeader(svg, title, createdDate)}
          </article>`
      )
    );
    fs.writeFileSync("../website/index.html", newIndexHtml);
    console.log(html);
    console.log(newIndexHtml);

    // Write JSON for eventual SPA feel
  } catch (e) {
    console.log(e);
  }
}

function createCompleteHtml(
  markdownConversionHtml,
  imagesWithHtml,
  description,
  keywords,
  svg,
  title,
  createdDate
) {
  const htmlWithResponsiveImages = runPrettierOnHtml(
    insertResponsiveImages(markdownConversionHtml, imagesWithHtml)
  );
  const htmlWithoutHeaderAndSvg = removeHeaderAndSvgFromHtml(
    htmlWithResponsiveImages
  );
  const html = runPrettierOnHtml(
    injectBlogIntoGenericHtml(
      htmlWithoutHeaderAndSvg,
      description,
      keywords,
      svg,
      title,
      createdDate
    )
  );
  return html;
}

async function createImages(images, desktopWidth, mobileWidth) {
  return new Promise(async (resolve, reject) => {
    try {
      const createdResizedImages = await resizeImages(
        images,
        desktopWidth,
        mobileWidth
      );
      await optimizeImages(extractAllImagePaths(createdResizedImages));
      const imagesWithHtml = createResponsiveImageHtml(
        createdResizedImages,
        desktopWidth,
        mobileWidth
      );
      resolve(imagesWithHtml);
    } catch (e) {
      reject(e);
    }
  });
}

async function createSvg(image) {
  return new Promise(async (resolve, reject) => {
    const { relativePath, description, alt } = image;
    const optimizedPath = copySvg(relativePath, description);

    try {
      await optimizeImages([optimizedPath]);
    } catch (e) {
      reject(e);
    }

    const accessibleSvg = createAccessibleSvg(optimizedPath, alt);
    resolve(accessibleSvg);
  });
}

function createAccessibleSvg(path, description) {
  const svg = runPrettierOnHtml(
    fs.readFileSync(path, {
      encoding: "UTF-8"
    })
  );
  const svgWithAria = svg.replace("<svg ", `<svg aria-labelledby="svgDesc" `);
  const tag = svgWithAria.match(/(^<svg.*>)/g);
  return runPrettierOnHtml(
    svgWithAria.replace(
      /^<svg.*>/g,
      `${tag} \n <desc id="svgDesc">${description}</desc>`
    )
  );
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
                    ${stripRelativePathForImages(
                      image.optimizedImages.desktop.webP
                    )}  ${desktopWidth}w,
                    ${stripRelativePathForImages(
                      image.optimizedImages.mobile.webP
                    )}  ${mobileWidth}w,
                  "
                />
                <source
                  srcset="
                  ${stripRelativePathForImages(
                    image.optimizedImages.desktop.originalFormat
                  )}  ${desktopWidth}w,
                  ${stripRelativePathForImages(
                    image.optimizedImages.mobile.originalFormat
                  )}  ${mobileWidth}w,
                  "
                />
                <img src="${stripRelativePathForImages(
                  image.optimizedImages.desktop.originalFormat
                )}" alt="${image.alt}" />
              </picture>
            `
    }
  }));
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
        reject(e);
      });
  });
}

function convertMarkdownToHtml(markdown) {
  const converter = new showdown.Converter({ noHeaderId: true });
  const html = converter.makeHtml(markdown);
  return runPrettierOnHtml(html);
}

/**
 * Below are functions that do not reference any self created ones. Only third party ones.
 */

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
  return new Promise(async (resolve, reject) => {
    try {
      const { keywords } = await prompts({
        type: "text",
        name: "keywords",
        message: `Enter some keywords with spaces. E.g.: angular, testing, frontend`
      });
      resolve(keywords);
    } catch (e) {
      reject(e);
    }
  });
}

function getDescription() {
  return new Promise(async (resolve, reject) => {
    try {
      const { description } = await prompts({
        type: "text",
        name: "description",
        message: `Enter the blog's description. E.g.: Blogpost about testing in Angular`
      });
      resolve(description);
    } catch (e) {
      reject(e);
    }
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
