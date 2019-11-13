const standardDescription = "A blog about software engineering.";
const standardKeywords =
  "blog, software, software engineering, frontend development, development, laurens dewaele";
const standardTitle = "laurens.codes";
const utteranceScript = `
<script src="https://utteranc.es/client.js"
    repo="laurensdewaele/blog"
    issue-term="pathname"
    theme="github-light"
    crossorigin="anonymous"
    async
></script>
`;

function getGenericHtml(
  description,
  keywords,
  title,
  content,
  needsCodeHighlighting
) {
  const codeHighlightingCss = `
    <link 
        href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.17.1/themes/prism-okaidia.min.css" 
        rel="stylesheet" 
    />`;

  const codeHighlightingJs = `
    <script async="" src="assets/js/prism.js"></script>
    `;

  return `
    <!--
    
    check out the code at:
    https://github.com/laurensdewaele/blog

    -->
    
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <!-- Global site tag (gtag.js) - Google Analytics -->
        <script async src="https://www.googletagmanager.com/gtag/js?id=UA-97560888-5"></script>
        <script>
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'UA-97560888-5');
        </script>
        <meta charset="utf-8" />
        <meta name="author" content="Laurens Dewaele" />
        <meta name="description" content="${description}" />
        <meta name="keywords" content="${keywords}" />
        <!--    TODO: Set theme color-->
        <meta name="theme-color" content="" />
        <meta name="color-scheme" content="normal" />
        <meta name="robots" content="index,follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="./assets/css/styles.css" rel="stylesheet">
        ${needsCodeHighlighting ? codeHighlightingCss : ""}
        <title>${title}</title>
    </head>
    <body>
        <nav>
            <a href="./index.html"><h1>laurens.codes</h1></a>
        </nav>
        <main>
            ${content}
        </main>
        <footer>
            <p>
                a blog <a href="./about.html">about</a> software development
            </p>
        </footer>
        ${needsCodeHighlighting ? codeHighlightingJs : ""}
    </body>
    </html>
    `;
}

module.exports = {
  getGenericHtml,
  standardKeywords,
  standardDescription,
  standardTitle,
  utteranceScript
};
