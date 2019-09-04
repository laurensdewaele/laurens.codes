const test = {
  originalHtml: '<img src="./images/design_1.png" alt="testing 2" />',
  originalPath: "./images/design_1.png",
  alt: "testing 2",
  description: "design_1",
  extension: "png",
  relativePathFromInsideScriptsFolder: "../content_draft/./images/design_1.png",
  optimizedImages: {
    desktop: {
      originalFormat: "../content_ready/images/design_1_w_1200.png",
      webP: "../content_ready/images/design_1_w_1200.webp"
    },
    mobile: {
      originalFormat: "../content_ready/images/design_1_w_500.png",
      webP: "../content_ready/images/design_1_w_500.webp"
    }
  }
};
