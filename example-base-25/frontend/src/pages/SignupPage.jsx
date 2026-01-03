import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { registerUser } from '../api/userApi'

function SignupPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [status, setStatus] = useState({ loading: false, error: '', success: '' })

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setStatus({ loading: true, error: '', success: '' })

    try {
      await registerUser(form)
      setStatus({
        loading: false,
        error: '',
        success: 'Signup successful! You can now login.',
      })
      navigate('/login')
    } catch (error) {
      setStatus({ loading: false, error: error.message, success: '' })
    }
  }

  return (
    <section className="auth-card">
      <h1>Signup</h1>
      <p className="auth-subtitle">Create your account in a few quick steps.</p>

      <form className="auth-form" onSubmit={handleSubmit}>
        <label htmlFor="signup-username">Username</label>
        <input
          id="signup-username"
          name="username"
          type="text"
          placeholder="jane_doe"
          value={form.username}
          onChange={handleChange}
          required
        />

        <label htmlFor="signup-email">Email</label>
        <input
          id="signup-email"
          name="email"
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={handleChange}
          required
        />

        <label htmlFor="signup-password">Password</label>
        <input
          id="signup-password"
          name="password"
          type="password"
          placeholder="Create password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={status.loading}>
          {status.loading ? 'Creating account...' : 'Create account'}
        </button>
      </form>

      {status.error ? <p className="auth-error">{status.error}</p> : null}
      {status.success ? <p className="auth-success">{status.success}</p> : null}

      <p className="auth-footnote">
        Already have an account? <Link to="/login">Login</Link>
      </p>
      <p className="auth-footnote">
        <Link to="/welcome">Back to welcome</Link>
      </p>
    </section>
  )
}

export default SignupPage
