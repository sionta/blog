(() => {
  const themeToggle = document.querySelector("#theme-toggle");
  if (themeToggle) {
    const Theme = {
      ATTRIB: "data-mode",
      SYSTEM: "system",
      LIGHT: "light",
      DARK: "dark",
      giscus: {
        dark: "dark_dimmed",
        light: "light",
      },
      utterances: {
        dark: "github-dark",
        light: "github-light",
      },
    };

    const themeButtons = themeToggle.querySelectorAll("button");

    function setTheme(button, mode) {
      updateActiveButton(button);
      const appliedTheme = determineAppliedTheme(mode);
      applyTheme(appliedTheme);
      updateFrameThemes(appliedTheme);
    }

    function updateActiveButton(button) {
      themeToggle.querySelector("button.active")?.classList.remove("active");
      button.classList.add("active");
    }

    function determineAppliedTheme(mode) {
      if (mode === Theme.SYSTEM) {
        const prefersDarkMode = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;
        return prefersDarkMode ? Theme.DARK : Theme.LIGHT;
      }
      return mode;
    }

    function applyTheme(theme) {
      document.documentElement.dataset["theme"] = theme;
      localStorage.setItem("theme", theme);
    }

    function updateFrameThemes(appliedTheme) {
      updateFrameTheme(
        ".giscus-frame",
        Theme.giscus[appliedTheme],
        "https://giscus.app"
      );
      updateFrameTheme(
        ".utterances-frame",
        Theme.utterances[appliedTheme],
        "https://utteranc.es"
      );
    }

    function updateFrameTheme(frameSelector, theme, targetOrigin) {
      const frame = document.querySelector(frameSelector);
      if (!frame) return;

      const message = frameSelector.startsWith(".giscus")
        ? { giscus: { setConfig: { theme: theme } } }
        : { type: "set-theme", theme: theme };

      frame.contentWindow.postMessage(message, targetOrigin);
    }

    function initTheme() {
      if (!themeButtons) return;

      const cacheTheme = localStorage.getItem("theme") || Theme.SYSTEM;
      const initialButton = Array.from(themeButtons).find(
        (btn) => btn.getAttribute(Theme.ATTRIB) === cacheTheme
      );

      if (initialButton) {
        setTheme(initialButton, cacheTheme);
      }

      themeButtons.forEach((button) => {
        button.addEventListener("click", () => {
          const mode = button.getAttribute(Theme.ATTRIB);
          setTheme(button, mode);
        });
      });
    }

    initTheme();
  }

  const gotoTop = document.getElementById("goto-top");
  if (gotoTop) {
    window.addEventListener("scroll", () => {
      gotoTop.classList.toggle("visible", window.scrollY > 20);
    });
    gotoTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  const copyButtons = document.querySelectorAll(".code-header button");
  if (!copyButtons) return;

  copyButtons.forEach((button) => {
    const copyLabel = button.getAttribute("copy-label") || button.innerHTML;
    const successLabel = button.getAttribute("success-label") || "Copied";

    button.addEventListener("click", () => {
      const codeBlock = button
        .closest(".code-blocks")
        ?.querySelector(".highlight .rouge-code, .highlight code");

      if (!codeBlock) return;

      navigator.clipboard
        .writeText(codeBlock.textContent.trim())
        .then(() => {
          button.innerHTML = successLabel;

          setTimeout(() => {
            button.innerHTML = copyLabel;
          }, 1000);
        })
        .catch((err) => {
          console.error("Failed to copy text:", err);
        });
    });
  });

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

  if (window.anchors) {
    anchors.options = {
      placement: "right",
      visible: "hover",
      class: "anchor-link",
      ariaLabel: "Anchor",
      selectors: "h2, h3, h4, h5, h6",
    };
    anchors.add().remove(".no-anchor, .no_anchor");
  }

  const diagramMermaid = document.querySelectorAll(".language-mermaid");
  if (window.mermaid && diagramMermaid) {
    diagramMermaid.forEach((codeElement) => {
      const newMermaid = document.createElement("pre");
      newMermaid.classList.add("mermaid");
      newMermaid.innerHTML = codeElement.textContent;
      codeElement.parentElement.replaceWith(newMermaid);
    });

    mermaid.initialize({ startOnLoad: true });
  }
})();
