import {
  useCallback,
  useEffect,
  useState,
  type CSSProperties,
  type FormEvent,
} from "react";

type Todo = {
  id: string;
  title: string;
  done: boolean;
};

const api = (path: string, init?: RequestInit) =>
  fetch(path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  const load = useCallback(async () => {
    setError(null);
    try {
      const res = await api("/api/todos");
      if (!res.ok) throw new Error(await res.text());
      const data = (await res.json()) as Todo[];
      setTodos(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function addTodo(e: FormEvent) {
    e.preventDefault();
    const title = draft.trim();
    if (!title) return;
    setError(null);
    try {
      const res = await api("/api/todos", {
        method: "POST",
        body: JSON.stringify({ title }),
      });
      if (!res.ok) throw new Error(await res.text());
      const created = (await res.json()) as Todo;
      setTodos((prev) => [...prev, created]);
      setDraft("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to add");
    }
  }

  async function toggleTodo(todo: Todo) {
    setError(null);
    try {
      const res = await api(`/api/todos/${todo.id}`, {
        method: "PATCH",
        body: JSON.stringify({ done: !todo.done }),
      });
      if (!res.ok) throw new Error(await res.text());
      const updated = (await res.json()) as Todo;
      setTodos((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update");
    }
  }

  async function deleteTodo(id: string) {
    setError(null);
    try {
      const res = await api(`/api/todos/${id}`, { method: "DELETE" });
      if (!res.ok && res.status !== 204) throw new Error(await res.text());
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete");
    }
  }

  return (
    <div style={styles.wrap}>
      <main style={styles.card}>
        <h1 style={styles.title}>Todos</h1>
        <p style={styles.meta}>Backend port 3401 · Frontend dev port 3402</p>

        <form onSubmit={addTodo} style={styles.form}>
          <input
            style={styles.input}
            placeholder="New task…"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            aria-label="New task"
          />
          <button type="submit" style={styles.primary}>
            Add
          </button>
        </form>

        {error ? (
          <p role="alert" style={styles.err}>
            {error}
          </p>
        ) : null}

        {loading ? (
          <p style={styles.hint}>Loading…</p>
        ) : todos.length === 0 ? (
          <p style={styles.hint}>No tasks yet.</p>
        ) : (
          <ul style={styles.list}>
            {todos.map((todo) => (
              <li key={todo.id} style={styles.row}>
                <label style={styles.label}>
                  <input
                    type="checkbox"
                    checked={todo.done}
                    onChange={() => void toggleTodo(todo)}
                  />
                  <span
                    style={{
                      ...styles.taskTitle,
                      textDecoration: todo.done ? "line-through" : undefined,
                      opacity: todo.done ? 0.65 : 1,
                    }}
                  >
                    {todo.title}
                  </span>
                </label>
                <button
                  type="button"
                  style={styles.danger}
                  onClick={() => void deleteTodo(todo.id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  wrap: {
    maxWidth: 560,
    margin: "0 auto",
    padding: "2rem 1rem",
  },
  card: {
    background: "#fff",
    borderRadius: 12,
    padding: "1.5rem",
    boxShadow: "0 10px 40px rgba(15, 23, 42, 0.08)",
  },
  title: {
    margin: "0 0 0.25rem",
    fontSize: "1.75rem",
    fontWeight: 700,
  },
  meta: {
    margin: "0 0 1.25rem",
    fontSize: "0.875rem",
    color: "#64748b",
  },
  form: {
    display: "flex",
    gap: "0.5rem",
    marginBottom: "1rem",
  },
  input: {
    flex: 1,
    padding: "0.6rem 0.75rem",
    borderRadius: 8,
    border: "1px solid #cbd5e1",
    outline: "none",
  },
  primary: {
    padding: "0.6rem 1rem",
    borderRadius: 8,
    border: "none",
    background: "#2563eb",
    color: "#fff",
    fontWeight: 600,
  },
  danger: {
    padding: "0.35rem 0.65rem",
    borderRadius: 8,
    border: "1px solid #fecaca",
    background: "#fef2f2",
    color: "#b91c1c",
    fontSize: "0.875rem",
  },
  err: {
    color: "#b91c1c",
    fontSize: "0.9rem",
    margin: "0 0 1rem",
  },
  hint: {
    color: "#64748b",
    margin: 0,
  },
  list: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  row: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "0.75rem",
    padding: "0.5rem 0",
    borderBottom: "1px solid #e2e8f0",
  },
  label: {
    display: "flex",
    alignItems: "center",
    gap: "0.65rem",
    flex: 1,
    cursor: "pointer",
  },
  taskTitle: {
    flex: 1,
    wordBreak: "break-word",
  },
};
