import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'
})

export async function uploadJar(file) {
  const form = new FormData()
  form.append('file', file)
  const r = await api.post('/api/jars', form)
  return r.data
}

export async function getJars() {
  return (await api.get('/api/jars')).data
}

export async function getClasses(jarId) {
  return (await api.get(`/api/jars/${encodeURIComponent(jarId)}/classes`)).data
}

export async function getMethods(jarId, className) {
  return (await api.get(`/api/jars/${encodeURIComponent(jarId)}/methods`, {
    params: { className }
  })).data
}

export async function createJavaService(payload) {
  return (await api.post('/api/java-services', payload)).data
}

export async function getJavaServices() {
  return (await api.get('/api/java-services')).data
}

export async function executeJavaService(serviceId, argumentsList) {
  return (await api.post(`/api/java-services/${encodeURIComponent(serviceId)}/execute`, {
    arguments: argumentsList
  })).data
}

export async function getExecutionHistory() {
  return (await api.get('/api/java-services/execution-history')).data
}

export async function getServiceExecutionHistory(serviceId) {
  return (await api.get(`/api/java-services/${encodeURIComponent(serviceId)}/execution-history`)).data
}
