const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080'
export function getToken(){ return localStorage.getItem('ig_token') }
export function setSession(data){ localStorage.setItem('ig_token', data.token); localStorage.setItem('ig_user', JSON.stringify({name:data.name,email:data.email})) }
export function clearSession(){ localStorage.removeItem('ig_token'); localStorage.removeItem('ig_user') }
export async function api(path, options={}) {
  const headers = { ...(options.body ? {'Content-Type':'application/json'} : {}), ...(getToken() ? {Authorization:`Bearer ${getToken()}`} : {}), ...options.headers }
  const response = await fetch(`${BASE}${path}`, {...options, headers})
  const raw = await response.text()
  let body = null
  try { body = raw ? JSON.parse(raw) : null } catch { body = raw }
  if (!response.ok) {
    if (response.status === 401) { clearSession(); window.dispatchEvent(new Event('ig-logout')) }
    throw new Error(body?.message || `Request failed (${response.status})`)
  }
  return body
}
