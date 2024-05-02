document.addEventListener("DOMContentLoaded", function () {
  const themeSwitch = document.getElementById("theme-switch");
  const htmlElement = document.querySelector("html");
  function toggleTheme() {
    if (themeSwitch.checked) {
      htmlElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    } else {
      htmlElement.setAttribute("data-theme", "light");
      localStorage.setItem("theme", "light");
    }
  }
  function loadTheme() {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      themeSwitch.checked = savedTheme === "dark";
      toggleTheme();
    }
  }
  themeSwitch.addEventListener("change", toggleTheme);
  loadTheme();
});
