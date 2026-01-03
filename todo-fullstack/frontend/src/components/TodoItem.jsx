export default function TodoItem({
  todo,
  onToggle,
  onEdit,
  onDelete,
  busy
}) {
  return (
    <article className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <div className="todo-main">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          disabled={busy}
        />

        <div>
          <h3>{todo.title}</h3>
          {todo.description && <p>{todo.description}</p>}
        </div>
      </div>

      <div className="todo-actions">
        <button className="secondary" onClick={() => onEdit(todo)} disabled={busy}>
          Edit
        </button>
        <button className="danger" onClick={() => onDelete(todo.id)} disabled={busy}>
          Delete
        </button>
      </div>
    </article>
  )
}
