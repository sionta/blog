import ThemeToggle from "./theme-toggle.js";
import { commentAttributes } from "./utils.js";

new ThemeToggle("#theme-toggle");

document.addEventListener("DOMContentLoaded", () => {
  // Initialize content upon DOM ready
  setupBackToTopButton();
  setupCopyToClipboard();
  initializeContent();
});

function setupComments() {
  let siteCommentID = document.getElementById("site-comment");
  if (commentAttributes && siteCommentID) {
    let script = document.createElement("script");
    Object.entries(commentAttributes).forEach(([key, value]) =>
      script.setAttribute(key, value)
    );
    siteCommentID.appendChild(script);
  }
}

function initializeContent() {
  setupComments();
  tableOfContent();
  anchorHeadings();
  diagramMermaid();
  loadMathEngines();
}

function setupBackToTopButton() {
  const gotoTop = document.getElementById("back-to-top");
  if (gotoTop) {
    window.addEventListener("scroll", handleScroll);
    gotoTop.addEventListener("click", handleGotoTopClick);
  }

  function handleScroll() {
    gotoTop.classList.toggle("visible", window.scrollY > 20);
  }

  function handleGotoTopClick() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

function setupCopyToClipboard() {
  const copyButtons = document.querySelectorAll(".code-header button");
  if (copyButtons.length > 0) {
    copyButtons.forEach((button) => {
      button.addEventListener("click", handleCopyButtonClick);
    });
  }

  function handleCopyButtonClick() {
    const codeBlock = this.closest(".code-blocks")?.querySelector(
      ".highlight .rouge-code, .highlight code"
    );
    if (!codeBlock) return;

    const codeText = codeBlock.textContent.trim();
    navigator.clipboard
      .writeText(codeText)
      .then(() => {
        const originalLabel = this.innerHTML;
        const successLabel = this.getAttribute("success-label");
        this.innerHTML = successLabel;

        setTimeout(() => {
          this.innerHTML = originalLabel;
        }, 1000);
      })
      .catch((err) => {
        console.error("Failed to copy text:", err);
      });
  }
}

function anchorHeadings() {
  if (window.anchors) {
    anchors.options = {
      placement: "right",
      visible: "hover",
      class: "anchor-link",
      ariaLabel: "Anchor",
      selectors: "h1, h2, h3, h4, h5, h6",
    };
    anchors.add().remove(".no-anchor, .no_anchor");
  }
}

function tableOfContent() {
  if (window.tocbot) {
    const initializeToc = () => {
      tocbot.destroy();
      const tocSelector = window.innerWidth >= 768 ? "#toc" : "#toc-mobile";
      if (!tocSelector) return;

      tocbot.init({
        tocSelector: tocSelector,
        contentSelector: '[itemprop="articleBody"]',
        ignoreSelector: ".no_toc",
        headingSelector: "h2, h3",
        orderedList: false,
        scrollSmooth: false,
        collapseDepth: 0,
      });

      tocbot.refresh();
    };

    initializeToc();
    window.addEventListener("resize", initializeToc);
  }
}

function diagramMermaid() {
  if (window.mermaid) {
    const mermaidDiagrams = document.querySelectorAll(".language-mermaid");
    if (mermaidDiagrams.length > 0) {
      mermaidDiagrams.forEach((codeElement) => {
        const newElement = document.createElement("div");
        newElement.classList.add("mermaid");
        newElement.innerHTML = codeElement.textContent;
        codeElement.parentElement.replaceWith(newElement);
      });

      mermaid.initialize({ startOnLoad: true });
    }
  }
}

function loadMathEngines() {
  if (window.renderMathInElement) {
    renderMathInElement(document.body, {
      delimiters: [
        { left: "$$", right: "$$", display: true },
        { left: "$", right: "$", display: false },
        { left: "\\(", right: "\\)", display: false },
        { left: "\\[", right: "\\]", display: true },
      ],
    });
  } else if (window.MathJax) {
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
