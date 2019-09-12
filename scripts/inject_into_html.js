const moment = require("moment");

const { getGenericHtml, standardKeywords } = require("./generic_html");

function createArticleHeader(svg, title, createdDate, content) {
  const formattedDate = moment(createdDate).format("DD MMM YYYY");
  const isForIndexPage = !!!content;
  return `
  <article class="${isForIndexPage ? "isIndexPage" : "isBlogPostPage"}">
    <header>
      <div>
        <h2>${title}</h2>
        <p>
          <time datetime="${createdDate}">
            ${formattedDate}
          </time>
        </p>
      </div>
      <div>
        ${svg}
      </div>
    </header>
    ${isForIndexPage ? "" : content}
  </article>
`;
}

function createArticle(svg, title, createdDate, htmlWithoutHeaderAndSvg) {
  const content = `<section>${htmlWithoutHeaderAndSvg}</section>`;
  return createArticleHeader(svg, title, createdDate, content);
}

function injectBlogIntoGenericHtml(
  htmlWithoutHeaderAndSvg,
  description,
  newKeywords,
  svg,
  title,
  createdDate
) {
  const keywords = `${newKeywords}, ${standardKeywords}`;
  const content = createArticle(
    svg,
    title,
    createdDate,
    htmlWithoutHeaderAndSvg
  );
  return getGenericHtml(description, keywords, title, content);
}

module.exports = {
  createArticle,
  createArticleHeader,
  injectBlogIntoGenericHtml
};
