const standardDescription = "A blog about software engineering.";
const standardKeywords =
  "blog, software, software engineering, frontend development, development, laurens dewaele";
const standardTitle = "laurens.codes";

function getGenericHtml(description, keywords, title, content) {
  return `
    <!--
    __   __  ___     _______  __   __  _______  ______    _______  __
    |  | |  ||   |   |       ||  | |  ||       ||    _ |  |       ||  |
    |  |_|  ||   |   |_     _||  |_|  ||    ___||   | ||  |    ___||  |
    |       ||   |     |   |  |       ||   |___ |   |_||_ |   |___ |  |
    |       ||   |     |   |  |       ||    ___||    __  ||    ___||__|
    |   _   ||   |     |   |  |   _   ||   |___ |   |  | ||   |___  __
    |__| |__||___|     |___|  |__| |__||_______||___|  |_||_______||__|
    
    -->
    
    <!DOCTYPE html>
    <html lang="en">
    <head>
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
        <title>${title}</title>
    </head>
    <body>
        <header>
            <h1><a href="./index.html">Laurens codes</a></h1>
        </header>
        <main>
            ${content}
        </main>
        <footer>
        <nav>
            <ul>
            <li><a>About</a></li>
            <li><a>Contact</a></li>
            </ul>
        </nav>
        </footer>
    </body>
    </html>
    `;
}

module.exports = {
  getGenericHtml,
  standardKeywords,
  standardDescription,
  standardTitle
};
