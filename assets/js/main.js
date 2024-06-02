(function main() {
  if (window.location.pathname !== "/search/") {
    document.addEventListener("keydown", function (event) {
      if (event.ctrlKey && event.shiftKey && event.key === "F") {
        window.location.href = "/search/";
      }
    });
  }

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
