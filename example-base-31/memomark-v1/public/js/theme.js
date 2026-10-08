(() => {
  const KEY = "memomark-theme";

  const currentTheme = () =>
    document.documentElement.dataset.theme || "light";

  function updateButton(theme) {
    const icon = document.getElementById("themeIcon");
    const label = document.getElementById("themeLabel");
    const button = document.getElementById("themeToggle");

    if (!icon || !label || !button) return;

    const dark = theme === "dark";
    icon.textContent = dark ? "☀️" : "🌙";
    label.textContent = dark ? "Light" : "Dark";
    button.setAttribute(
      "aria-label",
      dark ? "Switch to light theme" : "Switch to dark theme"
    );
    button.title = dark ? "Switch to light theme" : "Switch to dark theme";
  }

  function setTheme(theme) {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(KEY, theme);
    updateButton(theme);
  }

  document.addEventListener("DOMContentLoaded", () => {
    updateButton(currentTheme());

    const button = document.getElementById("themeToggle");
    button?.addEventListener("click", () => {
      setTheme(currentTheme() === "dark" ? "light" : "dark");
    });
  });
})();
