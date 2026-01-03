import { useEffect, useState } from 'react'
import Keycloak from 'keycloak-js'

const API_URL = 'http://localhost:8081'

const keycloak = new Keycloak({
  url: 'http://localhost:8080',
  realm: 'demo',
  clientId: 'react-client'
})

function App() {
  const [authenticated, setAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    keycloak
      .init({
        onLoad: 'check-sso',
        pkceMethod: 'S256',
        checkLoginIframe: false
      })
      .then(auth => {
        setAuthenticated(auth)

        if (auth) {
          setUser(keycloak.tokenParsed)
        }

        setLoading(false)
      })
      .catch(error => {
        console.error(error)
        setResult('Keycloak initialization failed')
        setLoading(false)
      })
  }, [])

  async function login() {
    await keycloak.login()
  }

  async function logout() {
    await keycloak.logout({
      redirectUri: window.location.origin
    })
  }

  async function callPublicApi() {
    setLoading(true)
    setResult('')

    try {
      const response = await fetch(`${API_URL}/public`)
      setResult(`HTTP ${response.status}\n\n${await response.text()}`)
    } catch (error) {
      setResult(`Request failed:\n\n${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  async function callProtectedApi() {
    setLoading(true)
    setResult('')

    try {
      if (!keycloak.authenticated) {
        setResult('Please login first.')
        return
      }

      // Refresh token if it is going to expire soon.
      await keycloak.updateToken(30)

      const response = await fetch(`${API_URL}/products`, {
        headers: {
          Authorization: `Bearer ${keycloak.token}`
        }
      })

      setResult(`HTTP ${response.status}\n\n${await response.text()}`)
    } catch (error) {
      setResult(`Request failed:\n\n${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="container"><h1>OAuth2 Demo</h1><p>Initializing...</p></div>
  }

  return (
    <div className="container">
      <h1>OAuth2 + Keycloak Demo</h1>

      <div className="flow">
        React → Keycloak → Authorization Code + PKCE → Access Token → Spring Boot
      </div>

      <div className="card">
        <h2>Authentication</h2>

        {!authenticated ? (
          <>
            <p>Not authenticated.</p>
            <button onClick={login}>Login with Keycloak</button>
          </>
        ) : (
          <>
            <p>
              Logged in as <strong>{user?.preferred_username}</strong>
            </p>

            <button onClick={logout}>Logout</button>
          </>
        )}
      </div>

      <div className="card">
        <h2>Public API</h2>
        <p>No OAuth2 token required.</p>
        <button onClick={callPublicApi} disabled={loading}>
          GET /public
        </button>
      </div>

      <div className="card">
        <h2>Protected API</h2>
        <p>Access token is sent as a Bearer token.</p>
        <button
          onClick={callProtectedApi}
          disabled={loading || !authenticated}
        >
          GET /products
        </button>
      </div>

      {result && (
        <pre className="result">{result}</pre>
      )}
    </div>
  )
}

export default App
