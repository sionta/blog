(function () {
  // document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname !== "/blog/") {
    document.addEventListener("keydown", function (event) {
      if (event.ctrlKey && event.shiftKey && event.key === "F") {
        window.location.href = "/blog/";
      }
    });
  }

  const gotoTop = document.getElementById("goto-top");
  if (gotoTop) {
    window.addEventListener("scroll", () => {
      gotoTop.classList.toggle("active", window.scrollY > 350);
    });
    gotoTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    const articleBody = "[itemprop=articleBody]";
    const articleHeadings = "h2, h3";

    if (window.anchors) {
      anchors.options = {
        placement: "right",
        visible: "always",
        icon: "#",
        class: "anchor-link",
      };
      anchors
        .add(`${articleBody} :where(${articleHeadings})`)
        .remove(".no-anchor, .no_anchor");
    }

    if (window.tocbot) {
      const initializeToc = () => {
        const tocTag = window.innerWidth >= 768 ? "#toc" : "#toc-mobile";
        if (!tocTag) return;

        const config = {
          tocSelector: tocTag,
          contentSelector: articleBody,
          ignoreSelector: ".no_toc, .no-toc",
          headingSelector: articleHeadings,
          orderedList: false,
          collapseDepth: 0,
          listClass: "toc-list",
          listItemClass: "toc-item",
          activeListItemClass: "is-active-item",
          linkClass: "toc-link",
          activeLinkClass: "is-active-link",
          isCollapsedClass: "is-collapsed",
          collapsibleClass: "is-collapsible",
          positionFixedClass: "is-position-fixed",
          fixedSidebarOffset: "auto",
        };

        if (tocTag == "#toc-mobile") {
          config.orderedList = true;
          config.headingSelector = "h2";
        }

        tocbot.destroy();
        tocbot.init(config);
        tocbot.refresh();
      };

      initializeToc();
      window.addEventListener("resize", initializeToc);
    }

    if (window.mermaid) {
      const initializeMermaid = () => {
        const mermaidTag = document.querySelectorAll(".language-mermaid");
        if (!mermaidTag) return;

        mermaidTag.forEach((block) => {
          const pre = block.parentElement; // pre
          const a = document.createElement("figure");
          const b = document.createElement("pre");
          a.classList.add("diagram");
          b.classList.add("mermaid");
          b.innerHTML = pre.innerText;
          a.appendChild(b);
          pre.replaceWith(a);
        });

        mermaid.initialize({
          startOnLoad: true,
          theme:
            THEME.mermaid[localStorage.getItem("theme") || THEME.mermaid.light],
          logLevel: "warn",
        });
      };

      initializeMermaid();
    }
  }
  // });
})();
