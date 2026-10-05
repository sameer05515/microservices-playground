const content = document.getElementById("content");
const preview = document.getElementById("preview");

function renderPreview() {
  const value = content.value.trim();

  if (!value) {
    preview.innerHTML = '<p class="muted">Start writing Markdown...</p>';
    return;
  }

  preview.innerHTML = marked.parse(value);

  preview.querySelectorAll("pre code").forEach(block => {
    hljs.highlightElement(block);
  });
}

content.addEventListener("input", renderPreview);
renderPreview();
