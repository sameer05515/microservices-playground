import { useEffect, useState } from 'react'
import {
  createJavaService, executeJavaService, getClasses, getExecutionHistory, getJars, getJavaServices,
  getMethods, uploadJar, getDbConnections, getDbServices, getDbExecutionHistory,
  getStoredProcedureServices, getStoredProcedureHistory
} from './api'
import Connections from './Connections'
import DbServices from './DbServices'
import Services from './Services'
import History from './History'
import DbHistory from './DbHistory'
import Guide from './Guide'
import StoredProcedures from './StoredProcedures'
import StoredProcedureHistory from './StoredProcedureHistory'

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
        <span className="version">V12</span>
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
