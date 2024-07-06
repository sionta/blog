(function () {
  "use strict";

  /* always load on DOM */
  document.addEventListener("DOMContentLoaded", () => {
    /* required */
    initialTheme();
    navigationMenu();
    backToTop();
    searchPost();

    /* post features */
    tableOfContent();
    codeButton();
    diagramMermaid();
    mathKaTex();
    mathMathJax();
    // customHighlighter();
  });

  // Function to set theme
  const themeSwitcher = document.getElementById("theme-switcher");

  function setupTheme(theme) {
    if (theme === "auto") {
      delete document.documentElement.dataset.theme;
      localStorage.removeItem("theme");
    } else {
      document.documentElement.dataset["theme"] = theme;
      localStorage.setItem("theme", theme);
    }

    var currentTheme = localStorage.getItem("theme") || "auto";
    var modeTheme = document.getElementById(`theme-${currentTheme}`);
    if (themeSwitcher && modeTheme) {
      themeSwitcher.querySelectorAll("button").forEach((button) => {
        if (!button.classList.value) return;
        button.classList.remove("active");
      });
      modeTheme.classList.add("active");
    }
  }

  function initialTheme() {
    if (themeSwitcher) {
      themeSwitcher.addEventListener("click", (e) => {
        var theme = e.target.dataset.theme;
        if (theme) { setupTheme(theme); } // prettier-ignore
      });
    }
    // Sync initial state
    var cacheTheme = localStorage.getItem("theme") || "auto";
    setupTheme(cacheTheme); // Set initial theme from localStorage
  }

  // clipboard
  function codeButton() {
    var tooltipTimeout = 1000;
    const copyButtons = document.querySelectorAll(".code-button");
    if (!copyButtons) return;

    copyButtons.forEach(function (copyButton) {
      var copyTooltip = copyButton.querySelector(".code-tooltip");
      var labelCopy = copyButton.getAttribute("copy-label");
      var labelSuccess = copyButton.getAttribute("success-label");
      var labelError = copyButton.getAttribute("error-label");

      // Displays a message from the attribute when the mouse enters the button
      copyButton.addEventListener("mouseenter", () => {
        showTooltip(copyTooltip, labelCopy);
      });

      // Copy code
      copyButton.addEventListener("click", () => {
        var codeContent = copyButton
          .closest("[class^=language-]") // or .highlighter-rouge
          .querySelector(".rouge-code").innerText;

        navigator.clipboard
          .writeText(codeContent)
          .then(() => {
            showTooltip(copyTooltip, labelSuccess);
            iconTooltip(copyButton, true);
          })
          .catch((err) => {
            showTooltip(copyTooltip, labelError);
            console.error("Failed to copy text: ", err);
          });
      });
    });

    function iconTooltip(button, isSuccess) {
      var clipboardIcon = button.querySelector(".icon-clipboard");
      var successIcon = button.querySelector(".icon-success");

      if (isSuccess) {
        clipboardIcon.style.display = "none";
        successIcon.style.display = "inline";
      }

      setTimeout(() => {
        clipboardIcon.style.display = "inline";
        successIcon.style.display = "none";
      }, tooltipTimeout);
    }

    function showTooltip(tooltip, message, timeout = tooltipTimeout) {
      tooltip.textContent = message;
      tooltip.classList.add("active");
      setTimeout(() => {
        tooltip.classList.remove("active");
      }, timeout);
    }
  }

  // katex
  function mathKaTex() {
    if (document.getElementById("katex-script") && renderMathInElement) {
      renderMathInElement(document.body, {
        delimiters: [
          { left: "$$", right: "$$", display: true },
          { left: "$", right: "$", display: false },
          { left: "\\(", right: "\\)", display: false },
          { left: "\\[", right: "\\]", display: true },
        ],
      });
    }
  }

  // mathjax
  function mathMathJax() {
    if (!window.MathJax) return;
    MathJax = {
      tex: {
        inlineMath: [
          ["$", "$"],
          ["\\(", "\\)"],
        ],
      },
      options: {
        processHtmlClass: "mathjax-process",
      },
    };
  }

  // mermaid
  function diagramMermaid() {
    if (!window.mermaid) return;
    // Select all Mermaid code elements
    const MERMAID_DIAGRAM = document.querySelectorAll(".language-mermaid");
    if (!MERMAID_DIAGRAM) return;

    MERMAID_DIAGRAM.forEach((codeElement) => {
      // Create a new div element with the 'mermaid' class
      var newElement = document.createElement("div");
      newElement.classList.add("mermaid");
      newElement.innerHTML = codeElement.textContent;

      // Replace the original element with the new element
      codeElement.parentElement.replaceWith(newElement);
    });

    // Initialize Mermaid
    mermaid.initialize({ startOnLoad: true });
  }

  // search
  function searchPost() {
    if (!window.SimpleJekyllSearch) return;
    var searchInput = document.getElementById("search-input");
    var resultsContainer = document.getElementById("search-results");
    if (!searchInput && !resultsContainer) return;

    window.SimpleJekyllSearch({
      searchInput: searchInput,
      resultsContainer: resultsContainer,
      json: "assets/search-data.json",
      searchResultTemplate:
        '<li class="result-item"><a href="{url}">{title}</a></li>',
      noResultsText: "",
      limit: 10,
      fuzzy: false,
    });

    searchInput.addEventListener("input", () => {
      var searchTerm = searchInput.value;
      if (searchTerm === "") {
        resultsContainer.innerHTML = "";
      } else {
        setTimeout(() => {
          if (resultsContainer.innerdocument.documentElement.trim() === "") {
            resultsContainer.innerHTML = `<span class="no-results">'${searchTerm}'</span>`;
          }
        }, 300);
      }
    });
  }

  // tocbot
  function tableOfContent() {
    if (!window.tocbot) return;
    function initializeToc() {
      // Clear any existing TOC
      tocbot.destroy();

      var tocSelector = window.innerWidth >= 768 ? "#toc" : "#toc-mobile";

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
    window.addEventListener("resize", () => {
      initializeToc();
    });
  }

  // Navigation menu
  function navigationMenu() {
    var hamburger = document.querySelector(".hamburger");
    var navMenu = document.querySelector(".site-menu");
    var navLink = document.querySelectorAll(".menu-link");
    if (!hamburger) return;

    hamburger.addEventListener("click", mobileMenu);
    navLink.forEach((n) => n.addEventListener("click", closeMenu));

    function mobileMenu() {
      hamburger.classList.toggle("active");
      navMenu.classList.toggle("active");
    }

    function closeMenu() {
      hamburger.classList.remove("active");
      navMenu.classList.remove("active");
    }
  }

  // Go to Top
  function backToTop() {
    var backToTop = document.getElementById("back-to-top");
    if (!backToTop) return;

    window.onscroll = () => {
      scrollFunction();
    };

    function scrollFunction() {
      if (
        document.documentElement.scrollTop > 20 ||
        document.body.scrollTop > 20
      ) {
        backToTop.classList.add("visible");
      } else {
        backToTop.classList.remove("visible");
      }
    }

    backToTop.addEventListener("click", () => {
      document.documentElement.scrollTop = 0; /* For other browsers */
      document.body.scrollTop = 0; /* For Safari */
    });
  }
})();
