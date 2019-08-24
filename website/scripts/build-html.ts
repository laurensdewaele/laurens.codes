import * as fs from "fs";
import * as path from "path";
import * as prettier from "prettier";

const paths = {
  homePagePath: path.resolve("./src/partials/index.html"),
  homePageBuildPath: path.resolve("./build/index.html"),
  articlesPath: path.resolve("./src/partials/articles")
};

const allArticlePaths: string[] = fs
  .readdirSync(paths.articlesPath)
  .map((article: string) => `${paths.articlesPath}/${article}`);

const articleFsPromises: Promise<Buffer>[] = allArticlePaths.map(
  articleWithPath => fs.promises.readFile(articleWithPath)
);

Promise.all(articleFsPromises).then((articleBuffers: Buffer[]) => {
  const articles: string[] = articleBuffers.map(buffer => buffer.toString());

  const articleHeaders: string = articles
    .map(article => article.replace(/(<section>)((.|\n)*)(<\/section>)/, ""))
    .join("");

  const homePageWithoutArticles: string = fs
    .readFileSync(paths.homePagePath)
    .toString();

  const homePage: string = homePageWithoutArticles.replace(
    "{{ articles }}",
    articleHeaders
  );

  const formattedHomePage: string = prettier.format(homePage, {
    parser: "html"
  });

  fs.writeFileSync(paths.homePageBuildPath, formattedHomePage);
});
