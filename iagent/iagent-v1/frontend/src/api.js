import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'
})

export async function uploadJar(file, onUploadProgress) {
  const formData = new FormData()
  formData.append('file', file)

  const response = await api.post('/api/jars', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    onUploadProgress
  })

  return response.data
}

export async function getPublicClasses(jarId) {
  const response = await api.get(`/api/jars/${encodeURIComponent(jarId)}/classes`)
  return response.data
}

export async function getPublicMethods(jarId, className) {
  const response = await api.get(
    `/api/jars/${encodeURIComponent(jarId)}/methods`,
    {
      params: { className }
    }
  )

  return response.data
}