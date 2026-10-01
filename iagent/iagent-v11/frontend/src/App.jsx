import { useEffect, useState } from 'react'
import {
  createDbConnection,
  createDbService,
  createJavaService,
  executeDbService,
  getDbServiceDetails,
  testDbService,
  executeJavaService,
  getClasses,
  getDbConnections,
  getDbServices,
  getDbExecutionHistory,
  executeDbServiceRuntime,
  testStoredProcedure, createStoredProcedure, getStoredProcedureServices, executeStoredProcedure, getStoredProcedureHistory,
  getExecutionHistory,
  getJars,
  getMethods,
  getJavaServices,
  testDbConnection,
  uploadJar
} from './api'

export default function App() {
  const [page, setPage] = useState('upload')
  const [jars, setJars] = useState([])
  const [services, setServices] = useState([])
  const [history, setHistory] = useState([])
  const [dbHistory, setDbHistory] = useState([])
  const [connections, setConnections] = useState([])
  const [dbServices, setDbServices] = useState([])
  const [storedProcedures, setStoredProcedures] = useState([])
  const [spHistory, setSpHistory] = useState([])
  const [selectedJar, setSelectedJar] = useState(null)
  const [classes, setClasses] = useState([])
  const [selectedClass, setSelectedClass] = useState('')
  const [methods, setMethods] = useState([])
  const [selectedMethod, setSelectedMethod] = useState(null)
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const loadJars = async () => setJars(await getJars())
  const loadServices = async () => setServices(await getJavaServices())
  const loadHistory = async () => setHistory(await getExecutionHistory())
  const loadDbHistory = async () => setDbHistory(await getDbExecutionHistory())
  const loadConnections = async () => setConnections(await getDbConnections())
  const loadDbServices = async () => setDbServices(await getDbServices())
  const loadStoredProcedures = async () => setStoredProcedures(await getStoredProcedureServices())
  const loadSpHistory = async () => setSpHistory(await getStoredProcedureHistory())

  useEffect(() => {
    Promise.all([
      loadJars(), loadServices(), loadHistory(), loadDbHistory(), loadConnections(), loadDbServices(), loadStoredProcedures(), loadSpHistory()
    ]).catch(showError)
  }, [])

  function showError(e) {
    setError(e?.response?.data?.message || e?.message || 'Something went wrong')
  }

  async function upload() {
    if (!file) return setError('Please select a JAR file.')
    setLoading(true); setError(''); setNotice('')
    try {
      const result = await uploadJar(file)
      setNotice(`Uploaded ${result.fileName}. JAR ID: ${result.id}`)
      setFile(null)
      await loadJars()
    } catch (e) { showError(e) } finally { setLoading(false) }
  }

  async function selectJar(jar) {
    setSelectedJar(jar); setSelectedClass(''); setMethods([]); setError('')
    try { setClasses((await getClasses(jar.id)).classes || []) } catch (e) { showError(e) }
  }

  async function selectClass(name) {
    setSelectedClass(name); setMethods([]); setSelectedMethod(null)
    try { setMethods((await getMethods(selectedJar.id, name)).methods || []) } catch (e) { showError(e) }
  }

  async function createService(e) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const parameters = (selectedMethod.parameters || []).map(p => ({ name: p.name, type: p.type }))
    try {
      await createJavaService({
        serviceName: fd.get('serviceName'), description: fd.get('description'), enabled: true,
        jarId: selectedJar.id, className: selectedClass, methodName: selectedMethod.name,
        returnType: selectedMethod.returnType, parameters, httpMethod: 'POST', endpointPath: fd.get('endpointPath')
      })
      setNotice('JavaService created successfully.')
      setSelectedMethod(null); await loadServices(); setPage('services')
    } catch (e) { showError(e) }
  }

  return (
    <div className="app">
      <header className="topbar">
        <div><div className="brand">iAgent</div><div className="subtitle">Java Integration & Dynamic Service Platform</div></div>
        <span className="version">V11</span>
      </header>

      <nav className="nav">
        {[
          ['upload','Upload JAR'], ['jars','Uploaded JARs'], ['services','JavaServices'],
          ['connections','Add Connection'], ['dbservices','DbServices'], ['storedprocedures','Stored Procedures'], ['history','Java Execution History'], ['dbhistory','DbService History'], ['sphistory','SP Execution History'], ['guide','How to Invoke']
        ].map(([id,label]) => <button key={id} className={page === id ? 'active' : ''} onClick={() => setPage(id)}>{label}</button>)}
      </nav>

      <main className="container">
        {error && <div className="error">{error}<button onClick={() => setError('')}>×</button></div>}
        {notice && <div className="notice">{notice}<button onClick={() => setNotice('')}>×</button></div>}

        {page === 'upload' && <section className="card">
          <h1>Upload JAR</h1>
          <p>Upload a Java JAR. The physical file is stored on the server and metadata is stored in MongoDB.</p>
          <div className="upload-row"><input type="file" accept=".jar" onChange={e => setFile(e.target.files?.[0] || null)} /><button className="primary" disabled={!file || loading} onClick={upload}>{loading ? 'Uploading...' : 'Upload JAR'}</button></div>
          {file && <div className="muted">Selected: {file.name}</div>}
        </section>}

        {page === 'jars' && <section className="card">
          <h1>Uploaded JARs</h1><p>Select a JAR, then inspect its public classes and methods.</p>
          <div className="two-pane"><div className="list">{jars.map(jar => <button className={selectedJar?.id === jar.id ? 'item selected' : 'item'} key={jar.id} onClick={() => selectJar(jar)}><strong>{jar.fileName}</strong><small>{jar.id}</small></button>)}</div>
            <div>{!selectedJar ? <Empty text="Select a JAR." /> : <div className="three-pane"><div className="list"><h3>Public Classes</h3>{classes.map(c => <button className={selectedClass === c ? 'item selected' : 'item'} key={c} onClick={() => selectClass(c)}>{c}</button>)}</div><div className="list"><h3>Public Methods</h3>{methods.map((m,i) => <button className="item" key={m.name + i} onClick={() => setSelectedMethod(m)}><strong>{m.name}</strong><small>{m.returnType} · {m.parameters?.length || 0} params</small></button>)}</div></div>}</div>
          </div>
        </section>}

        {page === 'services' && <Services services={services} onRefresh={loadServices} onExecute={async (s,args) => {
          try { const result = await executeJavaService(s.id,args); setNotice(`Execution successful. Result: ${JSON.stringify(result.result)}`); await loadHistory() }
          catch(e) { showError(e); await loadHistory() }
        }} />}

        {page === 'connections' && <Connections connections={connections} onSaved={async () => { await loadConnections(); setNotice('Database connection saved in MongoDB.'); }} onError={showError} />}

        {page === 'storedprocedures' && <StoredProcedures connections={connections} services={storedProcedures} onSaved={async () => { await loadStoredProcedures(); setNotice('Stored Procedure service saved in MongoDB.'); }} onError={showError} />}

        {page === 'sphistory' && <StoredProcedureHistory items={spHistory} onRefresh={async () => { try { await loadSpHistory() } catch(e) { showError(e) } }} />}

        {page === 'dbservices' && <DbServices connections={connections} services={dbServices} onSaved={async () => { await loadDbServices(); setNotice('DbService saved in MongoDB.'); }} onError={showError} />}

        {page === 'history' && <History items={history} onRefresh={async () => { try { await loadHistory() } catch(e) { showError(e) } }} />}
        {page === 'dbhistory' && <DbHistory items={dbHistory} onRefresh={async () => { try { await loadDbHistory() } catch(e) { showError(e) } }} />}
        {page === 'guide' && <Guide />}
      </main>

      {selectedMethod && <div className="modal-backdrop"><form className="modal" onSubmit={createService}>
        <div className="modal-head"><div><h2>Configure JavaService</h2><p>{selectedClass}.{selectedMethod.name}()</p></div><button type="button" onClick={() => setSelectedMethod(null)}>×</button></div>
        <label>Service Name<input name="serviceName" required placeholder="calculateSum" /></label>
        <label>Endpoint Path<input name="endpointPath" required placeholder="/calculate-sum" /></label>
        <label>Description<textarea name="description" placeholder="What does this service do?" /></label>
        <div className="info-box"><b>Parameters</b>{(selectedMethod.parameters || []).length ? selectedMethod.parameters.map((p,i) => <div key={i}><code>{p.name}</code> : <code>{p.type}</code></div>) : <div className="muted">No parameters</div>}</div>
        <div className="actions"><button type="button" onClick={() => setSelectedMethod(null)}>Cancel</button><button className="primary">Create JavaService</button></div>
      </form></div>}
    </div>
  )
}

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

function Services({ services, onRefresh, onExecute }) {
  const [test, setTest] = useState(null); const [args, setArgs] = useState([])
  const open = s => { setTest(s); setArgs((s.parameters || []).map(() => '')) }
  return <section className="card"><div className="section-title"><div><h1>JavaServices</h1><p>Configured dynamic REST services.</p></div><button onClick={onRefresh}>Refresh</button></div><div className="service-grid">{services.map(s => <article className="service-card" key={s.id}><div className="service-head"><strong>{s.serviceName}</strong><span className={s.enabled ? 'badge ok' : 'badge'}>{s.enabled ? 'ENABLED' : 'DISABLED'}</span></div><div className="endpoint">POST {s.endpointPath}</div><div className="muted">{s.className}.{s.methodName}()</div><button className="primary small" onClick={() => open(s)}>Test Service</button></article>)}{!services.length && <Empty text="No JavaServices created yet." />}</div>
    {test && <div className="modal-backdrop"><div className="modal"><div className="modal-head"><div><h2>Test {test.serviceName}</h2><p>POST {test.endpointPath}</p></div><button onClick={() => setTest(null)}>×</button></div>{(test.parameters || []).map((p,i) => <label key={i}>{p.name} <small>{p.type}</small><input value={args[i] ?? ''} onChange={e => setArgs(a => a.map((x,j) => j === i ? e.target.value : x))} placeholder={p.type} /></label>)}{!test.parameters?.length && <div className="info-box">This method has no arguments.</div>}<div className="actions"><button onClick={() => setTest(null)}>Cancel</button><button className="primary" onClick={async () => { const converted=(test.parameters||[]).map((p,i)=>convertArg(args[i],p.type)); await onExecute(test,converted); setTest(null) }}>Execute</button></div></div></div>}
  </section>
}

function History({ items, onRefresh }) { return <section className="card"><div className="section-title"><div><h1>Execution History</h1><p>Request, response, failure and timing logs.</p></div><button onClick={onRefresh}>Refresh</button></div><div className="history">{items.map(x => <article className="history-row" key={x.id}><div className="service-head"><strong>{x.serviceName}</strong><span className={x.status === 'SUCCESS' ? 'badge ok' : 'badge fail'}>{x.status}</span></div><div className="muted">{x.endpointPath} · {x.className}.{x.methodName} · {x.executionTimeMs} ms · {x.executedAt ? new Date(x.executedAt).toLocaleString() : ''}</div><div className="log-grid"><div><h4>Request</h4><pre>{JSON.stringify(x.requestArguments ?? [],null,2)}</pre></div><div><h4>{x.status === 'SUCCESS' ? 'Response' : 'Error'}</h4><pre>{x.status === 'SUCCESS' ? JSON.stringify(x.response,null,2) : x.errorMessage}</pre></div></div></article>)}{!items.length && <Empty text="No executions recorded yet." />}</div></section> }

function DbHistory({ items, onRefresh }) { return <section className="card"><div className="section-title"><div><h1>DbService Execution History</h1><p>Runtime DbService request, response, status and timing logs.</p></div><button onClick={onRefresh}>Refresh</button></div><div className="history">{items.map(x => <article className="history-row" key={x.id}><div className="service-head"><strong>{x.serviceName}</strong><span className={x.status === 'SUCCESS' ? 'badge ok' : 'badge fail'}>{x.status}</span></div><div className="muted">POST /api/db-services/runtime{x.endpointPath} · {x.executionTimeMs} ms · {x.executedAt ? new Date(x.executedAt).toLocaleString() : ''}</div><div className="muted">Connection: {x.connectionName}</div><pre className="query-preview">{x.query}</pre><div className="log-grid"><div><h4>Request Parameters</h4><pre>{JSON.stringify(x.requestParameters ?? {},null,2)}</pre></div><div><h4>{x.status === 'SUCCESS' ? 'Response' : 'Error'}</h4><pre>{x.status === 'SUCCESS' ? JSON.stringify(x.response,null,2) : x.errorMessage}</pre></div></div></article>)}{!items.length && <Empty text="No DbService executions recorded yet." />}</div></section> }

function Guide() { return <section className="card guide"><h1>How to Invoke iAgent Services</h1><p>V11 supports JavaServices, DbServices and Stored Procedure Services with runtime REST endpoints and execution history.</p><h2>JavaService</h2><pre>{`POST http://localhost:8080/api/java-services/runtime/calculate-sum
Content-Type: application/json

{"arguments":[10,20]}`}</pre><h2>DbService Runtime API</h2><p>When a DbService is saved with endpoint <code>/select-query</code>, invoke it using:</p><pre>{`POST http://localhost:8080/api/db-services/runtime/select-query
Content-Type: application/json

{"status": true}`}</pre><p>The JSON keys must match the <code>#parameter#</code> placeholders in the SQL. For example:</p><pre>{`SELECT * FROM todos
WHERE completed = #status#;`}</pre><p>For a query without parameters, send an empty JSON object <code>{}</code>.</p><h2>Stored Procedure Service</h2><p>Create a Stored Procedure Service by selecting a saved database connection, procedure name, endpoint and parameters. Parameters support <code>IN</code>, <code>OUT</code> and <code>INOUT</code> modes.</p><pre>{`POST http://localhost:8080/api/stored-procedure-services/runtime/get-todos
Content-Type: application/json

{"status": true}`}</pre><p>The procedure is tested before it can be saved. For OUT/INOUT parameters, configure the SQL type such as <code>INTEGER</code>, <code>VARCHAR</code> or <code>DECIMAL</code>. Runtime executions are recorded in <b>SP Execution History</b>.</p><h2>Execution History</h2><p>Every saved DbService runtime execution is recorded in MongoDB and displayed in <b>DbService History</b>, including request parameters, query, response, status, execution time and timestamp.</p></section> }


function StoredProcedures({ connections, services, onSaved, onError }) {
  const initial={serviceName:'',endpointPath:'',connectionId:connections[0]?.id||'',procedureName:'',parameters:[],values:{}}
  const [form,setForm]=useState(initial),[testing,setTesting]=useState(false),[tested,setTested]=useState(false),[saving,setSaving]=useState(false),[testResult,setTestResult]=useState(null),[run,setRun]=useState(null),[runValues,setRunValues]=useState({}),[runResult,setRunResult]=useState(null)
  const invalidate=()=>{setTested(false);setTestResult(null)}
  const change=e=>{setForm(f=>({...f,[e.target.name]:e.target.value}));invalidate()}
  const addParam=()=>setForm(f=>({...f,parameters:[...f.parameters,{name:'',mode:'IN',sqlType:'VARCHAR'}]}))
  const updateParam=(i,k,v)=>{setForm(f=>({...f,parameters:f.parameters.map((p,j)=>j===i?{...p,[k]:v}:p)}));invalidate()}
  const removeParam=i=>{setForm(f=>({...f,parameters:f.parameters.filter((_,j)=>j!==i)}));invalidate()}
  async function test(){setTesting(true);setTestResult(null);try{const r=await testStoredProcedure({connectionId:form.connectionId,procedureName:form.procedureName,parameters:form.parameters,values:form.values});setTestResult(r);setTested(true)}catch(e){setTested(false);onError(e)}finally{setTesting(false)}}
  async function save(e){e.preventDefault();setSaving(true);try{await createStoredProcedure({...form,enabled:true});setForm({...initial,connectionId:connections[0]?.id||''});setTested(false);setTestResult(null);await onSaved()}catch(e){onError(e)}finally{setSaving(false)}}
  return <section className="card"><div className="section-title"><div><h1>Stored Procedure Services</h1><p>Expose database stored procedures as reusable REST services.</p></div></div>
    <form className="form-grid" onSubmit={save}>
      <label>Service Name<input name="serviceName" value={form.serviceName} onChange={change} required placeholder="get-todos" /></label>
      <label>Endpoint Path<input name="endpointPath" value={form.endpointPath} onChange={change} required placeholder="/get-todos" /></label>
      <label>Connection<select name="connectionId" value={form.connectionId} onChange={change} required>{connections.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
      <label>Procedure Name<input name="procedureName" value={form.procedureName} onChange={change} required placeholder="get_todos" /></label>
      <div className="info-box"><b>Parameters</b><p className="muted">Use IN for input, OUT for output and INOUT for both.</p>{form.parameters.map((p,i)=><div className="param-row" key={i}><input value={p.name} onChange={e=>updateParam(i,'name',e.target.value)} placeholder="parameter name"/><select value={p.mode} onChange={e=>updateParam(i,'mode',e.target.value)}><option>IN</option><option>OUT</option><option>INOUT</option></select><input value={p.sqlType} onChange={e=>updateParam(i,'sqlType',e.target.value.toUpperCase())} placeholder="VARCHAR"/><button type="button" onClick={()=>removeParam(i)}>Remove</button></div>)}<button type="button" onClick={addParam}>+ Add Parameter</button></div>
      {form.parameters.some(p=>p.mode==='IN'||p.mode==='INOUT') && <div className="info-box"><b>Test Values</b>{form.parameters.filter(p=>p.mode==='IN'||p.mode==='INOUT').map(p=><label key={p.name}>{p.name}<input value={form.values[p.name]??''} onChange={e=>setForm(f=>({...f,values:{...f.values,[p.name]:e.target.value}}))}/></label>)}</div>}
      <div className="actions"><button type="button" onClick={test} disabled={testing||!form.connectionId}>{testing?'Testing Procedure...':'Test Service'}</button><button className="primary" disabled={saving||!tested} type="submit">{saving?'Saving...':'Save Stored Procedure'}</button></div>
      {testResult&&<div className="success-box">✓ Procedure executed successfully in {testResult.executionTimeMs} ms.{testResult.output&&<pre>{JSON.stringify(testResult.output,null,2)}</pre>}</div>}
    </form>
    <h2 className="subheading">Saved Stored Procedure Services</h2><div className="service-grid">{services.map(s=><article className="service-card" key={s.id}><div className="service-head"><strong>{s.serviceName}</strong><span className="badge ok">{s.enabled?'ENABLED':'DISABLED'}</span></div><div className="muted">Connection: {s.connectionName}</div><div className="muted">Procedure: {s.procedureName}</div><div className="endpoint">POST http://localhost:8080/api/stored-procedure-services/runtime{s.endpointPath}</div><div className="actions"><button className="primary small" disabled={!s.enabled} onClick={()=>{setRun(s);setRunValues({});setRunResult(null)}}>Run Procedure</button></div></article>)}{!services.length&&<Empty text="No Stored Procedure Services created yet."/>}</div>
    {run&&<div className="modal-backdrop"><div className="modal"><div className="modal-head"><div><h2>Run {run.serviceName}</h2><p>{run.procedureName}</p></div><button onClick={()=>setRun(null)}>×</button></div>{(run.parameters||[]).filter(p=>p.mode==='IN'||p.mode==='INOUT').map(p=><label key={p.name}>{p.name} ({p.mode})<input value={runValues[p.name]??''} onChange={e=>setRunValues(v=>({...v,[p.name]:e.target.value}))}/></label>)}<div className="actions"><button onClick={()=>setRun(null)}>Cancel</button><button className="primary" onClick={async()=>{try{const r=await executeStoredProcedure(run.id,runValues);setRunResult(r);setRun(null)}catch(e){onError(e)}}}>Execute</button></div></div></div>}
  {runResult&&<div className="result-box"><div className="section-title"><h2>Procedure Result</h2><button onClick={()=>setRunResult(null)}>Close</button></div><pre>{JSON.stringify(runResult.output,null,2)}</pre></div>}</section>
}
function StoredProcedureHistory({items,onRefresh}){return <section className="card"><div className="section-title"><div><h1>Stored Procedure Execution History</h1><p>Runtime stored procedure requests, outputs, status and timing.</p></div><button onClick={onRefresh}>Refresh</button></div><div className="history">{items.map(x=><article className="history-row" key={x.id}><div className="service-head"><strong>{x.serviceName}</strong><span className={x.status==='SUCCESS'?'badge ok':'badge fail'}>{x.status}</span></div><div className="muted">POST /api/stored-procedure-services/runtime{x.endpointPath} · {x.executionTimeMs} ms · {x.executedAt?new Date(x.executedAt).toLocaleString():''}</div><div className="muted">Connection: {x.connectionName} · Procedure: {x.procedureName}</div><div className="log-grid"><div><h4>Request</h4><pre>{JSON.stringify(x.requestParameters??{},null,2)}</pre></div><div><h4>{x.status==='SUCCESS'?'Output':'Error'}</h4><pre>{x.status==='SUCCESS'?JSON.stringify(x.response,null,2):x.errorMessage}</pre></div></div></article>)}{!items.length&&<Empty text="No Stored Procedure executions recorded yet."/>}</div></section>}

function Empty({ text }) { return <div className="empty">{text}</div> }
function formatCell(value) { if (value === null || value === undefined) return 'NULL'; if (typeof value === 'object') return JSON.stringify(value); return String(value) }
function convertArg(value,type) { if (type === 'int' || type === 'java.lang.Integer') return Number.parseInt(value,10); if (type === 'long' || type === 'java.lang.Long') return Number.parseInt(value,10); if (type === 'double' || type === 'java.lang.Double') return Number.parseFloat(value); if (type === 'float' || type === 'java.lang.Float') return Number.parseFloat(value); if (type === 'boolean' || type === 'java.lang.Boolean') return value === 'true'; if (type === 'short' || type === 'java.lang.Short') return Number.parseInt(value,10); if (type === 'byte' || type === 'java.lang.Byte') return Number.parseInt(value,10); if (type === 'char' || type === 'java.lang.Character') return value?.[0] || ''; if (type !== 'java.lang.String' && type !== 'String' && value?.trim()?.startsWith('{')) { try { return JSON.parse(value) } catch { return value } } return value }
