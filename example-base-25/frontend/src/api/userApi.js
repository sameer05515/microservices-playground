const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3003'

function getAuthToken() {
  const token = localStorage.getItem('token')
  if (!token) {
    return ''
  }

  return token.startsWith('Bearer ') ? token : `Bearer ${token}`
}

export function saveAuthToken(token) {
  if (!token) {
    return
  }

  const normalizedToken = token.startsWith('Bearer ')
    ? token.slice('Bearer '.length)
    : token
  localStorage.setItem('token', normalizedToken)
}

async function request(path, options) {
  const authToken = getAuthToken()

  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(authToken ? { Authorization: authToken } : {}),
      ...(options?.headers || {}),
    },
    ...options,
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    const message =
      data?.error || data?.message || `Request failed with status ${response.status}`
    throw new Error(message)
  }

  return data
}

export function registerUser(payload) {
  return request('/api/users/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function loginUser(payload) {
  return request('/api/users/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

