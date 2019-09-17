const moment = require("moment");

const {
  getGenericHtml,
  standardKeywords,
  utteranceScript
} = require("./generic_html");

function createArticleHeader(svg, title, createdDate, content) {
  const formattedDate = moment(createdDate).format("DD MMM YYYY");
  const isForIndexPage = !!!content;
  return `
  <article class="${
    isForIndexPage ? "article-index-page" : "article-blogpost-page"
  }">
    <header>
      <div>
        <h2>${title}</h2>
        <p>
          <time datetime="${createdDate}">
            ${formattedDate}
          </time>
        </p>
      </div>
      <div class="svg-container">
        ${svg}
      </div>
    </header>
    ${
      isForIndexPage
        ? ""
        : `
      <section>
        ${content}
      </section>
      <section>
        ${utteranceScript}
      </section>
      `
    }
  </article>
`;
}

function createArticle(svg, title, createdDate, htmlWithoutHeaderAndSvg) {
  return createArticleHeader(svg, title, createdDate, htmlWithoutHeaderAndSvg);
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
  return getGenericHtml(description, keywords, title, content, true);
}

module.exports = {
  createArticle,
  createArticleHeader,
  injectBlogIntoGenericHtml
};
