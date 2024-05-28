(function main() {
  function createScriptTag(path) {
    let scriptTag = document.createElement("script");
    scriptTag.src = path;
    document.body.appendChild(scriptTag);
  }

  function menuToggle() {
    let menuToggle = document.getElementById("menu-toggle");
    let navbar = document.querySelector(".navbar");
    if (menuToggle && navbar) {
      menuToggle.addEventListener("change", function () {
        if (menuToggle.checked) {
          navbar.style.display = "flex";
        } else {
          navbar.style.display = "none";
        }
      });
    }
  }
  menuToggle();

  function switchTheme() {
    const themeToggle = document.getElementById("theme-toggle");
    if (themeToggle) {
      if (localStorage.getItem("theme") === "dark") {
        document.documentElement.setAttribute("data-theme", "dark");
        themeToggle.checked = true;
      } else {
        document.documentElement.removeAttribute("data-theme");
      }
      themeToggle.addEventListener("change", function () {
        let newTheme = this.checked ? "dark" : "light";
        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
      });
    }
  }
  switchTheme();
})();
