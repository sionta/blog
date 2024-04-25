/* Requirer JQuery */
if (typeof jQuery !== "undefined") {
  $(document).ready(function () {
    /* Navigation active */
    function setActiveLink(query) {
      const currentUrl = window.location.pathname;
      query.each(function () {
        const link = $(this);
        if (link.attr("href") === currentUrl) {
          link.addClass("active");
        } else {
          link.removeClass("active");
        }
      });
    }
    setActiveLink($("header a"));

    /* Theme toogle */
    function setTheme(isDark) {
      if (isDark) {
        $("html").attr("data-theme", "dark");
        localStorage.setItem("theme", "dark"); // Simpan tema di local storage
      } else {
        $("html").removeAttr("data-theme");
        localStorage.setItem("theme", "light"); // Simpan tema di local storage
      }
    }
    function getSavedTheme() {
      return localStorage.getItem("theme");
    }
    function initializeTheme() {
      const savedTheme = getSavedTheme();
      const themeCheckbox = $('.theme-toggle input[type="checkbox"]');
      if (savedTheme === "dark") {
        themeCheckbox.prop("checked", true);
        setTheme(true);
      } else {
        themeCheckbox.prop("checked", false);
        setTheme(false);
      }
    }
    initializeTheme();
    $('.theme-toggle input[type="checkbox"]').on("change", function () {
      const isDarkTheme = $(this).is(":checked");
      setTheme(isDarkTheme);
    });
  });
}
