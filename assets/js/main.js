(function () {
  function themeSwitcher() {
    const systemModeButton = document.querySelector("#system-mode");
    const themeSwitcherButtons = document.querySelectorAll(
      ".theme-switcher-button"
    );
    // Function to apply theme
    function applyTheme(theme) {
      document.documentElement.setAttribute("data-theme", theme);
    }

    // Function to apply system theme based on OS preference
    function applySystemTheme() {
      const prefersDarkMode =
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;
      applyTheme(prefersDarkMode ? "dark" : "light");
    }

    // Initialize theme based on user preference or system default
    function initTheme() {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme) {
        applyTheme(savedTheme);
        document.querySelector(`#${savedTheme}-mode`).classList.add("active");
      } else {
        applySystemTheme();
        systemModeButton.classList.add("active");
      }
    }

    // Event listeners for theme switcher buttons
    themeSwitcherButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        const theme = button.id.replace("-mode", "");
        applyTheme(theme);
        themeSwitcherButtons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");
        localStorage.setItem("theme", theme);
      });
    });

    // Event listener for system mode button
    systemModeButton.addEventListener("click", function () {
      localStorage.removeItem("theme");
      applySystemTheme();
      themeSwitcherButtons.forEach((btn) => btn.classList.remove("active"));
      this.classList.add("active");
    });

    // Listen for changes in system theme preference
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", applySystemTheme);

    // Initialize theme when the page loads
    initTheme();
  }

  // Navigation menu
  function navigationMenu() {
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");
    const navLink = document.querySelectorAll(".nav-link");

    if (hamburger && navMenu && navLink) {
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
  }

  // Copy to clipboard
  function copyToClipboard() {
    const copyButtons = document.querySelectorAll(".copy-button");

    if (copyButtons) {
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
                copyButton.querySelector(".tooltip"),
                copyButton.getAttribute("data-success-label")
              );
              toggleIcons(copyButton, true);
            })
            .catch(function (err) {
              console.error("Failed to copy text: ", err);
              showTooltip(
                copyButton.querySelector(".tooltip"),
                copyButton.getAttribute("data-error-label")
              );
            });
        });

        // Displays a message from the attribute when the mouse enters the button
        copyButton.addEventListener("mouseenter", function () {
          const tooltipText = copyButton.getAttribute("data-copy-label");
          showTooltip(copyButton.querySelector(".tooltip"), tooltipText);
        });

        // Delete message when mouse leaves button
        copyButton.addEventListener("mouseleave", function () {
          copyButton.querySelector(".tooltip").classList.remove("show");
        });
      });

      function toggleIcons(button, isSuccess) {
        const clipboardIcon = button.querySelector(".copy-clipboard");
        const checkIcon = button.querySelector(".copy-succeed");

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
    }
  }

  // Go to Top
  function scrollToTop() {
    const scrollTop = document.getElementById("scroll-top__link");
    if (scrollTop) {
      window.onscroll = function () {
        if (
          document.body.scrollTop > 20 ||
          document.documentElement.scrollTop > 20
        ) {
          scrollTop.classList.add("visible");
        } else {
          scrollTop.classList.remove("visible");
        }
      };

      scrollTop.addEventListener("click", function () {
        document.body.scrollTop = 0; /* For Safari */
        document.documentElement.scrollTop = 0; /* For other browsers */
      });
    }
  }

  // Shortcut keys
  if (window.location.pathname !== "/search/") {
    document.addEventListener("keydown", function (event) {
      if (event.ctrlKey && event.shiftKey && event.key === "F") {
        window.location.href = "/search/";
      }
    });
  }

  // Load all Functions
  themeSwitcher();
  scrollToTop();
  navigationMenu();
  copyToClipboard();
})();
