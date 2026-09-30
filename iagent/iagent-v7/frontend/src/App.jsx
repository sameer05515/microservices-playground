import { useEffect, useState } from 'react'
import {
  createJavaService,
  executeJavaService,
  getClasses,
  getExecutionHistory,
  getJars,
  getMethods,
  getJavaServices,
  uploadJar
} from './api'

export default function App() {
  const [page, setPage] = useState('upload')
  const [jars, setJars] = useState([])
  const [services, setServices] = useState([])
  const [history, setHistory] = useState([])
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

  useEffect(() => {
    loadJars().catch(showError)
    loadServices().catch(showError)
    loadHistory().catch(showError)
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
    setSelectedJar(jar); setSelectedClass(''); setMethods([])
    setError('')
    try { setClasses((await getClasses(jar.id)).classes || []) }
    catch (e) { showError(e) }
  }

  async function selectClass(name) {
    setSelectedClass(name); setMethods([]); setSelectedMethod(null)
    try { setMethods((await getMethods(selectedJar.id, name)).methods || []) }
    catch (e) { showError(e) }
  }

  async function createService(e) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const parameters = (selectedMethod.parameters || []).map(p => ({
      name: p.name, type: p.type
    }))
    try {
      await createJavaService({
        serviceName: fd.get('serviceName'),
        description: fd.get('description'),
        enabled: true,
        jarId: selectedJar.id,
        className: selectedClass,
        methodName: selectedMethod.name,
        returnType: selectedMethod.returnType,
        parameters,
        httpMethod: 'POST',
        endpointPath: fd.get('endpointPath')
      })
      setNotice('JavaService created successfully.')
      setSelectedMethod(null)
      await loadServices()
      setPage('services')
    } catch (e) { showError(e) }
  }

  return (
    <div className="app">
      <header className="topbar">
        <div>
          <div className="brand">iAgent</div>
          <div className="subtitle">Java Integration & Dynamic Service Platform</div>
        </div>
        <span className="version">V7</span>
      </header>

      <nav className="nav">
        {[
          ['upload','Upload JAR'],
          ['jars','Uploaded JARs'],
          ['services','JavaServices'],
          ['history','Execution History'],
          ['guide','How to Invoke']
        ].map(([id,label]) =>
          <button key={id} className={page === id ? 'active' : ''} onClick={() => setPage(id)}>
            {label}
          </button>
        )}
      </nav>

      <main className="container">
        {error && <div className="error">{error}<button onClick={() => setError('')}>×</button></div>}
        {notice && <div className="notice">{notice}<button onClick={() => setNotice('')}>×</button></div>}

        {page === 'upload' && (
          <section className="card">
            <h1>Upload JAR</h1>
            <p>Upload a Java JAR. The physical file is stored on the server and metadata is stored in MongoDB.</p>
            <div className="upload-row">
              <input type="file" accept=".jar" onChange={e => setFile(e.target.files?.[0] || null)} />
              <button className="primary" disabled={!file || loading} onClick={upload}>
                {loading ? 'Uploading...' : 'Upload JAR'}
              </button>
            </div>
            {file && <div className="muted">Selected: {file.name}</div>}
          </section>
        )}

        {page === 'jars' && (
          <section className="card">
            <h1>Uploaded JARs</h1>
            <p>Select a JAR, then inspect its public classes and methods.</p>
            <div className="two-pane">
              <div className="list">
                {jars.map(jar =>
                  <button className={selectedJar?.id === jar.id ? 'item selected' : 'item'} key={jar.id} onClick={() => selectJar(jar)}>
                    <strong>{jar.fileName}</strong><small>{jar.id}</small>
                  </button>
                )}
              </div>
              <div>
                {!selectedJar ? <Empty text="Select a JAR." /> :
                  <div className="three-pane">
                    <div className="list">
                      <h3>Public Classes</h3>
                      {classes.map(c => <button className={selectedClass === c ? 'item selected' : 'item'} key={c} onClick={() => selectClass(c)}>{c}</button>)}
                    </div>
                    <div className="list">
                      <h3>Public Methods</h3>
                      {methods.map((m,i) =>
                        <button className="item" key={m.name + i} onClick={() => setSelectedMethod(m)}>
                          <strong>{m.name}</strong><small>{m.returnType} · {m.parameters?.length || 0} params</small>
                        </button>
                      )}
                    </div>
                  </div>}
              </div>
            </div>
          </section>
        )}

        {page === 'services' && (
          <Services services={services} onRefresh={loadServices} onExecute={async (s,args) => {
            try {
              const result = await executeJavaService(s.id,args)
              setNotice(`Execution successful. Result: ${JSON.stringify(result.result)}`)
              await loadHistory()
            } catch(e) { showError(e); await loadHistory() }
          }} />
        )}

        {page === 'history' && (
          <History items={history} onRefresh={async () => {
            try { await loadHistory() } catch(e) { showError(e) }
          }} />
        )}

        {page === 'guide' && <Guide />}
      </main>

      {selectedMethod && (
        <div className="modal-backdrop">
          <form className="modal" onSubmit={createService}>
            <div className="modal-head">
              <div><h2>Configure JavaService</h2><p>{selectedClass}.{selectedMethod.name}()</p></div>
              <button type="button" onClick={() => setSelectedMethod(null)}>×</button>
            </div>
            <label>Service Name<input name="serviceName" required placeholder="calculateSum" /></label>
            <label>Endpoint Path<input name="endpointPath" required placeholder="/calculate-sum" /></label>
            <label>Description<textarea name="description" placeholder="What does this service do?" /></label>
            <div className="info-box">
              <b>Parameters</b>
              {(selectedMethod.parameters || []).length
                ? selectedMethod.parameters.map((p,i) => <div key={i}><code>{p.name}</code> : <code>{p.type}</code></div>)
                : <div className="muted">No parameters</div>}
            </div>
            <div className="actions">
              <button type="button" onClick={() => setSelectedMethod(null)}>Cancel</button>
              <button className="primary">Create JavaService</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

function Services({ services, onRefresh, onExecute }) {
  const [test, setTest] = useState(null)
  const [args, setArgs] = useState([])
  const open = s => { setTest(s); setArgs((s.parameters || []).map(() => '')) }

  return <section className="card">
    <div className="section-title"><div><h1>JavaServices</h1><p>Configured dynamic REST services.</p></div><button onClick={onRefresh}>Refresh</button></div>
    <div className="service-grid">
      {services.map(s => <article className="service-card" key={s.id}>
        <div className="service-head"><strong>{s.serviceName}</strong><span className={s.enabled ? 'badge ok' : 'badge'}>{s.enabled ? 'ENABLED' : 'DISABLED'}</span></div>
        <div className="endpoint">POST {s.endpointPath}</div>
        <div className="muted">{s.className}.{s.methodName}()</div>
        <button className="primary small" onClick={() => open(s)}>Test Service</button>
      </article>)}
      {!services.length && <Empty text="No JavaServices created yet." />}
    </div>

    {test && <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-head"><div><h2>Test {test.serviceName}</h2><p>POST {test.endpointPath}</p></div><button onClick={() => setTest(null)}>×</button></div>
        {(test.parameters || []).map((p,i) =>
          <label key={i}>{p.name} <small>{p.type}</small>
            <input value={args[i] ?? ''} onChange={e => setArgs(a => a.map((x,j) => j === i ? e.target.value : x))} placeholder={p.type} />
          </label>
        )}
        {!test.parameters?.length && <div className="info-box">This method has no arguments.</div>}
        <div className="actions"><button onClick={() => setTest(null)}>Cancel</button><button className="primary" onClick={async () => {
          const converted = (test.parameters || []).map((p,i) => convertArg(args[i],p.type))
          await onExecute(test,converted); setTest(null)
        }}>Execute</button></div>
      </div>
    </div>}
  </section>
}

function History({ items, onRefresh }) {
  return <section className="card">
    <div className="section-title"><div><h1>Execution History</h1><p>Request, response, failure and timing logs.</p></div><button onClick={onRefresh}>Refresh</button></div>
    <div className="history">
      {items.map(x => <article className="history-row" key={x.id}>
        <div className="service-head"><strong>{x.serviceName}</strong><span className={x.status === 'SUCCESS' ? 'badge ok' : 'badge fail'}>{x.status}</span></div>
        <div className="muted">{x.endpointPath} · {x.className}.{x.methodName} · {x.executionTimeMs} ms · {x.executedAt ? new Date(x.executedAt).toLocaleString() : ''}</div>
        <div className="log-grid"><div><h4>Request</h4><pre>{JSON.stringify(x.requestArguments ?? [],null,2)}</pre></div><div><h4>{x.status === 'SUCCESS' ? 'Response' : 'Error'}</h4><pre>{x.status === 'SUCCESS' ? JSON.stringify(x.response,null,2) : x.errorMessage}</pre></div></div>
      </article>)}
      {!items.length && <Empty text="No executions recorded yet." />}
    </div>
  </section>
}

function Guide() {
  return <section className="card guide">
    <h1>How to Invoke a Dynamic Endpoint</h1>
    <p>Every enabled JavaService exposes a runtime endpoint based on its configured endpoint path.</p>
    <h2>1. Find the endpoint</h2>
    <p>Open <b>JavaServices</b> and copy the endpoint shown on the service card.</p>
    <h2>2. Prepare the request</h2>
    <pre>{`POST http://localhost:8080/api/java-services/runtime/calculate-sum
Content-Type: application/json

{
  "arguments": [10, 20]
}`}</pre>
    <h2>3. cURL</h2>
    <pre>{`curl -X POST http://localhost:8080/api/java-services/runtime/calculate-sum \
  -H "Content-Type: application/json" \
  -d '{"arguments":[10,20]}'`}</pre>
    <h2>4. Argument order</h2>
    <p><code>arguments[0]</code> maps to the first Java method parameter, <code>arguments[1]</code> to the second, and so on.</p>
    <h2>5. Review execution</h2>
    <p>Use <b>Execution History</b> to inspect the request, response/error, execution time and timestamp.</p>
  </section>
}

function Empty({ text }) { return <div className="empty">{text}</div> }

function convertArg(value,type) {
  if (type === 'int' || type === 'java.lang.Integer') return Number.parseInt(value,10)
  if (type === 'long' || type === 'java.lang.Long') return Number.parseInt(value,10)
  if (type === 'double' || type === 'java.lang.Double') return Number.parseFloat(value)
  if (type === 'float' || type === 'java.lang.Float') return Number.parseFloat(value)
  if (type === 'boolean' || type === 'java.lang.Boolean') return value === 'true'
  if (type === 'short' || type === 'java.lang.Short') return Number.parseInt(value,10)
  if (type === 'byte' || type === 'java.lang.Byte') return Number.parseInt(value,10)
  if (type === 'char' || type === 'java.lang.Character') return value?.[0] || ''
  if (type !== 'java.lang.String' && type !== 'String' && value?.trim()?.startsWith('{')) {
    try { return JSON.parse(value) } catch { return value }
  }
  return value
}
