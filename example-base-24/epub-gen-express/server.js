const express = require("express");
const fs = require("fs");
const os = require("os");
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const redoc = require("redoc-express");
const hljs = require("highlight.js");
const { marked } = require("marked");
const { markedHighlight } = require("marked-highlight");
const Epub = require("epub-gen");

marked.use(
  markedHighlight({
    emptyLangClass: "hljs",
    langPrefix: "hljs language-",
    highlight(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : "plaintext";
      try {
        return hljs.highlight(code, { language }).value;
      } catch {
        return hljs.highlightAuto(code).value;
      }
    },
  })
);

function buildEpubCss() {
  const epubRoot = path.dirname(require.resolve("epub-gen/package.json"));
  const hljsRoot = path.dirname(require.resolve("highlight.js/package.json"));
  const baseCss = fs.readFileSync(path.join(epubRoot, "templates", "template.css"), "utf8");
  const hlCss = fs.readFileSync(path.join(hljsRoot, "styles", "github.css"), "utf8");
  const extra = `
/* epub-gen-express: typography + code blocks */
body { font-family: Georgia, "Times New Roman", serif; line-height: 1.55; }
h1, h2, h3, h4, h5, h6 { font-family: system-ui, sans-serif; margin-top: 1em; margin-bottom: 0.5em; }
code { font-family: ui-monospace, Consolas, monospace; font-size: 0.9em; }
pre { margin: 1em 0; padding: 0; border-radius: 6px; overflow-x: auto; }
pre code.hljs { display: block; padding: 1em; font-size: 0.85em; }
table { border-collapse: collapse; width: 100%; margin: 1em 0; }
th, td { border: 1px solid #ddd; padding: 0.35em 0.6rem; }
blockquote { margin: 1em 0; padding-left: 1em; border-left: 4px solid #ccc; color: #555; }
`;
  return `${baseCss}\n${hlCss}\n${extra}`;
}

const EPUB_CSS = buildEpubCss();

const openApiSpec = require("./openapi.json");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json({ limit: "2mb" }));

app.get("/openapi.json", (_req, res) => {
  res.type("application/json").json(openApiSpec);
});

app.use("/swagger", swaggerUi.serve, swaggerUi.setup(openApiSpec, { explorer: true }));

app.get(
  "/redoc",
  redoc({
    title: "epub-gen-express API",
    specUrl: "/openapi.json",
    redocOptions: { hideDownloadButton: false }
  })
);

function safeEpubBasename(name) {
  if (!name || typeof name !== "string") return "book.epub";
  const base = path.basename(name).replace(/[^a-zA-Z0-9._-]/g, "_");
  return base.toLowerCase().endsWith(".epub") ? base : `${base}.epub`;
}

app.get("/health", (_req, res) => {
  res.type("text/plain").send("ok");
});

app.get("/", (_req, res) => {
  res.render("index");
});

/**
 * POST /epub
 * Body (JSON): { markdown, filename, title?, author? }
 * Response: application/epub+zip file download
 */
app.post("/epub", (req, res) => {
  const { markdown, filename, title, author } = req.body || {};

  if (typeof markdown !== "string" || !markdown.trim()) {
    return res.status(400).json({ error: "markdown is required (non-empty string)" });
  }

  const outName = safeEpubBasename(filename);
  const stem = path.basename(outName, ".epub");
  const bookTitle =
    title != null && String(title).trim()
      ? String(title).trim()
      : stem || "Untitled";
  const bookAuthor =
    author != null && String(author).trim()
      ? String(author).trim()
      : "anonymous";

  let html;
  try {
    html = marked.parse(markdown, { async: false });
  } catch (err) {
    return res.status(400).json({ error: "Invalid markdown", detail: String(err.message) });
  }

  const tmpPath = path.join(
    os.tmpdir(),
    `epub-${process.pid}-${Date.now()}-${Math.random().toString(36).slice(2)}-${outName}`
  );

  const epub = new Epub(
    {
      title: bookTitle,
      author: bookAuthor,
      verbose: false,
      appendChapterTitles: false,
      css: EPUB_CSS,
      content: [
        {
          title: bookTitle,
          data: html
        }
      ]
    },
    tmpPath
  );

  epub.promise.then(
    () => {
      res.download(tmpPath, outName, (err) => {
        fs.unlink(tmpPath, () => {});
        if (err && !res.headersSent) {
          res.status(500).json({ error: "Failed to send file" });
        }
      });
    },
    (err) => {
      fs.unlink(tmpPath, () => {});
      console.error(err);
      res.status(500).json({ error: err.message || "EPUB generation failed" });
    }
  );
});

const PORT = Number(process.env.PORT) || 3040;
app.listen(PORT, () => {
  const base = `http://localhost:${PORT}`;
  console.log(`epub-gen-express listening on ${base}`);
  console.log(`GET  /              — web UI (EJS)`);
  console.log(`GET  /swagger       — Swagger UI`);
  console.log(`GET  /redoc         — ReDoc`);
  console.log(`GET  /openapi.json  — OpenAPI 3 spec`);
  console.log(`POST /epub          JSON: { "markdown": "...", "filename": "my-book.epub" }`);
});
