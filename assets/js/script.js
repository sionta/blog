(() => {
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
    mermaid: {
      light: "default",
      dark: "dark",
    },
  };

  const themeToggle = document.querySelector("#theme-toggle");
  const themeButtons = themeToggle.querySelectorAll("button");

  function getTheme() {
    return (
      document.documentElement.getAttribute("data-theme") ||
      localStorage.getItem("theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light")
    );
  }

  function setTheme(mode) {
    if (mode === Theme.toggle.system) {
      document.documentElement.removeAttribute("data-theme");
      localStorage.removeItem("theme");
    } else {
      document.documentElement.setAttribute("data-theme", mode);
      localStorage.setItem("theme", mode);
      updateFrameThemes(mode);
    }

    themeButtons.forEach((button) =>
      button.classList.toggle(
        "active",
        button.getAttribute("data-mode") === mode
      )
    );
  }

  function updateFrameThemes(t) {
    updateFrame(
      ".giscus-frame",
      { giscus: { setConfig: { theme: Theme.giscus[t] } } },
      "https://giscus.app"
    );

    updateFrame(
      ".utterances-frame",
      { type: "set-theme", theme: Theme.utterances[t] },
      "https://utteranc.es"
    );
  }

  function updateFrame(e, m, o) {
    const frame = document.querySelector(e);
    if (frame && frame.contentWindow) {
      frame.contentWindow.postMessage(m, o);
    }
  }

  function initializeTheme() {
    if (!themeButtons) return;
    const cacheTheme = localStorage.getItem("theme") || Theme.toggle.system;
    setTheme(cacheTheme);

    themeButtons.forEach((button) =>
      button.addEventListener("click", () =>
        setTheme(button.getAttribute("data-mode"))
      )
    );
  }

  initializeTheme();

  function createScript(t, d) {
    const s = document.createElement("script");
    Object.entries(d).forEach(([k, v]) => s.setAttribute(k, v));
    (t || document.body).appendChild(s);
  }

  fetch("/assets/js/data.json")
    .then((res) => res.json())
    .then((data) => {
      searchPost(data.search_data);

      const JEKYLL_ENV = data.env;
      const ANALYTICS = data.analytics;
      const COMMENTS = data.comments;

      const siteComment =
        document.getElementById("site-comment") ||
        document.getElementById("disqus_thread");

      if (siteComment) {
        const PROVIDER = COMMENTS.provider;
        const PROVIDER_DATA = COMMENTS.providerData;
        const commentTheme = Theme[PROVIDER][getTheme()];

        if (!PROVIDER_DATA) {
          console.error(`Provider data for ${PROVIDER} is missing`);
          return;
        }

        if (PROVIDER === "giscus") {
          createScript(siteComment, {
            src: "https://giscus.app/client.js",
            "data-repo": PROVIDER_DATA.repo,
            "data-repo-id": PROVIDER_DATA.repo_id,
            "data-category": PROVIDER_DATA.category,
            "data-category-id": PROVIDER_DATA.category_id,
            "data-mapping": PROVIDER_DATA.mapping || "pathname",
            "data-strict": PROVIDER_DATA.strict || 0,
            "data-reactions-enabled": PROVIDER_DATA.reactions_enabled || 1,
            "data-emit-metadata": PROVIDER_DATA.emit_metadata || 0,
            "data-input-position": PROVIDER_DATA.input_position || "bottom",
            "data-theme": PROVIDER_DATA.theme || commentTheme,
            "data-lang": PROVIDER_DATA.lang || "en",
            "data-loading": "lazy",
            crossorigin: "anonymous",
            async: true,
          });
        } else if (PROVIDER === "utterances") {
          createScript(siteComment, {
            src: "https://utteranc.es/client.js",
            repo: PROVIDER_DATA.repo,
            label: PROVIDER_DATA.label,
            "issue-term": PROVIDER_DATA.issue_term || "pathname",
            theme: PROVIDER_DATA.theme || commentTheme,
            crossorigin: "anonymous",
            async: true,
          });
        } else if (PROVIDER === "disqus") {
          const pageId =
            siteComment.getAttribute("pageid") ||
            document.querySelector("article[itemid]")?.getAttribute("itemid");

          var disqus_config = function () {
            this.page.url = pageId;
            this.page.identifier = pageId;
          };

          createScript(siteComment, {
            src: "https://" + PROVIDER_DATA.shortname + ".disqus.com/embed.js",
            "data-timestamp": +new Date(),
          });

          /* const noscriptMessage = document.createElement("noscript");
          noscriptMessage.innerHTML =
            'Please enable JavaScript to view the <a href="https://disqus.com/?ref_noscript">comments powered by Disqus.</a>';
          siteComment.appendChild(noscriptMessage); */
        }
      }

      if (JEKYLL_ENV === "production") {
        if (ANALYTICS.google.id) {
          createScript(document.head, {
            src: `https://www.googletagmanager.com/gtag/js?id=${ANALYTICS.google.id}`,
            async: true,
          });

          window.dataLayer = window.dataLayer || [];
          function gtag() {
            dataLayer.push(arguments);
          }
          gtag("js", new Date());
          gtag("config", ANALYTICS.google.id);
        }

        if (ANALYTICS.goatcounter.id) {
          createScript(document.head, {
            "data-goatcounter": `https://${ANALYTICS.goatcounter.id}.goatcounter.com/count`,
            src: "//gc.zgo.at/count.js",
            async: true,
          });
        }

        if (ANALYTICS.cloudflare.id) {
          createScript(document.head, {
            "data-cf-beacon": ANALYTICS.cloudflare.id,
            src: "https://static.cloudflareinsights.com/beacon.min.js",
            defer: true,
          });
        }

        if (ANALYTICS.umami.id && ANALYTICS.umami.domain) {
          createScript(document.head, {
            "data-website-id": ANALYTICS.umami.id,
            src: ANALYTICS.umami.domain + "/umami.js",
            async: true,
            defer: true,
          });
        }
      } else {
        console.warn(
          "Web analytics is found but only work in 'JEKYLL_ENV=production'."
        );
      }
    })
    .catch((error) => console.error("Error fetching data:", error));

  function searchPost(json) {
    if (!window.SimpleJekyllSearch) return;

    const searchInput = document.getElementById("search-input");
    if (!searchInput) return;

    const searchResults = document.getElementById("search-results");

    window.SimpleJekyllSearch({
      searchInput: searchInput,
      resultsContainer: searchResults,
      json: json,
      searchResultTemplate:
        '<li class="search-item"><a class="search-link" href="{url}">{title}</a></li>',
      noResultsText: "",
      limit: 10,
      fuzzy: false,
    });

    searchInput.addEventListener("input", () => {
      const searchTerm = searchInput.value;
      if (searchTerm === "") {
        searchResults.innerHTML = "";
      } else if (searchResults.innerHTML.trim() === "") {
        searchResults.innerHTML = `<div class="no-results"><span>No results for</span> <span>"${searchTerm}</span>"</div>`;
      }
    });
  }

  if (window.mermaid) {
    const mermaidConfig = {
      startOnLoad: true,
      theme: Theme.mermaid[getTheme()],
      logLevel: "error",
      securityLevel: "strict",
      flowchart: {
        htmlLabels: true,
        curve: "basis",
      },
      sequence: {
        diagramMarginX: 50,
        diagramMarginY: 10,
      },
      gantt: {
        axisFormat: "%m/%d/%Y",
      },
    };

    // Convert pre > code elements to div.mermaid
    const mermaidBlocks = document.querySelectorAll(
      "pre code.language-mermaid"
    );

    mermaidBlocks.forEach((block) => {
      const codeBlock = block.parentElement;
      const rootDiv = document.createElement("pre");
      const subDiv = document.createElement("code");
      rootDiv.classList.add("mermaid-diagram");
      subDiv.classList.add("mermaid");
      subDiv.innerHTML = block.innerHTML;
      rootDiv.appendChild(subDiv);
      codeBlock.replaceWith(rootDiv);
    });

    // Re-render Mermaid diagrams
    mermaid.initialize(mermaidConfig);
    mermaid.init();
  }

  const gotoTop = document.getElementById("goto-top");

  if (gotoTop && getScreenSize() === "desktop") {
    function initializeGoTop() {
      window.addEventListener("scroll", () => {
        gotoTop.classList.toggle("visible", window.scrollY > 20);
      });

      gotoTop.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }

    initializeGoTop();
    window.addEventListener("resize", initializeGoTop());
  }

  if (window.tocbot) {
    const initializeToc = () => {
      const tocSelector =
        getScreenSize() === "desktop" ? "#toc" : "#toc-mobile";
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
      visible: "always",
      class: "anchor-link",
      ariaLabel: "Anchor",
      selectors: "h2, h3, h4, h5, h6",
    };
    anchors.add().remove(".no-anchor, .no_anchor");
  }

  function getScreenSize() {
    return window.innerWidth >= 768 ? "desktop" : "mobile";
  }
})();
