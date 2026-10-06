import React, { useEffect, useMemo, useRef, useState } from "react";
import { marked } from "marked";
import hljs from "highlight.js";

const API_URL = "http://localhost:8080/api";

marked.setOptions({
  gfm: true,
  breaks: true
});

function Markdown({ content }) {
  const html = useMemo(() => {
    const renderer = new marked.Renderer();

    renderer.code = ({ text, lang }) => {
      const language = lang && hljs.getLanguage(lang) ? lang : "plaintext";
      const highlighted = hljs.highlight(text, { language }).value;

      return `
        <div class="code-block">
          <div class="code-header">
            <span>${lang || "code"}</span>
            <button class="copy-code" data-code="${encodeURIComponent(text)}">Copy</button>
          </div>
          <pre><code class="hljs language-${language}">${highlighted}</code></pre>
        </div>
      `;
    };

    return marked.parse(content, { renderer });
  }, [content]);

  const handleClick = (event) => {
    const button = event.target.closest(".copy-code");

    if (!button) {
      return;
    }

    const code = decodeURIComponent(button.dataset.code);

    navigator.clipboard
      .writeText(code)
      .then(() => {
        button.textContent = "Copied";

        window.setTimeout(() => {
          button.textContent = "Copy";
        }, 1200);
      })
      .catch(() => {
        button.textContent = "Failed";

        window.setTimeout(() => {
          button.textContent = "Copy";
        }, 1200);
      });
  };

  return (
    <div
      className="markdown"
      onClick={handleClick}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

const starterPrompts = [
  "Explain Java HashMap internally",
  "What is Spring Boot?",
  "Design a microservices architecture",
  "Explain React useEffect"
];

function App() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      content:
        "Hello! I'm **Mini ChatGPT V2.1**.\n\nMarkdown and code highlighting are enabled."
    }
  ]);

  const [input, setInput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [backendStatus, setBackendStatus] = useState("checking");

  const textareaRef = useRef(null);
  const bottomRef = useRef(null);

  // IMPORTANT:
  // The effect itself is synchronous.
  // The async function is declared INSIDE the effect.
  useEffect(() => {
    let cancelled = false;

    const checkBackend = async () => {
      try {
        const response = await fetch(`${API_URL}/health`);

        if (!response.ok) {
          throw new Error("Backend health check failed");
        }

        const data = await response.json();

        if (!cancelled) {
          setBackendStatus(data.status === "UP" ? "online" : "offline");
        }
      } catch {
        if (!cancelled) {
          setBackendStatus("offline");
        }
      }
    };

    checkBackend();

    return () => {
      cancelled = true;
    };
  }, []);

  // Synchronous effect. It does NOT return a Promise.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [messages, loading]);

  const newChat = () => {
    setMessages([
      {
        id: Date.now(),
        role: "assistant",
        content: "New conversation started. How can I help?"
      }
    ]);

    setInput("");
    setError("");
    textareaRef.current?.focus();
  };

  const sendMessage = async (value = input) => {
    const text = value.trim();

    if (!text || loading) {
      return;
    }

    const userMessage = {
      id: Date.now(),
      role: "user",
      content: text
    };

    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setInput("");
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messages: nextMessages.map(({ role, content }) => ({
            role,
            content
          }))
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Request failed");
      }

      setMessages((current) => [
        ...current,
        {
          id: Date.now() + 1,
          role: "assistant",
          content: data.content
        }
      ]);
    } catch (err) {
      setError(
        err?.message ||
          "Unable to connect to the backend. Is the backend running on port 8080?"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="app">
      <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-top">
          <button
            className="mobile-close"
            onClick={() => setSidebarOpen(false)}
          >
            ×
          </button>

          <button className="new-chat" onClick={newChat}>
            <span>＋</span>
            New chat
          </button>
        </div>

        <div className="history">
          <div className="history-title">Recent</div>

          <button className="history-item">◌ Java interview questions</button>
          <button className="history-item">◌ Spring Boot discussion</button>
          <button className="history-item">◌ System design</button>
          <button className="history-item">◌ React interview prep</button>
        </div>

        <div className="sidebar-footer">
          <div>⚙ Settings</div>
          <div>?</div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="menu-button"
              onClick={() => setSidebarOpen((value) => !value)}
              aria-label="Toggle sidebar"
            >
              ☰
            </button>

            <div className="title">
              <span className="logo">✦</span>
              Mini ChatGPT
              <span className="version">V2.1</span>

              <span
                className={`status-dot ${backendStatus}`}
                title={`Backend: ${backendStatus}`}
              />
            </div>
          </div>

          <button className="top-new-chat" onClick={newChat}>
            New chat
          </button>
        </header>

        <section className="chat">
          <div className="messages">
            {messages.length === 1 && (
              <div className="welcome">
                <div className="welcome-logo">✦</div>
                <h1>How can I help you?</h1>
                <p>
                  React + Node.js + Express + Markdown + code highlighting.
                </p>

                <div className="prompts">
                  {starterPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => sendMessage(prompt)}
                    >
                      <span>{prompt}</span>
                      <span>→</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((message) => (
              <div className={`message ${message.role}`} key={message.id}>
                <div className={`avatar ${message.role}`}>
                  {message.role === "assistant" ? "✦" : "P"}
                </div>

                <div className="message-body">
                  <div className="message-name">
                    {message.role === "assistant" ? "Mini ChatGPT" : "You"}
                  </div>

                  {message.role === "assistant" ? (
                    <Markdown content={message.content} />
                  ) : (
                    <div className="user-text">{message.content}</div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="message assistant">
                <div className="avatar assistant">✦</div>

                <div className="message-body">
                  <div className="message-name">Mini ChatGPT</div>

                  <div className="typing">
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="error">
                <strong>Error:</strong> {error}
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          <div className="composer-area">
            <div className="composer">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Message Mini ChatGPT..."
                rows="1"
              />

              <button
                className="send"
                onClick={() => sendMessage()}
                disabled={!input.trim() || loading}
                aria-label="Send message"
              >
                ↑
              </button>
            </div>

            <div className="hint">
              Enter to send · Shift + Enter for a new line · Backend:{" "}
              {backendStatus}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
