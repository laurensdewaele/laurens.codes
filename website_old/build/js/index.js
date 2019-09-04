/*

1) Read and replace all anchor tags with functions
2) when anchor tag is clicked => execute function
3) The function should replace the content with the new content
4) The function should also update the head information, e.g. meta tags, link tags, etc...

 */

//pathname /articles/1_angular.html;

/*

Trying to get the content from my static files instead of shipping it in code as strings

 */

let content = {};

fetch(`${window.location.origin}/articles/1_angular.html`, {
  mode: "same-origin"
})
  .then(response => response.blob())
  .then(blob => {
    const reader = new FileReader();
    reader.readAsText(blob);
    reader.addEventListener("loadend", e => {
      const result = e.target.result;

      content.angular = result.match(/(<article>)((.|\n)*)(<\/article>)/)[0];
      console.log(content.angular);
    });
  });


function findAllAnchorTags() {
  const nodes = document.querySelectorAll("a");
  addClickHandlers(nodes);
}

function addClickHandlers(nodes) {
  nodes.forEach(node => {
    node.setAttribute(
      "onclick",
      `handleAnchorClick(event, '${node.pathname}')`
    );
  });
}

function handleAnchorClick(event, pathname) {
  event.preventDefault();
  const isArticle = pathname.split("/")[1] === "articles";

  if (isArticle) {
    const main = document.getElementById("variable-content");
    while (main.firstChild) {
      main.removeChild(main.firstChild);
    }
    main.innerHTML = content.angular;
    window.history.pushState(null, "null", "/articles/1_angular.html");
  }
}

findAllAnchorTags();

window.onpopstate = e => {
  debugger;
  if (window.location.pathname === "/") {
    const main = document.getElementById("variable-content");
    main.innerHTML = mainContent;
  }
};

/*

Trying to get the content from my static files instead of shipping it in code as strings



 */
