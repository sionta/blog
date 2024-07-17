(function () {
  "use strict";

  const Theme = {
    toggle: {
      system: "system",
      light: "light",
      dark: "dark",
    },
    giscus: {
      light: "light",
      dark: "dark_dimmed",
    },
    utterances: {
      light: "github-light",
      dark: "github-dark",
    },
  };

  function getDataTheme() {
    return (
      document.documentElement.getAttribute("data-theme") ||
      localStorage.getItem("theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light")
    );
  }

  const themeToggle = document.querySelector("#theme-toggle");

  if (themeToggle) {
    const themeButtons = themeToggle.querySelectorAll("button");

    function setTheme(mode) {
      if (mode === Theme.toggle.system) {
        document.documentElement.removeAttribute("data-theme");
        localStorage.removeItem("theme");
      } else {
        document.documentElement.setAttribute("data-theme", mode);
        localStorage.setItem("theme", mode);
      }

      themeButtons.forEach((button) =>
        button.classList.toggle(
          "active",
          button.getAttribute("data-mode") === mode
        )
      );

      updateFrameThemes(getDataTheme());
    }

    function updateFrameThemes(theme) {
      updateFrameTheme(
        ".giscus-frame",
        Theme.giscus[theme],
        "https://giscus.app"
      );
      updateFrameTheme(
        ".utterances-frame",
        Theme.utterances[theme],
        "https://utteranc.es"
      );
    }

    function updateFrameTheme(frameSelector, theme, targetOrigin) {
      const frame = document.querySelector(frameSelector);
      if (!frame) return;

      const message = frameSelector.includes("giscus")
        ? { giscus: { setConfig: { theme } } }
        : { type: "set-theme", theme };

      frame.contentWindow.postMessage(message, targetOrigin);
    }

    function initTheme() {
      const cacheTheme = localStorage.getItem("theme") || Theme.toggle.system;
      setTheme(cacheTheme);

      themeButtons.forEach((button) =>
        button.addEventListener("click", () =>
          setTheme(button.getAttribute("data-mode"))
        )
      );
    }

    initTheme();
  }

  fetch("/assets/data.json")
    .then((response) => response.json())
    .then((data) => {
      const siteComment =
        document.getElementById("site-comment") ||
        document.getElementById("disqus_thread");

      if (siteComment) {
        const comment = data.comments;
        const provider = comment.provider;
        const providerData = comment[provider];
        const commentTheme = Theme[provider][getDataTheme()];

        if (!providerData) {
          console.error(`Provider data for ${provider} is missing`);
          return;
        }

        const setupComment = (data) => {
          const script = document.createElement("script");
          Object.entries(data).forEach(([key, value]) =>
            script.setAttribute(key, value)
          );
          siteComment.appendChild(script);
        };

        if (provider === "giscus") {
          setupComment({
            src: "https://giscus.app/client.js",
            "data-repo": providerData.repo,
            "data-repo-id": providerData.repo_id,
            "data-category": providerData.category,
            "data-category-id": providerData.category_id,
            "data-mapping": providerData.mapping || "pathname",
            "data-strict": providerData.strict || 0,
            "data-reactions-enabled": providerData.reactions_enabled || 1,
            "data-emit-metadata": providerData.emit_metadata || 0,
            "data-input-position": providerData.input_position || "bottom",
            "data-theme": commentTheme,
            "data-lang": providerData.lang || "en",
            "data-loading": "lazy",
            crossorigin: "anonymous",
            async: true,
          });
        } else if (provider === "utterances") {
          setupComment({
            src: "https://utteranc.es/client.js",
            repo: providerData.repo,
            "issue-term": providerData.issue_term || "pathname",
            theme: commentTheme,
            crossorigin: "anonymous",
            async: true,
          });
        } else if (provider === "disqus") {
          setupComment({
            src: `https://${providerData.shortname}.disqus.com/embed.js`,
            "data-timestamp": Date.now().toString(),
          });

          const noscriptMessage = document.createElement("noscript");
          noscriptMessage.innerHTML =
            'Please enable JavaScript to view the <a href="https://disqus.com/?ref_noscript">comments powered by Disqus.</a>';
          siteComment.appendChild(noscriptMessage);
        }
      }
    })
    .catch((error) => console.error("Error fetching data:", error));

  if (window.tocbot) {
    const initializeToc = () => {
      const tocSelector = window.innerWidth >= 768 ? "#toc" : "#toc-mobile";
      if (!tocSelector) return;

      tocbot.destroy();
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

  const gotoTop = document.getElementById("goto-top");
  if (gotoTop) {
    window.addEventListener("scroll", () => {
      gotoTop.classList.toggle("visible", window.scrollY > 20);
    });
    gotoTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
})();
