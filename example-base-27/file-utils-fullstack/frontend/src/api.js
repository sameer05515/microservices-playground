const request = async (url, options = {}) => {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  })

  const text = await response.text()
  let data = text

  try {
    data = text ? JSON.parse(text) : null
  } catch {
    // Keep plain text response.
  }

  if (!response.ok) {
    throw new Error(data?.error || data?.message || text || 'Request failed')
  }

  return data
}

export const api = {
  list: path => request(`/api/files/list?path=${encodeURIComponent(path || '')}`),

  root: () => request('/api/files/root'),

  mkdir: path => request('/api/files/directory', {
    method: 'POST',
    body: JSON.stringify({ path })
  }),

  copy: (source, destination) => request('/api/files/copy', {
    method: 'POST',
    body: JSON.stringify({ source, destination })
  }),

  move: (source, destination) => request('/api/files/move', {
    method: 'POST',
    body: JSON.stringify({ source, destination })
  }),

  delete: path => request(`/api/files?path=${encodeURIComponent(path)}`, {
    method: 'DELETE'
  }),

  zip: (source, destination) => request('/api/files/zip', {
    method: 'POST',
    body: JSON.stringify({ source, destination })
  }),

  unzip: (source, destination) => request('/api/files/unzip', {
    method: 'POST',
    body: JSON.stringify({ source, destination })
  }),

  find: (query, path) =>
    request(`/api/files/find?query=${encodeURIComponent(query)}&path=${encodeURIComponent(path || '')}`),

  count: path =>
    request(`/api/files/count?path=${encodeURIComponent(path || '')}`),

  emptyFolders: path =>
    request(`/api/files/empty-folders?path=${encodeURIComponent(path || '')}`),

  duplicates: path =>
    request(`/api/files/duplicates?path=${encodeURIComponent(path || '')}`)
}
