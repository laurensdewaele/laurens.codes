{
  filename: 'test',
  file: '../content_draft/test.md',
  keywords: 'aap,beer',
  description: 'haarbaar sdfsdf sss',
  markdown: '# test\n\n![testing 1](./images/regex.svg)\n\n' +
    '![testing 2](./images/design_1.png)\n\n![testing ' +
    '4](./images/test.jpeg)\n\n![testing ' +
    '5](./images/design_2.png)\n',
  html: '\n  <!--\n  __   __  ___     _______  __   __  _______  ______    _______  ' +
    '__\n |  | |  ||   |   |       ||  | |  ||       ||    _ |  |       ||  |\n | ' +
    ' |_|  ||   |   |_     _||  |_|  ||    ___||   | ||  |    ___||  |\n |       ' +
    '||   |     |   |  |       ||   |___ |   |_||_ |   |___ |  |\n |       ||   ' +
    '|     |   |  |       ||    ___||    __  ||    ___||__|\n |   _   ||   |     ' +
    '|   |  |   _   ||   |___ |   |  | ||   |___  __\n |__| |__||___|     |___|  ' +
    '|__| |__||_______||___|  |_||_______||__|\n \n -->\n \n <!DOCTYPE html>\n <html ' +
    'lang="en">\n   <head>\n     <meta charset="utf-8" />\n     <meta ' +
    'name="author" content="Laurens Dewaele" />\n     <meta name="description" ' +
    'content="haarbaar sdfsdf sss" />\n     <meta name="keywords" ' +
    'content="aap,beer,blog, personal, laurens dewaele, software engineering" ' +
    '/>\n     <!--    TODO: Set theme color-->\n     <meta name="theme-color" ' +
    'content="" />\n     <meta name="color-scheme" content="normal" />\n     ' +
    '<meta name="robots" content="index,follow" />\n     <meta name="viewport" ' +
    'content="width=device-width, initial-scale=1" />\n     <title>test</title>\n ' +
    '  </head>\n   <body>\n     <header>\n       <h1><a href="#">Laurens ' +
    'codes</a></h1>\n     </header>\n     <main>\n       <article>\n         ' +
    '<header>\n           <img src="undefined" alt="undefined" />\n           ' +
    '<h2>test</h2>\n           <p>\n             <time datetime="2019-09-04"\n     ' +
    '          >Invalid date\n             </time>\n           </p>\n         ' +
    '</header>\n         <section>\n           <h1>test</h1>\n<p><img ' +
    'src="./images/regex.svg" alt="testing 1" /></p>\n<p>\n  <picture>\n    ' +
    '<source\n      type="image/webp"\n      srcset="\n        ' +
    './assets/images/design_1_w_1200.webp 1200w,\n        ' +
    './assets/images/design_1_w_500.webp   500w\n      "\n    />\n    <source\n     ' +
    ' srcset="\n        ./assets/images/design_1_w_1200.png 1200w,\n        ' +
    './assets/images/design_1_w_500.png   500w\n      "\n    />\n    <img ' +
    'src="./assets/images/design_1_w_1200.png" alt="testing 2" />\n  </picture>\n' +
    '</p>\n<p>\n  <picture>\n    <source\n      type="image/webp"\n      srcset="\n   ' +
    '     ./assets/images/test_w_1200.webp 1200w,\n        ' +
    './assets/images/test_w_500.webp   500w\n      "\n    />\n    <source\n      ' +
    'srcset="\n        ./assets/images/test_w_1200.jpeg 1200w,\n        ' +
    './assets/images/test_w_500.jpeg   500w\n      "\n    />\n    <img ' +
    'src="./assets/images/test_w_1200.jpeg" alt="testing 4" />\n  </picture>\n' +
    '</p>\n<p>\n  <picture>\n    <source\n      type="image/webp"\n      srcset="\n   ' +
    '     ./assets/images/design_2_w_1200.webp 1200w,\n        ' +
    './assets/images/design_2_w_500.webp   500w\n      "\n    />\n    <source\n     ' +
    ' srcset="\n        ./assets/images/design_2_w_1200.png 1200w,\n        ' +
    './assets/images/design_2_w_500.png   500w\n      "\n    />\n    <img ' +
    'src="./assets/images/design_2_w_1200.png" alt="testing 5" />\n  </picture>\n' +
    '</p>\n\n         </section>\n       </article>\n     </main>\n     <footer>\n    ' +
    '   <nav>\n         <ul>\n           <li><a>About</a></li>\n           ' +
    '<li><a>Contact</a></li>\n         </ul>\n       </nav>\n     </footer>\n   ' +
    '</body>\n </html>\n \n    ',
  title: 'test',
  createdDate: '2019-09-04',
  svg: {
    originalHtml: '<img src="./images/regex.svg" alt="testing 1" />',
    originalPath: './images/regex.svg',
    alt: 'testing 1',
    description: 'regex',
    extension: 'svg',
    relativePathFromInsideScriptsFolder: '../content_draft/./images/regex.svg',
    strippedOptimizedPath: './assets/images/regex.svg'
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