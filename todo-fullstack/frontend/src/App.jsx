import { useState } from 'react'
import { useTodos, useCreateTodo, useUpdateTodo, useToggleTodo, useDeleteTodo } from './hooks/useTodos'
import TodoForm from './components/TodoForm'
import TodoItem from './components/TodoItem'

export default function App() {
  const [editingTodo, setEditingTodo] = useState(null)

  const todosQuery = useTodos()
  const createMutation = useCreateTodo()
  const updateMutation = useUpdateTodo()
  const toggleMutation = useToggleTodo()
  const deleteMutation = useDeleteTodo()

  const saveTodo = (todo) => {
    if (todo.id) {
      updateMutation.mutate(todo, {
        onSuccess: () => setEditingTodo(null)
      })
    } else {
      createMutation.mutate(todo)
    }
  }

  const deleteTodo = (id) => {
    if (window.confirm('Delete this todo?')) {
      deleteMutation.mutate(id)
      if (editingTodo?.id === id) setEditingTodo(null)
    }
  }

  const busy =
    createMutation.isPending ||
    updateMutation.isPending ||
    toggleMutation.isPending ||
    deleteMutation.isPending

  return (
    <main className="container">
      <header>
        <h1>Todo App</h1>
        <p>Spring Boot + React + TanStack Query</p>
      </header>

      <TodoForm
        editingTodo={editingTodo}
        onSave={saveTodo}
        onCancel={() => setEditingTodo(null)}
        loading={createMutation.isPending || updateMutation.isPending}
      />

      {todosQuery.isLoading && <div className="status">Loading todos...</div>}

      {todosQuery.isError && (
        <div className="error">
          Unable to load todos. Make sure Spring Boot is running on port 8080.
        </div>
      )}

      {todosQuery.isSuccess && (
        <section>
          <div className="list-header">
            <h2>Todos</h2>
            <span>{todosQuery.data.length} item(s)</span>
          </div>

          {todosQuery.data.length === 0 ? (
            <div className="empty">No todos yet.</div>
          ) : (
            todosQuery.data.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                busy={busy}
                onToggle={id => toggleMutation.mutate(id)}
                onEdit={setEditingTodo}
                onDelete={deleteTodo}
              />
            ))
          )}
        </section>
      )}
    </main>
  )
}
