import { commentThemes } from "./utils.js";

export default class ThemeToggle {
  constructor(toggleSelector) {
    this.Theme = {
      ATTRIB: "data-mode",
      SYSTEM: "system",
      LIGHT: "light",
      DARK: "dark",
      giscus: {
        dark: "dark",
        light: "light",
      },
      utterances: {
        dark: "github-dark",
        light: "github-light",
      },
    };

    if (commentThemes) {
      this.Theme = {
        ...this.Theme,
        ...commentThemes,
      };
    }

    this.themeToggle = document.querySelector(toggleSelector);
    if (!this.themeToggle) return;
    this.themeButtons = this.themeToggle.querySelectorAll("button");
    this.initTheme();
  }

  setTheme(button, mode) {
    this.updateActiveButton(button);
    const appliedTheme = this.determineAppliedTheme(mode);
    this.applyTheme(appliedTheme);
    this.updateFrameThemes(appliedTheme);
  }

  updateActiveButton(button) {
    this.themeToggle.querySelector("button.active")?.classList.remove("active");
    button.classList.add("active");
  }

  determineAppliedTheme(mode) {
    if (mode === this.Theme.SYSTEM) {
      const prefersDarkMode = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      return prefersDarkMode ? this.Theme.DARK : this.Theme.LIGHT;
    }
    return mode;
  }

  applyTheme(theme) {
    document.documentElement.dataset["theme"] = theme;
    localStorage.setItem("theme", theme);
  }

  updateFrameThemes(appliedTheme) {
    this.updateFrameTheme(
      ".giscus-frame",
      this.Theme.giscus[appliedTheme],
      "https://giscus.app"
    );
    this.updateFrameTheme(
      ".utterances-frame",
      this.Theme.utterances[appliedTheme],
      "https://utteranc.es"
    );
  }

  updateFrameTheme(frameSelector, theme, targetOrigin) {
    const frame = document.querySelector(frameSelector);
    if (!frame) return;

    const message = frameSelector.startsWith(".giscus")
      ? { giscus: { setConfig: { theme: theme } } }
      : { type: "set-theme", theme: theme };

    frame.contentWindow.postMessage(message, targetOrigin);
  }

  initTheme() {
    const cacheTheme = localStorage.getItem("theme") || this.Theme.SYSTEM;
    const initialButton = Array.from(this.themeButtons).find(
      (btn) => btn.getAttribute(this.Theme.ATTRIB) === cacheTheme
    );
    if (initialButton) {
      this.setTheme(initialButton, cacheTheme);
    }

    this.themeButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const mode = button.getAttribute(this.Theme.ATTRIB);
        this.setTheme(button, mode);
      });
    });
  }
}
