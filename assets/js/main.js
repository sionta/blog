(function () {
  const gotoTop = document.getElementById("goto-top");
  window.addEventListener("scroll", () => {
    gotoTop.classList.toggle("active", window.scrollY > 350);
  });
  gotoTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  const articleBody = "[itemprop=articleBody]";

  if (window.anchors) {
    anchors.options = {
      placement: "right",
      visible: "always",
      icon: "#",
      class: "anchor-link",
    };
    anchors
      .add(`:where(${articleBody}) :where(h2)`)
      .remove(".no-anchor, .no_anchor");
  }

  if (window.tocbot) {
    const initializeToc = function () {
      const toc = window.innerWidth >= 768 ? "#toc" : "#toc-mobile";
      if (!toc) return;

      let ordered = false;
      let heading = "h2, h3";

      if (toc == "#toc-mobile") {
        ordered = true;
        heading = "h2";
      }

      tocbot.destroy();
      tocbot.init({
        tocSelector: toc,
        contentSelector: articleBody,
        ignoreSelector: ".no_toc, .no-toc",
        headingSelector: heading,
        orderedList: ordered,
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
      });
      tocbot.refresh();
    };
    initializeToc();
    window.addEventListener("resize", initializeToc);
  }

  if (window.mermaid) {
    const mermaidConfig = {
      startOnLoad: true,
      theme:
        THEME.mermaid[localStorage.getItem("theme") || THEME.mermaid.light],
      logLevel: "error",
    };
    const mermaidBlocks = document.querySelectorAll(
      "pre code.language-mermaid"
    );
    /* mermaidBlocks.forEach((block) => {
      const codeBlock = block.parentElement;
      const pre = document.createElement("pre");
      const code = document.createElement("code");
      pre.classList.add("mermaid-diagram");
      code.classList.add("mermaid");
      code.innerHTML = block.innerHTML;
      pre.appendChild(code);
      codeBlock.replaceWith(pre);
    }); */
    if (mermaidBlocks) {
      mermaid.initialize(mermaidConfig);
      mermaid.init(undefined, mermaidBlocks);
    }
  }
})();
