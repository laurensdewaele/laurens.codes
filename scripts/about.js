const fs = require("fs");
const {
  getGenericHtml,
  standardKeywords,
  standardDescription,
  standardTitle
} = require("./generic_html");

generateAboutPage();

function generateAboutPage() {
  const description = "About page for laurens.codes blog";
  const keywords = "about";
  const title = "about page";

  const content = `
    <div class="about-content">
        <h2>
            Just some dude blogging who's trying to be a better programmer whilst building cool stuff.
        </h2>
    </div>
  `;

  const aboutHtml = getGenericHtml(
    description,
    keywords,
    title,
    content,
    false
  );

  fs.writeFileSync(`../website/about.html`, aboutHtml);
}
