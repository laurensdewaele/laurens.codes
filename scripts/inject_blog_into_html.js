const moment = require("moment");

function createArticleHeader(svg, title, createdDate) {
  const formattedDate = moment(createdDate).format("DD MMM YYYY");
  return `
  <header>
    ${svg}
    <h2>${title}</h2>
    <p>
      <time datetime="${createdDate}">
        ${formattedDate}
      </time>
    </p>
  </header>
`;
}

function createArticle(htmlWithoutHeaderAndSvg, svg, title, createdDate) {
  return `
  <article>
    ${createArticleHeader(svg, title, createdDate)}
    <section>
      ${htmlWithoutHeaderAndSvg}
    </section>
  </article>
  `;
}

function injectBlogIntoGenericHtml(
  htmlWithoutHeaderAndSvg,
  description,
  keywords,
  svg,
  title,
  createdDate
) {
  const fixedKeywords =
    ", blog, personal, laurens dewaele, software engineering";

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
     <meta name="keywords" content="${keywords}${fixedKeywords}" />
     <!--    TODO: Set theme color-->
     <meta name="theme-color" content="" />
     <meta name="color-scheme" content="normal" />
     <meta name="robots" content="index,follow" />
     <meta name="viewport" content="width=device-width, initial-scale=1" />
     <title>${title}</title>
   </head>
   <body>
     <header>
       <h1><a href="#">Laurens codes</a></h1>
     </header>
     <main>
       ${createArticle(htmlWithoutHeaderAndSvg, svg, title, createdDate)}
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
  createArticle,
  createArticleHeader,
  injectBlogIntoGenericHtml
};
