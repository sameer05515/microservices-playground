<script>
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  export let todos = [];

  const toggle = (todo) => dispatch('toggleTodo', todo);
  const remove = (id) => dispatch('deleteTodo', id);
</script>

<ul class="space-y-2">
  {#each todos as todo (todo.id)}
    <li
      class="flex justify-between items-center bg-white shadow p-3 rounded-lg hover:bg-gray-50 transition"
    >
      <div
        class="flex items-center space-x-3 cursor-pointer"
        on:click={() => toggle(todo)}
      >
        <input type="checkbox" checked={todo.completed} />
        <span
          class:text-gray-400={todo.completed}
          class:line-through={todo.completed}
        >
          {todo.title}
        </span>
      </div>
      <button
        on:click={() => remove(todo.id)}
        class="text-red-500 hover:text-red-700"
      >
        ✖
      </button>
    </li>
  {/each}

  {#if todos.length === 0}
    <p class="text-center text-gray-400 mt-4">No todos yet 😴</p>
  {/if}
</ul>
