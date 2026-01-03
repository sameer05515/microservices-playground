import { Link } from 'react-router-dom'
import { useMemo } from 'react'

function WelcomePage() {
  const token = useMemo(() => localStorage.getItem('token'), [])

  return (
    <section className="auth-card">
      <h1>Welcome</h1>
      <p className="auth-subtitle">
        Your React app now uses React Router 6 for client-side navigation.
      </p>
      <p className="auth-subtitle">
        API status: {token ? 'Logged in token found in localStorage.' : 'No token found.'}
      </p>

      <div className="welcome-actions">
        <Link className="action-link" to="/login">
          Go to Login
        </Link>
        <Link className="action-link" to="/signup">
          Go to Signup
        </Link>
      </div>
    </section>
  )
}

export default WelcomePage
