import { useState } from 'react'
import { createDbConnection, testDbConnection } from './api'
import Empty from './Empty'

function Connections({ connections, onSaved, onError }) {
  const initial = { name: '', jdbcUrl: '', username: '', password: '' }
  const [form, setForm] = useState(initial)
  const [testing, setTesting] = useState(false)
  const [saving, setSaving] = useState(false)
  const [tested, setTested] = useState(false)
  const [status, setStatus] = useState('')

  const change = e => { setForm(f => ({ ...f, [e.target.name]: e.target.value })); setTested(false); setStatus('') }

  async function test() {
    setTesting(true); setStatus('')
    try { const r = await testDbConnection(form); setTested(true); setStatus(r.message || 'Connection successful.') }
    catch(e) { setTested(false); onError(e) } finally { setTesting(false) }
  }

  async function save(e) {
    e.preventDefault()
    setSaving(true)
    try { await createDbConnection(form); setForm(initial); setTested(false); setStatus(''); await onSaved() }
    catch(e) { onError(e) } finally { setSaving(false) }
  }

  return <section className="card">
    <h1>Add Connection</h1>
    <p>Add a target database using a JDBC URL. The connection is tested before it is saved to MongoDB.</p>
    <form className="form-grid" onSubmit={save}>
      <label>Connection Name<input name="name" value={form.name} onChange={change} required placeholder="customer-db" /></label>
      <label>JDBC URL<input name="jdbcUrl" value={form.jdbcUrl} onChange={change} required placeholder="jdbc:mysql://localhost:3306/customerdb" /></label>
      <label>Username<input name="username" value={form.username} onChange={change} required placeholder="root" /></label>
      <label>Password<input type="password" name="password" value={form.password} onChange={change} required placeholder="••••••••" /></label>
      <div className="actions"><button type="button" onClick={test} disabled={testing}>{testing ? 'Testing...' : 'Test Connection'}</button><button className="primary" disabled={saving || !tested}>{saving ? 'Saving...' : 'Save Connection'}</button></div>
    </form>
    {status && <div className="success-box">✓ {status}</div>}
    <h2 className="subheading">Saved Connections</h2>
    <div className="service-grid">{connections.map(c => <article className="service-card" key={c.id}><div className="service-head"><strong>{c.name}</strong><span className="badge ok">SAVED</span></div><div className="endpoint">{c.jdbcUrl}</div><div className="muted">User: {c.username}</div></article>)}{!connections.length && <Empty text="No database connections saved yet." />}</div>
  </section>
}

export default Connections
