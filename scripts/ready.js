const fs = require("fs");
const showdown = require("showdown");

const injectBlogIntoGenericHtml = require("./inject_blog_into_generic_html");
const {
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
} = require("./functions");

createHtmlFile();

async function createHtmlFile() {
  const desktopWidth = 1200;
  const mobileWidth = 500;

  try {
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
    // The first referenced image will always be the blogpost logo svg
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
