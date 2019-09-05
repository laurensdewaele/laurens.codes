/**
 * This is an example of what an image object looks like. 
 */

const image = {
  originalHtml: '<img src="./images/test.jpeg" alt="testing 4" />',
  originalPath: "./images/test.jpeg",
  alt: "testing 4",
  description: "test",
  extension: "jpeg",
  relativePath: "../content_draft/./images/test.jpeg",
  optimizedImages: {
    desktop: {
      originalFormat: "../website/assets/images/test_w_1200.jpeg",
      webP: "../website/assets/images/test_w_1200.webp"
    },
    mobile: {
      originalFormat: "../website/assets/images/test_w_500.jpeg",
      webP: "../website/assets/images/test_w_500.webp"
    },
    html:
      '\n              <picture>\n                <source\n...
  }
},
