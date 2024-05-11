var activeNavbar = document.querySelectorAll("header > nav a");
var themeToggle = document.getElementById("theme-toggle");
var savedTheme = localStorage.getItem("theme");

function setTheme() {
  var htmlElement = document.documentElement;
  if (themeToggle.checked) {
    htmlElement.setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark");
  } else {
    htmlElement.removeAttribute("data-theme");
    localStorage.setItem("theme");
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
    themeToggle.checked = true;  setTheme();
  } else {
    themeToggle.checked = false; setTheme();
  }
});
