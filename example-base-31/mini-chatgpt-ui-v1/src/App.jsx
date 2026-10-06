import React, { useEffect, useRef, useState } from "react";

const initialMessages = [
  {
    id: 1,
    role: "assistant",
    content:
      "Hello! I'm Mini ChatGPT. Ask me anything, or try one of the suggestions below."
  }
];

const starterPrompts = [
  "Explain Java HashMap",
  "What is Spring Boot?",
  "Design a REST API",
  "Explain React hooks"
];

const mockAnswers = {
  "explain java hashmap":
    "Java HashMap stores key-value pairs using hashing. Internally, it uses an array of buckets. A key's hash is used to determine the bucket, and equals() is used to identify the matching key. In Java 8+, heavily-colliding buckets can be converted into balanced trees.",
  "what is spring boot?":
    "Spring Boot is a framework built on top of Spring that simplifies application development using auto-configuration, starter dependencies, embedded servers, and production-ready features such as Actuator.",
  "design a rest api":
    "A good REST API starts with resource-oriented URLs, appropriate HTTP methods, validation, consistent error responses, authentication/authorization, pagination, logging, and clear API documentation.",
  "explain react hooks":
    "React Hooks let functional components use React features such as state and lifecycle behavior. Common hooks include useState, useEffect, useMemo, useCallback, and useRef."
};

function App() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [conversations] = useState([
    { id: 1, title: "Java HashMap discussion" },
    { id: 2, title: "Spring Boot basics" },
    { id: 3, title: "React interview questions" }
  ]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isTyping, setIsTyping] = useState(false);

  const textareaRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const newChat = () => {
    setMessages(initialMessages);
    setInput("");
    setIsTyping(false);
    textareaRef.current?.focus();
  };

  const sendMessage = (text = input) => {
    const value = text.trim();

    if (!value || isTyping) {
      return;
    }

    setMessages((current) => [
      ...current,
      {
        id: Date.now(),
        role: "user",
        content: value
      }
    ]);

    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const answer =
        mockAnswers[value.toLowerCase()] ||
        `You asked: "${value}"\n\nThis is a demo response from Mini ChatGPT. The UI is ready to be connected to a real AI backend or the OpenAI API.`;

      setMessages((current) => [
        ...current,
        {
          id: Date.now() + 1,
          role: "assistant",
          content: answer
        }
      ]);

      setIsTyping(false);
    }, 700);
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
            className="icon-button mobile-only"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            ×
          </button>

          <button className="new-chat-button" onClick={newChat}>
            <span className="plus">+</span>
            <span>New chat</span>
          </button>
        </div>

        <div className="conversation-section">
          <div className="section-title">Recent</div>

          {conversations.map((conversation) => (
            <button className="conversation" key={conversation.id}>
              <span className="chat-icon">◌</span>
              <span>{conversation.title}</span>
            </button>
          ))}
        </div>

        <div className="sidebar-bottom">
          <div className="sidebar-item">
            <span>⚙</span>
            Settings
          </div>
          <div className="sidebar-item">
            <span>?</span>
            Help
          </div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="icon-button"
              onClick={() => setSidebarOpen((value) => !value)}
              aria-label="Toggle sidebar"
            >
              ☰
            </button>

            <div className="brand">
              <div className="brand-logo">✦</div>
              <span>Mini ChatGPT</span>
            </div>
          </div>

          <button className="new-chat-top" onClick={newChat}>
            New chat
          </button>
        </header>

        <section className="chat">
          <div className="messages">
            {messages.length === 1 && (
              <div className="welcome">
                <div className="welcome-logo">✦</div>
                <h1>How can I help you?</h1>
                <p>Ask a question or choose a prompt to get started.</p>

                <div className="prompt-grid">
                  {starterPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      className="prompt-card"
                      onClick={() => sendMessage(prompt)}
                    >
                      <span>{prompt}</span>
                      <span className="arrow">→</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((message) => (
              <div className={`message-row ${message.role}`} key={message.id}>
                <div className={`avatar ${message.role}`}>
                  {message.role === "assistant" ? "✦" : "P"}
                </div>

                <div className="message-content">
                  <div className="message-role">
                    {message.role === "assistant" ? "Mini ChatGPT" : "You"}
                  </div>

                  <div className="message-text">
                    {message.content.split("\n").map((line, index) => (
                      <span key={index}>
                        {line}
                        {index < message.content.split("\n").length - 1 && (
                          <br />
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="message-row assistant">
                <div className="avatar assistant">✦</div>

                <div className="message-content">
                  <div className="message-role">Mini ChatGPT</div>

                  <div className="typing">
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
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
                className="send-button"
                onClick={() => sendMessage()}
                disabled={!input.trim() || isTyping}
                aria-label="Send message"
              >
                ↑
              </button>
            </div>

            <div className="composer-hint">
              Mini ChatGPT can make mistakes. Check important information.
            </div>
          </div>
        </section>
      </main>

      {!sidebarOpen && (
        <button
          className="sidebar-open-button"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open sidebar"
        >
          ☰
        </button>
      )}
    </div>
  );
}

export default App;
