const activeNavbar = document.querySelectorAll("header > nav a");
const themeToggle = document.getElementById("theme-toggle");
const savedTheme = localStorage.getItem("theme");

function setTheme() {
  const htmlElement = document.documentElement;
  if (themeToggle.checked) {
    htmlElement.setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark");
  } else {
    htmlElement.setAttribute("data-theme", "light");
    localStorage.setItem("theme", "light");
    /* htmlElement.removeAttribute("data-theme");
    localStorage.setItem("theme", "light"); */
  }
}

document.addEventListener("DOMContentLoaded", function () {
  activeNavbar.forEach((link) => {
    link.classList.remove("current");
    if (link.getAttribute("href") === window.location.pathname) {
      link.classList.add("current");
    }
  });
  themeToggle.addEventListener("change", setTheme);
  if (savedTheme === "dark") {
    themeToggle.checked = true;
    setTheme();
  } else {
    themeToggle.checked = false;
    setTheme();
  }
});
