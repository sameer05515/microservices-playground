import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080/api'
})

export const getQuestions = () => api.get('/questions')
export const createQuestion = data => api.post('/questions', data)
export const updateQuestion = (id, data) => api.put(`/questions/${id}`, data)
export const deleteQuestion = id => api.delete(`/questions/${id}`)
