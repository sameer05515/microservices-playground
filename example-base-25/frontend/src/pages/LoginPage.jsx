import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginUser, saveAuthToken } from '../api/userApi'

function LoginPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })
  const [status, setStatus] = useState({ loading: false, error: '', success: '' })

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setStatus({ loading: true, error: '', success: '' })

    try {
      const result = await loginUser(form)
      if (result?.token) {
        saveAuthToken(result.token)
      }

      setStatus({ loading: false, error: '', success: 'Login successful!' })
      navigate('/welcome')
    } catch (error) {
      setStatus({ loading: false, error: error.message, success: '' })
    }
  }

  return (
    <section className="auth-card">
      <h1>Login</h1>
      <p className="auth-subtitle">Sign in to continue to your dashboard.</p>

      <form className="auth-form" onSubmit={handleSubmit}>
        <label htmlFor="login-username">Username</label>
        <input
          id="login-username"
          name="username"
          type="text"
          placeholder="Enter username"
          value={form.username}
          onChange={handleChange}
          required
        />

        <label htmlFor="login-password">Password</label>
        <input
          id="login-password"
          name="password"
          type="password"
          placeholder="Enter password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={status.loading}>
          {status.loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      {status.error ? <p className="auth-error">{status.error}</p> : null}
      {status.success ? <p className="auth-success">{status.success}</p> : null}

      <p className="auth-footnote">
        Need an account? <Link to="/signup">Create one</Link>
      </p>
      <p className="auth-footnote">
        <Link to="/welcome">Back to welcome</Link>
      </p>
    </section>
  )
}

export default LoginPage
