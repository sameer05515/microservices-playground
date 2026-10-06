import React, { useEffect, useMemo, useRef, useState } from "react";
import { marked } from "marked";
import hljs from "highlight.js";

const API_URL = "http://localhost:8080/api";
marked.setOptions({ gfm: true, breaks: true });

function Markdown({ content }) {
  const html = useMemo(() => {
    const renderer = new marked.Renderer();
    renderer.code = ({ text, lang }) => {
      const language = lang && hljs.getLanguage(lang) ? lang : "plaintext";
      const highlighted = hljs.highlight(text, { language }).value;
      return `<div class="code-block"><div class="code-header"><span>${lang || "code"}</span><button class="copy-code" data-code="${encodeURIComponent(text)}">Copy</button></div><pre><code class="hljs language-${language}">${highlighted}</code></pre></div>`;
    };
    return marked.parse(content, { renderer });
  }, [content]);
  const handleClick = (event) => {
    const button = event.target.closest(".copy-code");
    if (!button) return;
    navigator.clipboard.writeText(decodeURIComponent(button.dataset.code));
    button.textContent = "Copied";
    setTimeout(() => (button.textContent = "Copy"), 1200);
  };
  return <div className="markdown" onClick={handleClick} dangerouslySetInnerHTML={{ __html: html }} />;
}

const starterPrompts = ["Explain Java HashMap internally", "What is Spring Boot?", "Design a microservices architecture", "Explain React useEffect"];

export default function App() {
  const [messages, setMessages] = useState([{ id: 1, role: "assistant", content: "Hello! I'm **Mini ChatGPT V2**. I can render Markdown and code blocks." }]);
  const [input, setInput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const textareaRef = useRef(null), bottomRef = useRef(null);

  useEffect(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), [messages, loading]);
  const newChat = () => { setMessages([{ id: Date.now(), role: "assistant", content: "New conversation started. How can I help?" }]); setInput(""); setError(""); textareaRef.current?.focus(); };

  const sendMessage = async (value = input) => {
    const text = value.trim();
    if (!text || loading) return;
    const user = { id: Date.now(), role: "user", content: text };
    const next = [...messages, user];
    setMessages(next); setInput(""); setError(""); setLoading(true);
    try {
      const response = await fetch(`${API_URL}/chat`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: next.map(({ role, content }) => ({ role, content })) }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Request failed");
      setMessages(current => [...current, { id: Date.now() + 1, role: "assistant", content: data.content }]);
    } catch (err) { setError(err.message || "Unable to connect to backend."); }
    finally { setLoading(false); }
  };
  const keyDown = e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } };

  return <div className="app">
    <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
      <div className="sidebar-top"><button className="mobile-close" onClick={() => setSidebarOpen(false)}>×</button><button className="new-chat" onClick={newChat}>＋ New chat</button></div>
      <div className="history"><div className="history-title">Recent</div><button className="history-item">◌ Java interview questions</button><button className="history-item">◌ Spring Boot discussion</button><button className="history-item">◌ System design</button><button className="history-item">◌ React interview prep</button></div>
      <div className="sidebar-footer"><span>⚙ Settings</span><span>?</span></div>
    </aside>
    <main className="main">
      <header className="topbar"><div className="topbar-left"><button className="menu-button" onClick={() => setSidebarOpen(v => !v)}>☰</button><div className="title"><span className="logo">✦</span>Mini ChatGPT <span className="version">V2</span></div></div><button className="top-new-chat" onClick={newChat}>New chat</button></header>
      <section className="chat"><div className="messages">
        {messages.length === 1 && <div className="welcome"><div className="welcome-logo">✦</div><h1>How can I help you?</h1><p>Markdown, code highlighting and real backend support.</p><div className="prompts">{starterPrompts.map(p => <button key={p} onClick={() => sendMessage(p)}><span>{p}</span><span>→</span></button>)}</div></div>}
        {messages.map(m => <div className={`message ${m.role}`} key={m.id}><div className={`avatar ${m.role}`}>{m.role === "assistant" ? "✦" : "P"}</div><div className="message-body"><div className="message-name">{m.role === "assistant" ? "Mini ChatGPT" : "You"}</div><Markdown content={m.content}/></div></div>)}
        {loading && <div className="message assistant"><div className="avatar assistant">✦</div><div className="message-body"><div className="message-name">Mini ChatGPT</div><div className="typing"><span/><span/><span/></div></div></div>}
        {error && <div className="error"><strong>Error:</strong> {error}</div>}<div ref={bottomRef}/>
      </div><div className="composer-area"><div className="composer"><textarea ref={textareaRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={keyDown} placeholder="Message Mini ChatGPT..." rows="1"/><button className="send" onClick={() => sendMessage()} disabled={!input.trim() || loading}>↑</button></div><div className="hint">Enter to send · Shift + Enter for a new line</div></div></section>
    </main>
  </div>;
}
