(function () {
  "use strict";

  const Theme = { AUTO: "auto", LIGHT: "light", DARK: "dark" };
  const THEME_OWNER = document.documentElement;
  const THEME_STORAGE_KEY = "theme";

  // Function to update button states based on current theme
  function updateButtonStates() {
    const currentTheme = localStorage.getItem(THEME_STORAGE_KEY) || Theme.AUTO;
    document.querySelectorAll("#theme-switcher button").forEach((button) => {
      button.classList.remove("active");
    });
    document.getElementById(`theme-${currentTheme}`).classList.add("active");
  }

  // Function to set theme
  function setTheme(theme) {
    if (theme === Theme.AUTO) {
      delete THEME_OWNER.dataset[THEME_STORAGE_KEY];
      localStorage.removeItem(THEME_STORAGE_KEY);
    } else {
      THEME_OWNER.dataset[THEME_STORAGE_KEY] = theme;
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    }
    updateButtonStates();
  }

  // Handle theme button click
  function handleThemeButtonClick(event) {
    const theme = event.target.dataset.theme;
    if (theme) {
      setTheme(theme);
    }
  }

  // Initialize theme switcher
  function initializeThemeSwitcher() {
    const themeSwitcher = document.getElementById("theme-switcher");
    if (!themeSwitcher) return;

    themeSwitcher.addEventListener("click", handleThemeButtonClick);

    // Sync initial state
    const initialTheme = localStorage.getItem(THEME_STORAGE_KEY) || Theme.AUTO;
    setTheme(initialTheme); // Set initial theme from localStorage
  }

  // Call initializeThemeSwitcher on DOMContentLoaded
  initializeThemeSwitcher();

  // clipboard
  document.addEventListener("DOMContentLoaded", () => {
    const copyButtons = document.querySelectorAll(".copy-button");
    if (!copyButtons) return;

    copyButtons.forEach(function (copyButton) {
      copyButton.addEventListener("click", function () {
        const codeBlock = copyButton
          .closest(".highlighter-rouge")
          .querySelector(".rouge-code");
        const text = codeBlock.innerText;

        navigator.clipboard
          .writeText(text)
          .then(function () {
            showTooltip(
              copyButton.querySelector(".copy-tooltip"),
              copyButton.getAttribute("success-label")
            );
            toggleIcons(copyButton, true);
          })
          .catch(function (err) {
            console.error("Failed to copy text: ", err);
            showTooltip(
              copyButton.querySelector(".copy-tooltip"),
              copyButton.getAttribute("error-label")
            );
          });
      });

      // Displays a message from the attribute when the mouse enters the button
      copyButton.addEventListener("mouseenter", function () {
        const tooltipText = copyButton.getAttribute("copy-label");
        showTooltip(copyButton.querySelector(".copy-tooltip"), tooltipText);
      });

      // Delete message when mouse leaves button
      copyButton.addEventListener("mouseleave", function () {
        copyButton.querySelector(".copy-tooltip").classList.remove("show");
      });
    });

    function toggleIcons(button, isSuccess) {
      const clipboardIcon = button.querySelector(".icon-clipboard");
      const checkIcon = button.querySelector(".icon-succeed");

      if (isSuccess) {
        clipboardIcon.style.display = "none";
        checkIcon.style.display = "inline";

        setTimeout(() => {
          checkIcon.style.display = "none";
          clipboardIcon.style.display = "inline";
        }, 1000);
      } else {
        clipboardIcon.style.display = "inline";
        checkIcon.style.display = "none";
      }
    }

    function showTooltip(tooltip, message) {
      tooltip.textContent = message;
      tooltip.classList.add("show");

      setTimeout(() => {
        tooltip.classList.remove("show");
      }, 1000);
    }
  });

  // mermaid
  if (window.mermaid) {
    document.addEventListener("DOMContentLoaded", () => {
      // Select all Mermaid code elements
      const mermaidElements = document.querySelectorAll(".language-mermaid");

      mermaidElements.forEach((codeElement) => {
        // Create a new div element with the 'mermaid' class
        const newElement = document.createElement("div");
        newElement.classList.add("mermaid");
        newElement.innerHTML = codeElement.textContent;

        // Replace the original element with the new element
        codeElement.parentElement.replaceWith(newElement);
      });

      // Initialize Mermaid
      mermaid.initialize({ startOnLoad: true });
    });
  }

  // search
  if (window.SimpleJekyllSearch) {
    document.addEventListener("DOMContentLoaded", function () {
      const searchInput = document.getElementById("search-input");
      const resultsContainer = document.getElementById("search-results");

      SimpleJekyllSearch({
        searchInput: searchInput,
        resultsContainer: resultsContainer,
        json: "/assets/search-data.json",
        searchResultTemplate:
          '<li class="result-item"><a href="{url}">{title}</a></li>',
        noResultsText: "",
        limit: 10,
        fuzzy: false,
      });

      searchInput.addEventListener("input", function () {
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
    });
  }

  // tocbot
  if (window.tocbot !== undefined) {
    document.addEventListener("DOMContentLoaded", function () {
      function initToc() {
        // Clear any existing TOC
        tocbot.destroy();

        const tocSelector = window.innerWidth >= 768 ? ".toc" : ".toc-mobile";

        tocbot.init({
          tocSelector: tocSelector,
          contentSelector: '[itemprop="articleBody"]',
          ignoreSelector: ".no_toc",
          headingSelector: "h2, h3",
          orderedList: false,
          scrollSmooth: false,
          collapseDepth: 0,

          // default class
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
      initToc();

      // Re-initialize TOC on window resize
      window.addEventListener("resize", function () {
        initToc();
      });
    });
  }

  // Navigation menu
  document.addEventListener("DOMContentLoaded", function () {
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".site-menu");
    const navLink = document.querySelectorAll(".menu-link");

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
  });

  // Go to Top
  document.addEventListener("DOMContentLoaded", function () {
    window.onscroll = function () {
      scrollFunction();
    };

    function scrollFunction() {
      if (
        document.body.scrollTop > 20 ||
        document.documentElement.scrollTop > 20
      ) {
        document.getElementById("back-to-top").classList.add("visible");
      } else {
        document.getElementById("back-to-top").classList.remove("visible");
      }
    }

    document
      .getElementById("back-to-top")
      .addEventListener("click", function () {
        document.body.scrollTop = 0; /* For Safari */
        document.documentElement.scrollTop = 0; /* For other browsers */
      });
  });

  // Process all if it has class 'highlight'
  /* function customHighlighter() {
    if (document.querySelectorAll('[class^="highlight"]')) {
      // Remove <div class="highlight"> while keeping its child nodes
      const divHighlightElements = document.querySelectorAll("div.highlight");
      divHighlightElements.forEach((element) => {
        let children = Array.from(element.childNodes);
        children.forEach((child) =>
          element.parentNode.insertBefore(child, element)
        );
        element.parentNode.removeChild(element);
      });

      // Replace <figure class="highlight"> with <div class="language-... highlighter-rouge">
      const figureHighlightElements =
        document.querySelectorAll("figure.highlight");
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
      const preHighlightElements = document.querySelectorAll("pre.highlight");
      preHighlightElements.forEach((preElement) => {
        let languageClassMatch =
          preElement.parentNode.className.match(/language-(\w+)/);
        if (languageClassMatch) {
          preElement.setAttribute("data-lang", languageClassMatch[1]);
        }
      });

      // Remove 'class' from <code> elements if they have 'data-lang' attribute
      const codeElements = document.querySelectorAll("pre code");
      codeElements.forEach((codeElement) => {
        if (codeElement.hasAttribute("data-lang")) {
          codeElement.removeAttribute("class");
          codeElement.removeAttribute("data-lang");
        }
      });

      // Select all tables with class "rouge-table"
      const tableElements = document.querySelectorAll("table.rouge-table");
      // Iterate over each table element
      tableElements.forEach((tableElement) => {
        // Replace <td class="gutter gl"> with <td class="rouge-gutter gl">
        tableElement
          .querySelectorAll("td.gutter.gl")
          .forEach(function (tdElement) {
            tdElement.className = tdElement.className.replace(
              "gutter",
              "rouge-gutter"
            );
          });

        // Replace <td class="code"> with <td class="rouge-code">
        tableElement.querySelectorAll("td.code").forEach(function (tdElement) {
          tdElement.className = tdElement.className.replace(
            "code",
            "rouge-code"
          );
        });
      });
    }
  }
  customHighlighter(); */
})();
