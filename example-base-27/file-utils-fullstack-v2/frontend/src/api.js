const json = async (url, options = {}) => {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options
  })

  const text = await response.text()
  let data = text

  try {
    data = text ? JSON.parse(text) : null
  } catch {}

  if (!response.ok) {
    throw new Error(data?.error || data?.message || text || 'Request failed')
  }

  return data
}

export const api = {
  root: () => json('/api/files/root'),

  list: (path, page, size, sortBy, direction) =>
    json(`/api/files/list?path=${encodeURIComponent(path)}&page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`),

  mkdir: path => json('/api/files/directory', {
    method: 'POST',
    body: JSON.stringify({ path })
  }),

  copy: (source, destination) => json('/api/files/copy', {
    method: 'POST',
    body: JSON.stringify({ source, destination })
  }),

  move: (source, destination) => json('/api/files/move', {
    method: 'POST',
    body: JSON.stringify({ source, destination })
  }),

  delete: path => json(`/api/files?path=${encodeURIComponent(path)}`, {
    method: 'DELETE'
  }),

  zip: (source, destination) => json('/api/files/zip', {
    method: 'POST',
    body: JSON.stringify({ source, destination })
  }),

  unzip: (source, destination) => json('/api/files/unzip', {
    method: 'POST',
    body: JSON.stringify({ source, destination })
  }),

  job: id => json(`/api/files/jobs/${id}`),

  find: (query, path) =>
    json(`/api/files/find?query=${encodeURIComponent(query)}&path=${encodeURIComponent(path)}`),

  count: path =>
    json(`/api/files/count?path=${encodeURIComponent(path)}`),

  emptyFolders: path =>
    json(`/api/files/empty-folders?path=${encodeURIComponent(path)}`),

  duplicates: path =>
    json(`/api/files/duplicates?path=${encodeURIComponent(path)}`)
}

export function uploadFiles(path, files, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    const form = new FormData()

    for (const file of files) {
      form.append('files', file)
    }

    xhr.open('POST', `/api/files/upload?path=${encodeURIComponent(path)}`)

    xhr.upload.onprogress = event => {
      if (event.lengthComputable) {
        onProgress(Math.round((event.loaded / event.total) * 100))
      }
    }

    xhr.onload = () => {
      try {
        const data = JSON.parse(xhr.responseText)
        if (xhr.status >= 200 && xhr.status < 300) resolve(data)
        else reject(new Error(data.error || 'Upload failed'))
      } catch {
        reject(new Error('Invalid server response'))
      }
    }

    xhr.onerror = () => reject(new Error('Network error during upload'))
    xhr.send(form)
  })
}
