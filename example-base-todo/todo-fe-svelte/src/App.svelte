<script>
  import TodoList from './components/TodoList.svelte';
  import TodoForm from './components/TodoForm.svelte';

  let todos = [];

  const API_URL = 'http://localhost:8080/api/todos';

  const fetchTodos = async () => {
    const res = await fetch(API_URL);
    todos = await res.json();
  };

  const addTodo = async (title) => {
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, completed: false }),
    });
    await fetchTodos();
  };

  const toggleTodo = async (todo) => {
    await fetch(`${API_URL}/${todo.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...todo, completed: !todo.completed }),
    });
    await fetchTodos();
  };

  const deleteTodo = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    await fetchTodos();
  };

  fetchTodos();
</script>

<main class="container mx-auto max-w-md p-4">
  <h1 class="text-3xl font-bold text-center mb-6">📝 Svelte Todo App</h1>

  <TodoForm on:addTodo={(e) => addTodo(e.detail)} />

  <TodoList
    {todos}
    on:toggleTodo={(e) => toggleTodo(e.detail)}
    on:deleteTodo={(e) => deleteTodo(e.detail)}
  />
</main>
