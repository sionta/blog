(function () {
  "use strict";

  const gotoTop = document.getElementById("back-to-top");
  if (gotoTop) {
    window.onscroll = function () {
      if (
        document.documentElement.scrollTop > 20 ||
        document.body.scrollTop > 20
      ) {
        gotoTop.classList.add("visible");
      } else {
        gotoTop.classList.remove("visible");
      }
    };
    gotoTop.addEventListener("click", () => {
      document.documentElement.scrollTop = 0; /* For other browsers */
      document.body.scrollTop = 0; /* For Safari */
    });
  }

  function anchorHeadings() {
    if (window.anchors) {
      // Initialize AnchorJS with custom options
      anchors.options = {
        placement: "right", // Position of the anchor link (left, right)
        visible: "hover", // When the anchor link is visible (always, hover, touch)
        // icon: "¶", // Character or HTML for the anchor icon
        class: "anchor-link", // CSS class for the anchor link
        ariaLabel: "Anchor", // Aria-label for the anchor link
        selectors: "h1, h2, h3, h4, h5, h6", // Default selector
      };
      anchors.add().remove(".no-anchor, .no_anchor");
    }
  }

  // clipboard
  function copyCodeBlock() {
    /* so there are no typos */
    const data = {
      // querySelector
      CODE_QUERY: ".rouge-code",
      CODE_BUTTON: ".code-button", // querySelectorAll
      COPY_TOOLTIP: ".code-tooltip",
      ICON_CLIPBOARD: ".icon-clipboard",
      ICON_SUCCESS: ".icon-success",

      // getAttribute
      LABEL_COPY: "copy-label",
      LABEL_SUCCESS: "success-label",
      LABEL_ERROR: "error-label",
    };

    const codeButtons = document.querySelectorAll(data.CODE_BUTTON);
    if (!codeButtons) return;

    const tooltipTimeout = 1000;
    codeButtons.forEach((copyBtn) => {
      // Displays a message from the attribute when the mouse enters the button
      copyBtn.addEventListener("mouseenter", () => {
        textTooltip(
          copyBtn.querySelector(data.COPY_TOOLTIP),
          copyBtn.getAttribute(data.LABEL_COPY)
        );
      });

      // Copy code
      copyBtn.addEventListener("click", () => {
        const textValue = copyBtn
          .closest("[class^=language-]")
          ?.querySelector(data.CODE_QUERY);
        if (!textValue) return;

        navigator.clipboard
          .writeText(textValue.innerText)
          .then(() => {
            textTooltip(
              copyBtn.querySelector(data.COPY_TOOLTIP),
              copyBtn.getAttribute(data.LABEL_SUCCESS)
            );
            iconTooltip(copyBtn, true);
          })
          .catch((err) => {
            textTooltip(
              copyBtn.querySelector(data.COPY_TOOLTIP),
              copyBtn.getAttribute(data.LABEL_ERROR)
            );
            alert("Failed to copy text: ", err);
          });
      });
    });

    function iconTooltip(button, success) {
      const iconClip = button.querySelector(data.ICON_CLIPBOARD),
        iconDone = button.querySelector(data.ICON_SUCCESS);

      if (success) {
        iconClip.style.display = "none";
        iconDone.style.display = "inline";
      }

      setTimeout(() => {
        iconClip.style.display = "inline";
        iconDone.style.display = "none";
      }, tooltipTimeout);
    }

    function textTooltip(btn, msg, ms = 1000) {
      btn.textContent = msg;
      btn.classList.add("active");
      setTimeout(() => {
        btn.classList.remove("active");
      }, ms);
    }
  }

  // katex and mathjax
  function loadMathEngines() {
    if (window.renderMathInElement) {
      // KaTeX configuration
      renderMathInElement(document.body, {
        delimiters: [
          { left: "$$", right: "$$", display: true },
          { left: "$", right: "$", display: false },
          { left: "\\(", right: "\\)", display: false },
          { left: "\\[", right: "\\]", display: true },
        ],
      });
    }
    // MathJax configuration
    else if (window.MathJax) {
      window.MathJax = {
        tex: {
          inlineMath: [
            ["$", "$"],
            ["\\(", "\\)"],
          ],
          displayMath: [
            ["$$", "$$"],
            ["\\[", "\\]"],
          ],
        },
        options: {
          skipHtmlTags: ["script", "noscript", "style", "textarea", "pre"],
          processHtmlClass: "mathjax-process",
          ignoreHtmlClass: "mathjax-ignore",
        },
      };
    }
  }

  // mermaid
  function diagramMermaid() {
    if (!window.mermaid) return;
    // Select all Mermaid code elements
    const mermaidDiagrams = document.querySelectorAll(".language-mermaid");
    if (!mermaidDiagrams.length) return;

    mermaidDiagrams.forEach((codeElement) => {
      // Create a new div element with the 'mermaid' class
      const newElement = document.createElement("div");
      newElement.classList.add("mermaid");
      newElement.innerHTML = codeElement.textContent;

      // Replace the original element with the new element
      codeElement.parentElement.replaceWith(newElement);
    });

    // Initialize Mermaid
    mermaid.initialize({ startOnLoad: true });
  }

  // tocbot
  function tableOfContent() {
    if (!window.tocbot) return;
    function initializeToc() {
      // Clear any existing TOC
      tocbot.destroy();

      const tocSelector = window.innerWidth >= 768 ? "#toc" : "#toc-mobile";

      tocbot.init({
        tocSelector: tocSelector,
        contentSelector: '[itemprop="articleBody"]',
        ignoreSelector: ".no_toc",
        headingSelector: "h2, h3",
        orderedList: false,
        scrollSmooth: false,
        collapseDepth: 0,
        /* listClass: "toc-list",
          listItemClass: "toc-list-item",
          activeListItemClass: "is-active-li",
          linkClass: "toc-link",
          activeLinkClass: "is-active-link",
          isCollapsedClass: "is-collapsed",
          collapsibleClass: "is-collapsible",
          positionFixedClass: "is-position-fixed",
          fixedSidebarOffset: "auto", */
      });

      tocbot.refresh();
    }

    // Initialize TOC on page load
    initializeToc();

    // Re-initialize TOC on window resize
    addEventListener("resize", initializeToc);
  }

  /* Load DOM only on `layout: post` */
  addEventListener("DOMContentLoaded", () => {
    tableOfContent();
    anchorHeadings();
    copyCodeBlock();
    diagramMermaid();
    loadMathEngines();
  });
})();
