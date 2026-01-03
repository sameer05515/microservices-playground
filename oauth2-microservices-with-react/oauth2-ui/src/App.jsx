import { useState } from 'react'

const API_URL = 'http://localhost:8081'

function App() {
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  async function callApi(path) {
    setLoading(true)
    setResult('')

    try {
      const response = await fetch(`${API_URL}${path}`)
      const text = await response.text()

      setResult(
        `HTTP ${response.status}\n\n${text}`
      )
    } catch (error) {
      setResult(`Request failed:\n\n${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <h1>OAuth2 Microservice Demo</h1>

      <p className="description">
        React + Vite frontend for testing the Spring Boot OAuth2 Resource Server.
      </p>

      <div className="card">
        <h2>1. Public API</h2>
        <p>Does not require an access token.</p>
        <button onClick={() => callApi('/public')} disabled={loading}>
          Call /public
        </button>
      </div>

      <div className="card">
        <h2>2. Protected API</h2>
        <p>
          This endpoint requires a valid OAuth2 access token.
        </p>
        <button onClick={() => callApi('/products')} disabled={loading}>
          Call /products
        </button>
      </div>

      <div className="card">
        <h2>3. Token</h2>
        <p>
          The first version intentionally does not implement login/token
          handling in React. Use Keycloak/Postman to obtain a token.
        </p>
        <p className="hint">
          Next step: add Authorization Code + PKCE login directly from React.
        </p>
      </div>

      {loading && <div className="loading">Calling API...</div>}

      {result && (
        <pre className="result">
          {result}
        </pre>
      )}
    </div>
  )
}

export default App
