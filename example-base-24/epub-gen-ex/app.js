const Epub = require("epub-gen");

const option = {
  title: "My Book",
  author: "Prem",
  content: [
    {
      title: "Chapter 1",
      data: "<h1>Hello</h1><p>Markdown converted to HTML</p>"
    }
  ]
};

new Epub(option, "output.epub");