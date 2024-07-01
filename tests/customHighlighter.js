// Process all if it has class 'highlight'
function customHighlighter() {
  // Remove <div class="highlight"> while keeping its child nodes
  var divHighlightElements = document.querySelectorAll("div.highlight");
  divHighlightElements.forEach((element) => {
    let children = Array.from(element.childNodes);
    children.forEach((child) =>
      element.parentNode.insertBefore(child, element)
    );
    element.parentNode.removeChild(element);
  });

  // Replace <figure class="highlight"> with <div class="language-... highlighter-rouge">
  var figureHighlightElements = document.querySelectorAll("figure.highlight");
  figureHighlightElements.forEach((figureElement) => {
    let codeElement = figureElement.querySelector("code");
    if (codeElement) {
      let languageClass = codeElement.className;
      let divElement = document.createElement("div");
      divElement.className = languageClass + " highlighter-rouge";
      let preElement = figureElement.querySelector("pre");
      if (preElement) {
        divElement
          .appendChild(preElement.cloneNode(true))
          .classList.add("highlight");
        figureElement.parentNode.replaceChild(divElement, figureElement);
      }
    }
  });

  // Add 'data-lang' attribute to <pre> elements based on parent <div> class
  var preHighlightElements = document.querySelectorAll("pre.highlight");
  preHighlightElements.forEach((preElement) => {
    let languageClassMatch =
      preElement.parentNode.className.match(/language-(\w+)/);
    if (languageClassMatch) {
      preElement.setAttribute("data-lang", languageClassMatch[1]);
    }
  });

  // Remove 'class' from <code> elements if they have 'data-lang' attribute
  var codeElements = document.querySelectorAll("pre code");
  codeElements.forEach((codeElement) => {
    if (codeElement.hasAttribute("data-lang")) {
      codeElement.removeAttribute("class");
      codeElement.removeAttribute("data-lang");
    }
  });

  // Select all tables with class "rouge-table"
  var tableElements = document.querySelectorAll("table.rouge-table");
  // Iterate over each table element
  tableElements.forEach((tableElement) => {
    // Replace <td class="gutter gl"> with <td class="rouge-gutter gl">
    tableElement.querySelectorAll("td.gutter.gl").forEach(function (tdElement) {
      tdElement.className = tdElement.className.replace(
        "gutter",
        "rouge-gutter"
      );
    });

    // Replace <td class="code"> with <td class="rouge-code">
    tableElement.querySelectorAll("td.code").forEach(function (tdElement) {
      tdElement.className = tdElement.className.replace("code", "rouge-code");
    });
  });
}
