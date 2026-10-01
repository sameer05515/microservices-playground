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

export async function getJars() { return (await api.get('/api/jars')).data }
export async function getClasses(jarId) { return (await api.get(`/api/jars/${encodeURIComponent(jarId)}/classes`)).data }
export async function getMethods(jarId, className) {
  return (await api.get(`/api/jars/${encodeURIComponent(jarId)}/methods`, { params: { className } })).data
}
export async function createJavaService(payload) { return (await api.post('/api/java-services', payload)).data }
export async function getJavaServices() { return (await api.get('/api/java-services')).data }
export async function executeJavaService(serviceId, argumentsList) {
  return (await api.post(`/api/java-services/${encodeURIComponent(serviceId)}/execute`, { arguments: argumentsList })).data
}
export async function getExecutionHistory() { return (await api.get('/api/java-services/execution-history')).data }
export async function getServiceExecutionHistory(serviceId) {
  return (await api.get(`/api/java-services/${encodeURIComponent(serviceId)}/execution-history`)).data
}

export async function testDbConnection(payload) {
  return (await api.post('/api/db-connections/test', payload)).data
}
export async function createDbConnection(payload) {
  return (await api.post('/api/db-connections', payload)).data
}
export async function getDbConnections() { return (await api.get('/api/db-connections')).data }

export async function createDbService(payload) {
  return (await api.post('/api/db-services', payload)).data
}
export async function getDbServices() { return (await api.get('/api/db-services')).data }
export async function testDbService(payload) {
  return (await api.post('/api/db-services/test', payload)).data
}
export async function getDbServiceDetails(serviceId) {
  return (await api.get(`/api/db-services/${encodeURIComponent(serviceId)}`)).data
}
export async function executeDbService(serviceId, parameters = {}) {
  return (await api.post(`/api/db-services/${encodeURIComponent(serviceId)}/execute`, parameters)).data
}

export async function getDbExecutionHistory() { return (await api.get('/api/db-services/execution-history')).data }
export async function getDbServiceExecutionHistory(serviceId) { return (await api.get(`/api/db-services/${encodeURIComponent(serviceId)}/execution-history`)).data }
export async function executeDbServiceRuntime(servicePath, parameters = {}) { return (await api.post(`/api/db-services/runtime/${encodeURIComponent(servicePath.replace(/^\//,''))}`, parameters)).data }

export async function testStoredProcedure(payload) { return (await api.post('/api/stored-procedure-services/test', payload)).data }
export async function createStoredProcedure(payload) { return (await api.post('/api/stored-procedure-services', payload)).data }
export async function getStoredProcedureServices() { return (await api.get('/api/stored-procedure-services')).data }
export async function executeStoredProcedure(serviceId, parameters = {}) { return (await api.post(`/api/stored-procedure-services/${encodeURIComponent(serviceId)}/execute`, parameters)).data }
export async function executeStoredProcedureRuntime(servicePath, parameters = {}) { return (await api.post(`/api/stored-procedure-services/runtime/${encodeURIComponent(servicePath.replace(/^\//,''))}`, parameters)).data }
export async function getStoredProcedureHistory() { return (await api.get('/api/stored-procedure-services/execution-history')).data }
