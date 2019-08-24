"use strict";
exports.__esModule = true;
var fs = require("fs");
var path = require("path");
var prettier = require("prettier");
var paths = {
    homePagePath: path.resolve("./src/partials/index.html"),
    homePageBuildPath: path.resolve("./build/index.html"),
    articlesPath: path.resolve("./src/partials/articles")
};
var allArticlePaths = fs
    .readdirSync(paths.articlesPath)
    .map(function (article) { return paths.articlesPath + "/" + article; });
var allArticlesAsReadFilePromises = allArticlePaths.map(function (articleWithPath) { return fs.promises.readFile(articleWithPath); });
Promise.all(allArticlesAsReadFilePromises).then(function (articlesAsBuffers) {
    var articlesAsStrings = articlesAsBuffers.map(function (buffer) {
        return buffer.toString();
    });
    var articlesWithoutSectionContent = articlesAsStrings.map(function (article) {
        return article.replace(/(<section>)((.|\n)*)(<\/section>)/, "");
    });
    var articles = articlesWithoutSectionContent.join("");
    var homePageAsString = fs
        .readFileSync(paths.homePagePath)
        .toString();
    var homePageWithArticles = homePageAsString.replace("{{ articles }}", articles);
    var formattedHomePag = prettier.format(homePageWithArticles, {
        parser: "html"
    });
    fs.writeFileSync(paths.homePageBuildPath, formattedHomePag);
});
