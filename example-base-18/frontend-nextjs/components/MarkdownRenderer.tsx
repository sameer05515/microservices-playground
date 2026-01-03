'use client';

import { useEffect, useMemo } from 'react';
import { marked } from 'marked';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-sql';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export default function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  // Configure marked options
  useEffect(() => {
    marked.setOptions({
      breaks: true,
      gfm: true,
      headerIds: true,
      mangle: false,
    });
  }, []);

  // Convert markdown to HTML with Prism syntax highlighting
  const htmlContent = useMemo(() => {
    if (!content) return '';

    // Custom renderer for code blocks
    const renderer = new marked.Renderer();
    
    renderer.code = (code: string, language: string = '') => {
      const lang = language || 'text';
      const highlighted = Prism.highlight(code, Prism.languages[lang] || Prism.languages.text, lang);
      
      return `
        <div class="markdown-code-block">
          <div class="markdown-code-header">
            <span class="markdown-code-lang">${lang}</span>
            <button 
              class="markdown-code-copy" 
              onclick="navigator.clipboard.writeText(\`${code.replace(/`/g, '\\`').replace(/\$/g, '\\$').replace(/\\/g, '\\\\')}\`)"
              title="Copy code"
            >
              📋 Copy
            </button>
          </div>
          <pre class="markdown-code-pre language-${lang}"><code class="language-${lang}">${highlighted}</code></pre>
        </div>
      `;
    };

    renderer.blockquote = (quote: string) => {
      return `<blockquote class="markdown-blockquote">${quote}</blockquote>`;
    };

    renderer.heading = (text: string, level: number) => {
      const id = text.toLowerCase().replace(/[^\w]+/g, '-');
      return `<h${level} id="${id}" class="markdown-heading-${level}">${text}</h${level}>`;
    };

    renderer.link = (href: string, title: string | null, text: string) => {
      const titleAttr = title ? ` title="${title}"` : '';
      return `<a href="${href}"${titleAttr} class="markdown-link" target="_blank" rel="noopener noreferrer">${text}</a>`;
    };

    return marked(content, { renderer });
  }, [content]);

  return (
    <div
      className={`markdown-content ${className}`}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}
