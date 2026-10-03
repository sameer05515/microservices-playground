import { useEffect, useMemo, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import {
  getQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion
} from './api'

const EMPTY = { id: null, question: '', answer: '' }

export default function App() {
  const [questions, setQuestions] = useState([])
  const [form, setForm] = useState(EMPTY)
  const [search, setSearch] = useState('')
  const [mode, setMode] = useState('edit')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    load()
  }, [])

  async function load() {
    try {
      setLoading(true)
      const { data } = await getQuestions()
      setQuestions(data)
      if (data.length) setForm(data[0])
    } catch (e) {
      console.error(e)
      alert('Backend is not running. Start Spring Boot on port 8080.')
    } finally {
      setLoading(false)
    }
  }

  function select(q) {
    setForm({ ...q })
    setMode('edit')
  }

  function newQuestion() {
    setForm({
      id: null,
      question: '# New Question',
      answer: 'Write the answer here...'
    })
    setMode('edit')
  }

  function change(field, value) {
    setForm(current => ({ ...current, [field]: value }))
  }

  async function save() {
    if (!form.question.trim()) {
      alert('Question cannot be empty.')
      return
    }

    try {
      setSaving(true)

      const response = form.id
        ? await updateQuestion(form.id, form)
        : await createQuestion(form)

      const saved = response.data

      setQuestions(current => {
        const exists = current.some(q => q.id === saved.id)
        return exists
          ? current.map(q => q.id === saved.id ? saved : q)
          : [...current, saved]
      })

      setForm(saved)
    } catch (e) {
      console.error(e)
      alert('Unable to save question.')
    } finally {
      setSaving(false)
    }
  }

  async function remove() {
    if (!form.id) return
    if (!window.confirm('Delete this question?')) return

    try {
      await deleteQuestion(form.id)

      const remaining = questions.filter(q => q.id !== form.id)
      setQuestions(remaining)

      if (remaining.length) {
        setForm(remaining[0])
      } else {
        newQuestion()
      }
    } catch (e) {
      console.error(e)
      alert('Unable to delete question.')
    }
  }

  const filtered = useMemo(() => {
    const text = search.trim().toLowerCase()
    if (!text) return questions

    return questions.filter(q =>
      `${q.question} ${q.answer}`.toLowerCase().includes(text)
    )
  }, [questions, search])

  return (
    <div className="app">
      <header className="topbar">
        <div>
          <h1>Question & Answer</h1>
          <small>Java • Spring Boot • React • System Design</small>
        </div>

        <div className="actions">
          <button className="primary" onClick={newQuestion}>＋ New</button>
          <button onClick={save} disabled={saving}>
            {saving ? 'Saving...' : '💾 Save'}
          </button>
          <button className="danger" onClick={remove} disabled={!form.id}>
            🗑 Delete
          </button>
        </div>
      </header>

      <div className="layout">
        <aside className="sidebar">
          <input
            className="search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search questions..."
          />

          <div className="count">{filtered.length} question(s)</div>

          <div className="question-list">
            {loading && <div className="empty">Loading...</div>}

            {!loading && filtered.map(q => (
              <button
                key={q.id}
                className={`question-item ${form.id === q.id ? 'selected' : ''}`}
                onClick={() => select(q)}
              >
                <span>#{q.id}</span>
                <strong>{q.question.replace(/^#+\s*/, '')}</strong>
              </button>
            ))}

            {!loading && !filtered.length && (
              <div className="empty">No questions found</div>
            )}
          </div>
        </aside>

        <main className="workspace">
          <div className="tabs">
            <button
              className={mode === 'edit' ? 'active' : ''}
              onClick={() => setMode('edit')}
            >
              Editor
            </button>

            <button
              className={mode === 'preview' ? 'active' : ''}
              onClick={() => setMode('preview')}
            >
              Markdown Preview
            </button>
          </div>

          {mode === 'edit' ? (
            <section className="editor">
              <label>Question — Markdown</label>
              <textarea
                value={form.question}
                onChange={e => change('question', e.target.value)}
                placeholder="Enter question..."
              />

              <label>Answer — Markdown</label>
              <textarea
                value={form.answer}
                onChange={e => change('answer', e.target.value)}
                placeholder="Enter answer..."
              />
            </section>
          ) : (
            <article className="preview markdown">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {`${form.question}\n\n${form.answer}`}
              </ReactMarkdown>
            </article>
          )}
        </main>
      </div>

      <footer>
        Spring Boot REST API • React + Vite • JSON persistence
      </footer>
    </div>
  )
}
