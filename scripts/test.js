{
  filename: 'test',
  file: '../content_draft/test.md',
  markdown: '# test\n\n![testing 1](./images/regex.svg)\n\n' +
    '![testing 2](./images/design_1.png)\n\n![testing ' +
    '4](./images/test.jpeg)\n\n![testing ' +
    '5](./images/design_2.png)\n',
  html: '<h1>test</h1>\n<p><img src="./images/regex.svg" alt="testing 1" /></p>\n<p>\n' +
    '  <picture>\n    <source\n      type="image/webp"\n      srcset="\n        ' +
    './assets/images/design_1_w_1200.webp 1200w,\n        ' +
    './assets/images/design_1_w_500.webp   500w\n      "\n    />\n    <source\n    ' +
    '  srcset="\n        ./assets/images/design_1_w_1200.png 1200w,\n        ' +
    './assets/images/design_1_w_500.png   500w\n      "\n    />\n    <img ' +
    'src="./assets/images/design_1_w_1200.png" alt="testing 2" />\n  </picture>\n' +
    '</p>\n<p>\n  <picture>\n    <source\n      type="image/webp"\n      srcset="\n  ' +
    '      ./assets/images/test_w_1200.webp 1200w,\n        ' +
    './assets/images/test_w_500.webp   500w\n      "\n    />\n    <source\n      ' +
    'srcset="\n        ./assets/images/test_w_1200.jpeg 1200w,\n        ' +
    './assets/images/test_w_500.jpeg   500w\n      "\n    />\n    <img ' +
    'src="./assets/images/test_w_1200.jpeg" alt="testing 4" />\n  </picture>\n' +
    '</p>\n<p>\n  <picture>\n    <source\n      type="image/webp"\n      srcset="\n  ' +
    '      ./assets/images/design_2_w_1200.webp 1200w,\n        ' +
    './assets/images/design_2_w_500.webp   500w\n      "\n    />\n    <source\n    ' +
    '  srcset="\n        ./assets/images/design_2_w_1200.png 1200w,\n        ' +
    './assets/images/design_2_w_500.png   500w\n      "\n    />\n    <img ' +
    'src="./assets/images/design_2_w_1200.png" alt="testing 5" />\n  </picture>\n' +
    '</p>\n',
  title: 'test',
  createdDate: '2019-09-04',
  svg: {
    originalHtml: '<img src="./images/regex.svg" alt="testing 1" />',
    originalPath: './images/regex.svg',
    alt: 'testing 1',
    description: 'regex',
    extension: 'svg',
    relativePathFromInsideScriptsFolder: '../content_draft/./images/regex.svg'
  },
  images: [
    {
      originalHtml: '<img src="./images/design_1.png" alt="testing 2" />',
      originalPath: './images/design_1.png',
      alt: 'testing 2',
      description: 'design_1',
      extension: 'png',
      relativePathFromInsideScriptsFolder: '../content_draft/./images/design_1.png',
      optimizedImages: [Object]
    },
    {
      originalHtml: '<img src="./images/test.jpeg" alt="testing 4" />',
      originalPath: './images/test.jpeg',
      alt: 'testing 4',
      description: 'test',
      extension: 'jpeg',
      relativePathFromInsideScriptsFolder: '../content_draft/./images/test.jpeg',
      optimizedImages: [Object]
    },
    {
      originalHtml: '<img src="./images/design_2.png" alt="testing 5" />',
      originalPath: './images/design_2.png',
      alt: 'testing 5',
      description: 'design_2',
      extension: 'png',
      relativePathFromInsideScriptsFolder: '../content_draft/./images/design_2.png',
      optimizedImages: [Object]
    }
  ]
}