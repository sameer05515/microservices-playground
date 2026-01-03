import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

export const getTodos = async () => {
  const { data } = await api.get('/todos')
  return data
}

export const createTodo = async (todo) => {
  const { data } = await api.post('/todos', todo)
  return data
}

export const updateTodo = async ({ id, ...todo }) => {
  const { data } = await api.put(`/todos/${id}`, todo)
  return data
}

export const toggleTodo = async (id) => {
  const { data } = await api.patch(`/todos/${id}/complete`)
  return data
}

export const deleteTodo = async (id) => {
  await api.delete(`/todos/${id}`)
}
