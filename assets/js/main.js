(function () {
  document.addEventListener("DOMContentLoaded", function () {
    const Theme = {
      AUTO: "auto",
      LIGHT: "light",
      DARK: "dark",
    };

    const THEME_STORAGE_KEY = "theme";
    const THEME_OWNER = document.documentElement;

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

    // Function to update button states based on current theme
    function updateButtonStates() {
      const currentTheme =
        localStorage.getItem(THEME_STORAGE_KEY) || Theme.AUTO;
      document.querySelectorAll("#theme-switcher button").forEach((button) => {
        button.classList.remove("active");
      });
      document.getElementById(`theme-${currentTheme}`).classList.add("active");
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
      const initialTheme =
        localStorage.getItem(THEME_STORAGE_KEY) || Theme.AUTO;
      setTheme(initialTheme); // Set initial theme from localStorage
    }

    // Call initializeThemeSwitcher on DOMContentLoaded
    initializeThemeSwitcher();
  });

  /* // Process all if it has class 'highlight'
  function fixRougeHighlighter() {
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
  fixRougeHighlighter(); */
})();
