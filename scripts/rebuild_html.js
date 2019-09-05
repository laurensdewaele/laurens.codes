/**
 * In order to rebuild the html files after the generic html has changed
 */

const fs = require("fs");

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

rebuildIndexHtml();
rebuildBlogpostsHtml();

function rebuildIndexHtml() {
  const indexContent = blogposts.map(blogpost => {
    const { filename, articleHeaderHtml } = blogpost;
    return `<a href="./${filename}.html">${articleHeaderHtml}</a>`;
  });
  const indexHtml = runPrettierOnHtml(
    getGenericHtml(
      standardDescription,
      standardKeywords,
      standardTitle,
      indexContent
    )
  );
  fs.writeFileSync("../website/index.html", indexHtml);
}

function rebuildBlogpostsHtml() {
  blogposts.forEach(blogpost => {
    const { description, keywords, title, articleHtml, filename } = blogpost;
    const html = runPrettierOnHtml(
      getGenericHtml(
        description,
        `${keywords}, ${standardKeywords}`,
        title,
        articleHtml
      )
    );
    fs.writeFileSync(`../website/${filename}.html`, html);
  });
}
