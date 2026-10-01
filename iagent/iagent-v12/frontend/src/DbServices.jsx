import { useState } from 'react'
import { createDbService, executeDbService, getDbServiceDetails, testDbService } from './api'
import Empty from './Empty'
import { formatCell } from './utils'

function DbServices({ connections, services, onSaved, onError }) {
  const [form, setForm] = useState({ serviceName: '', connectionId: '', endpointPath: '', query: '' })
  const [parameters, setParameters] = useState([])
  const [testValues, setTestValues] = useState({})
  const [testing, setTesting] = useState(false)
  const [tested, setTested] = useState(false)
  const [testResult, setTestResult] = useState(null)
  const [saving, setSaving] = useState(false)
  const [running, setRunning] = useState(null)
  const [runValues, setRunValues] = useState({})
  const [result, setResult] = useState(null)
  const [details, setDetails] = useState(null)

  function extractParameters(query) {
    const found = []
    const seen = new Set()
    const regex = /#([A-Za-z_][A-Za-z0-9_]*)#/g
    let match
    while ((match = regex.exec(query || '')) !== null) {
      if (!seen.has(match[1])) {
        seen.add(match[1])
        found.push(match[1])
      }
    }
    return found
  }

  function changeQuery(value) {
    const names = extractParameters(value)
    const nextValues = {}
    names.forEach(name => { nextValues[name] = testValues[name] ?? '' })
    setForm(f => ({ ...f, query: value }))
    setParameters(names)
    setTestValues(nextValues)
    setTested(false)
    setTestResult(null)
  }

  function changeForm(field, value) {
    setForm(f => ({ ...f, [field]: value }))
    setTested(false)
    setTestResult(null)
    if (field === 'connectionId') setRunValues({})
  }

  async function testService() {
    if (!form.connectionId || !form.query.trim()) {
      return onError(new Error('Please select a connection and enter a query.'))
    }
    setTesting(true); setTested(false); setTestResult(null)
    try {
      const r = await testDbService({
        connectionId: form.connectionId,
        query: form.query,
        parameters: testValues
      })
      setTested(true)
      setTestResult(r)
    } catch (e) {
      setTested(false)
      onError(e)
    } finally { setTesting(false) }
  }

  async function save(e) {
    e.preventDefault()
    if (!tested) return
    setSaving(true)
    try {
      await createDbService({
        ...form,
        enabled: true,
        parameters: testValues
      })
      setForm({ serviceName: '', connectionId: '', endpointPath: '', query: '' })
      setParameters([]); setTestValues({}); setTested(false); setTestResult(null)
      await onSaved()
    } catch(e) { onError(e) } finally { setSaving(false) }
  }

  function openRun(service) {
    const values = {}
    ;(service.parameterNames || []).forEach(name => { values[name] = '' })
    setRunValues(values)
    setRunning(service)
    setResult(null)
  }

  async function runConfirmed() {
    if (!running) return
    try {
      setResult(await executeDbService(running.id, runValues))
    } catch(e) { onError(e) }
  }

  async function showDetails(service) {
    try { setDetails(await getDbServiceDetails(service.id)) }
    catch(e) { onError(e) }
  }

  return <section className="card">
    <div className="section-title">
      <div><h1>DbServices</h1><p>Test SQL against a configured database before saving it as a reusable DbService.</p></div>
    </div>

    {!connections.length && <div className="info-box">Please add and successfully test a database connection before creating a DbService.</div>}

    <form className="db-form" onSubmit={save}>
      <label>DbService Name
        <input value={form.serviceName} onChange={e => changeForm('serviceName', e.target.value)} required placeholder="find-todos" />
      </label>
      <label>Runtime Endpoint Path
        <input value={form.endpointPath} onChange={e => changeForm('endpointPath', e.target.value)} required placeholder="/select-query" />
      </label>
      <label>Connection
        <select value={form.connectionId} onChange={e => changeForm('connectionId', e.target.value)} required>
          <option value="">Select connection</option>
          {connections.map(c => <option key={c.id} value={c.id}>{c.name} — {c.jdbcUrl}</option>)}
        </select>
      </label>
      <label>SQL Query
        <textarea className="query-input" value={form.query} onChange={e => changeQuery(e.target.value)} required
          placeholder={'SELECT * FROM todos WHERE completed = #status#;'} />
      </label>

      {parameters.length > 0 && <div className="parameter-box">
        <h3>Query Parameters</h3>
        <p className="muted">Use <code>#name#</code> in SQL. Values below are used only for Test Service and are not stored.</p>
        <div className="parameter-grid">
          {parameters.map(name => <label key={name}>{name}
            <input value={testValues[name] ?? ''} onChange={e => {
              setTestValues(v => ({ ...v, [name]: e.target.value }))
              setTested(false); setTestResult(null)
            }} placeholder={`Value for #${name}#`} />
          </label>)}
        </div>
      </div>}

      <div className="actions">
        <button type="button" onClick={testService} disabled={testing || !connections.length}>
          {testing ? 'Testing Service...' : 'Test Service'}
        </button>
        <button type="submit" className="primary" disabled={saving || !tested}>
          {saving ? 'Saving...' : 'Save DbService'}
        </button>
      </div>

      {testResult && <div className="success-box">
        ✓ Test Service successful — {testResult.rowCount} row(s), {testResult.executionTimeMs} ms.
      </div>}
    </form>

    <h2 className="subheading">Saved DbServices</h2>
    <div className="service-grid">
      {services.map(s => <article className="service-card" key={s.id}>
        <div className="service-head"><strong>{s.serviceName}</strong><span className={s.enabled ? 'badge ok' : 'badge'}>{s.enabled ? 'ENABLED' : 'DISABLED'}</span></div>
        <div className="muted">Connection: {s.connectionName || s.connectionId}</div>
        <div className="endpoint">POST http://localhost:8080/api/db-services/runtime{ s.endpointPath }</div>
        <pre className="query-preview">{s.query}</pre>
        {s.parameterNames?.length > 0 && <div className="muted">Parameters: {s.parameterNames.map(p => `#${p}#`).join(', ')}</div>}
        <div className="actions">
          <button onClick={() => showDetails(s)}>Details</button>
          <button className="primary small" disabled={!s.enabled} onClick={() => openRun(s)}>Run Query</button>
        </div>
      </article>)}
      {!services.length && <Empty text="No DbServices created yet." />}
    </div>

    {running && <div className="modal-backdrop"><div className="modal">
      <div className="modal-head"><div><h2>Run {running.serviceName}</h2><p>Enter values for the query parameters.</p></div><button onClick={() => setRunning(null)}>×</button></div>
      {(running.parameterNames || []).map(name => <label key={name}>{name}
        <input value={runValues[name] ?? ''} onChange={e => setRunValues(v => ({ ...v, [name]: e.target.value }))} placeholder={`Value for #${name}#`} />
      </label>)}
      {!running.parameterNames?.length && <div className="info-box">This query has no parameters.</div>}
      <div className="actions"><button onClick={() => setRunning(null)}>Cancel</button><button className="primary" onClick={runConfirmed}>Run Query</button></div>
    </div></div>}

    {details && <div className="modal-backdrop"><div className="modal">
      <div className="modal-head"><div><h2>{details.serviceName}</h2><p>DbService Details</p></div><button onClick={() => setDetails(null)}>×</button></div>
      <div className="info-box"><b>Connection</b><div>{details.connectionName}</div></div>
      <label>Query<textarea className="query-input" value={details.query} readOnly /></label>
      {details.parameterNames?.length > 0 && <div className="info-box"><b>Parameters</b><div>{details.parameterNames.map(p => <code key={p} className="param-chip">#{p}#</code>)}</div></div>}
      <div className="actions"><button onClick={() => setDetails(null)}>Close</button></div>
    </div></div>}

    {result && <div className="result-box"><div className="section-title"><div><h2>Query Result</h2><div className="muted">{result.serviceName} · {result.executionTimeMs} ms · {result.rowCount} row(s)</div></div><button onClick={() => setResult(null)}>Close</button></div>{result.resultSet ? <div className="table-wrap"><table><thead><tr>{result.columns.map(c => <th key={c}>{c}</th>)}</tr></thead><tbody>{result.rows.map((row,i) => <tr key={i}>{row.map((v,j) => <td key={j}>{formatCell(v)}</td>)}</tr>)}</tbody></table></div> : <div className="success-box">Query executed successfully. Update count: {result.updateCount}</div>}</div>}
  </section>
}

export default DbServices
