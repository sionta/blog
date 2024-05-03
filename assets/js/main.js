(function () {
  /* Active navigation */
  const navLinks = document.querySelectorAll("header > nav a");
  const currentUrl = window.location.pathname;
  navLinks.forEach((link) => {
    link.classList.remove("current");
    if (link.getAttribute("href") === currentUrl) {
      link.classList.add("current");
    }
  });
  /* Theme toogle */
  const htmlElement = document.querySelector("html");
  const themeSwitch = document.getElementById("theme-toggle");
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
})();
