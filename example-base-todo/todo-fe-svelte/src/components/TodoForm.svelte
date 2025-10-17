<script>
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  let title = '';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      dispatch('addTodo', title.trim());
      title = '';
    }
  };
</script>

<form on:submit={handleSubmit} class="flex mb-4">
  <input
    type="text"
    bind:value={title}
    placeholder="Enter todo..."
    class="flex-1 border rounded-l-lg px-3 py-2 outline-none focus:ring focus:ring-blue-200"
  />
  <button
    type="submit"
    class="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600"
  >
    Add
  </button>
</form>
