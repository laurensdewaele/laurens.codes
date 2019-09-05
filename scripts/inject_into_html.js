const moment = require("moment");

const { getGenericHtml, standardKeywords } = require("./generic_html");

function createArticleHeader(svg, title, createdDate, content) {
  const formattedDate = moment(createdDate).format("DD MMM YYYY");
  return `
  <article>
    <header>
      ${svg}
      <h2>${title}</h2>
      <p>
        <time datetime="${createdDate}">
          ${formattedDate}
        </time>
      </p>
    </header>
    ${content ? content : ""}
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
