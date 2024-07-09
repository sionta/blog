(function () {
  "use strict";

  // // Function to set theme
  // const themeSwitcher = document.getElementById("theme-switcher");
  // if (themeSwitcher) {
  //   themeSwitcher.addEventListener("click", (event) => {
  //     const theme = event.target.dataset.theme;
  //     if (theme) {
  //       setupTheme(theme);
  //     }
  //   });
  // }

  // function setupTheme(theme) {
  //   let giscusTheme = theme;

  //   if (theme === "auto") {
  //     delete document.documentElement.dataset.theme;
  //     localStorage.removeItem("theme");
  //     giscusTheme = "preferred_color_scheme";
  //   } else {
  //     document.documentElement.dataset["theme"] = theme;
  //     localStorage.setItem("theme", theme);
  //   }

  //   // Update theme for Giscus and utterancesFrame
  //   // const utterancesFrame = document.querySelector(".utterances-frame");
  //   const giscusFrame = document.querySelector(".giscus-frame");
  //   if (giscusFrame) {
  //     giscusFrame.contentWindow.postMessage(
  //       {
  //         giscus: {
  //           setConfig: {
  //             theme: giscusTheme,
  //           },
  //         },
  //       },
  //       "https://giscus.app"
  //     );
  //   }

  //   const currentTheme = localStorage.getItem("theme") || "auto";
  //   const dataTheme = document.getElementById(`theme-${currentTheme}`);

  //   if (themeSwitcher && dataTheme) {
  //     themeSwitcher.querySelectorAll("button").forEach((button) => {
  //       if (!button.classList.value) return;
  //       button.classList.remove("active");
  //     });
  //     dataTheme.classList.add("active");
  //   }
  // }

  // // Sync initial state
  // const cacheTheme = localStorage.getItem("theme") || "auto";
  // setupTheme(cacheTheme); // Set initial theme from localStorage

  document.addEventListener("DOMContentLoaded", () => {
    navigationMenu();
    backToTop();
    searchPost();
    tableOfContent();
    anchorHeadings();
    copyCodeBlock();
    diagramMermaid();
    mathEngines();
  });

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
    const tooltipTimeout = 1000;
    const copyButtons = document.querySelectorAll(".code-button");
    if (!copyButtons.length) return;

    copyButtons.forEach((copyButton) => {
      const copyTooltip = copyButton.querySelector(".code-tooltip");
      const labelCopy = copyButton.getAttribute("copy-label");
      const labelSuccess = copyButton.getAttribute("success-label");
      const labelError = copyButton.getAttribute("error-label");

      // Displays a message from the attribute when the mouse enters the button
      copyButton.addEventListener("mouseenter", () => {
        showTooltip(copyTooltip, labelCopy);
      });

      // Copy code
      copyButton.addEventListener("click", () => {
        // .highlighter-rouge
        const codeElement = copyButton
          .closest("[class^=language-]")
          ?.querySelector(".rouge-code");

        if (codeElement) {
          const codeContent = codeElement.innerText;

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
        }
      });
    });

    function iconTooltip(button, isSuccess) {
      const clipboardIcon = button.querySelector(".icon-clipboard");
      const successIcon = button.querySelector(".icon-success");

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
  function mathEngines() {
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
    } else if (window.MathJax) {
      // MathJax configuration
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

  // search
  function searchPost() {
    if (!window.SimpleJekyllSearch) return;
    const searchInput = document.getElementById("search-input");
    const resultsContainer = document.getElementById("search-results");
    if (!searchInput || !resultsContainer) return;

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
      const searchTerm = searchInput.value;
      if (searchTerm === "") {
        resultsContainer.innerHTML = "";
      } else {
        setTimeout(() => {
          if (resultsContainer.innerHTML.trim() === "") {
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
    window.addEventListener("resize", initializeToc);
  }

  // Navigation menu
  function navigationMenu() {
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".site-menu");
    const navLinks = document.querySelectorAll(".menu-link");
    if (!hamburger || !navMenu || !navLinks.length) return;

    hamburger.addEventListener("click", mobileMenu);
    navLinks.forEach((n) => n.addEventListener("click", closeMenu));

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
    const backToTopButton = document.getElementById("back-to-top");
    if (!backToTopButton) return;

    window.onscroll = () => {
      scrollFunction();
    };

    function scrollFunction() {
      if (
        document.documentElement.scrollTop > 20 ||
        document.body.scrollTop > 20
      ) {
        backToTopButton.classList.add("visible");
      } else {
        backToTopButton.classList.remove("visible");
      }
    }

    backToTopButton.addEventListener("click", () => {
      document.documentElement.scrollTop = 0; /* For other browsers */
      document.body.scrollTop = 0; /* For Safari */
    });
  }
})();
