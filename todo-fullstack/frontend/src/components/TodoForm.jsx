import { useEffect, useState } from 'react'

export default function TodoForm({ editingTodo, onSave, onCancel, loading }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  useEffect(() => {
    setTitle(editingTodo?.title ?? '')
    setDescription(editingTodo?.description ?? '')
  }, [editingTodo])

  const submit = (e) => {
    e.preventDefault()
    if (!title.trim()) return

    onSave({
      ...(editingTodo ? { id: editingTodo.id } : {}),
      title: title.trim(),
      description: description.trim()
    })

    if (!editingTodo) {
      setTitle('')
      setDescription('')
    }
  }

  return (
    <form className="todo-form" onSubmit={submit}>
      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Todo title"
        maxLength={200}
      />

      <textarea
        value={description}
        onChange={e => setDescription(e.target.value)}
        placeholder="Description (optional)"
        rows="3"
      />

      <div className="form-actions">
        <button disabled={loading}>
          {loading ? 'Saving...' : editingTodo ? 'Update' : 'Add Todo'}
        </button>

        {editingTodo && (
          <button type="button" className="secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}
