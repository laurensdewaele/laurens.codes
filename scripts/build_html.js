/**
 * In order to rebuild the html files after the generic html has changed
 */
const fs = require("fs");
const moment = require("moment");

const {
  getGenericHtml,
  standardDescription,
  standardKeywords,
  standardTitle
} = require("./generic_html");
const { runPrettierOnHtml } = require("./create_html");

const blogposts = JSON.parse(
  fs.readFileSync("../website/assets/blogposts.json", {
    encoding: "utf8"
  })
);

rebuildBlogpostsHtml();
rebuildIndexHtml();

function rebuildIndexHtml() {
  const sortedIndexContent = blogposts
    .sort((a, b) => {
      const valueA = moment(a.createdDate).valueOf();
      const valueB = moment(b.createdDate).valueOf();
      return valueB - valueA;
    })
    .map(blogpost => {
      const { filename, articleHeaderHtml } = blogpost;
      return `<a href="./${filename}.html">${articleHeaderHtml}</a>`;
    })
    .join("");

  const needsCodeHighlighting = false;
  const indexHtml = runPrettierOnHtml(
    getGenericHtml(
      standardDescription,
      standardKeywords,
      standardTitle,
      sortedIndexContent,
      needsCodeHighlighting
    )
  );
  fs.writeFileSync("../website/index.html", indexHtml);
}

function rebuildBlogpostsHtml() {
  blogposts.forEach(blogpost => {
    const { description, keywords, title, articleHtml, filename } = blogpost;
    const needsCodeHighlighting = true;
    const html = runPrettierOnHtml(
      getGenericHtml(
        description,
        `${keywords}, ${standardKeywords}`,
        title,
        articleHtml,
        needsCodeHighlighting
      )
    );
    fs.writeFileSync(`../website/${filename}.html`, html);
  });
}
