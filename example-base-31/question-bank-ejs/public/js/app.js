(() => {
  const key = "question-bank-theme";
  const root = document.documentElement;
  const saved = localStorage.getItem(key);
  if (saved) root.dataset.theme = saved;

  const btn = document.getElementById("themeToggle");
  if (btn) {
    const update = () => btn.textContent = root.dataset.theme === "dark" ? "☀" : "☾";
    update();
    btn.addEventListener("click", () => {
      root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
      localStorage.setItem(key, root.dataset.theme);
      update();
    });
  }

  document.querySelectorAll("pre code").forEach(block => {
    const wrapper = block.parentElement;
    const copy = document.createElement("button");
    copy.className = "copy-btn";
    copy.textContent = "Copy";
    copy.addEventListener("click", async () => {
      await navigator.clipboard.writeText(block.innerText);
      copy.textContent = "Copied!";
      setTimeout(() => copy.textContent = "Copy", 1200);
    });
    wrapper.appendChild(copy);
  });

  document.addEventListener("keydown", e => {
    if (e.target.matches("input, textarea")) return;
    if (e.key === "/" ) {
      e.preventDefault();
      document.querySelector('input[name="q"]')?.focus();
    }
  });
})();