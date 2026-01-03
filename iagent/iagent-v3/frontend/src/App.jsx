import { useEffect, useState } from 'react'
import {
  createJavaService,
  getAllJars,
  getAllJavaServices,
  getPublicClasses,
  getPublicMethods,
  uploadJar
} from './api'

function App() {
  const [page, setPage] = useState('upload')

  return (
    <div className="app">
      <header className="topbar">
        <div>
          <div className="brand">iAgent</div>
          <div className="subtitle">Java Service Integration Platform</div>
        </div>
        <nav className="nav">
          <button className={page === 'upload' ? 'nav-button active' : 'nav-button'} onClick={() => setPage('upload')}>Upload JAR</button>
          <button className={page === 'jars' ? 'nav-button active' : 'nav-button'} onClick={() => setPage('jars')}>Uploaded JARs</button>
          <button className={page === 'services' ? 'nav-button active' : 'nav-button'} onClick={() => setPage('services')}>JavaServices</button>
        </nav>
        <div className="version">V3</div>
      </header>
      <main className="container">
        {page === 'upload' && <UploadPage onUploaded={() => setPage('jars')} />}
        {page === 'jars' && <UploadedJarsPage />}
        {page === 'services' && <JavaServicesPage />}
      </main>
    </div>
  )
}

function UploadPage({ onUploaded }) {
  const [file, setFile] = useState(null)
  const [uploadedJar, setUploadedJar] = useState(null)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')

  function handleFileChange(event) {
    setError(''); setUploadedJar(null)
    const selected = event.target.files?.[0]
    if (!selected) { setFile(null); return }
    if (!selected.name.toLowerCase().endsWith('.jar')) { setFile(null); setError('Please select a .jar file.'); return }
    setFile(selected)
  }

  async function handleUpload() {
    if (!file) { setError('Please select a JAR file first.'); return }
    setError(''); setLoading(true); setProgress(0); setUploadedJar(null)
    try {
      const result = await uploadJar(file, event => {
        if (event.total) setProgress(Math.round((event.loaded / event.total) * 100))
      })
      setUploadedJar(result)
    } catch (err) { setError(extractError(err)) }
    finally { setLoading(false) }
  }

  return (
    <section className="card upload-page">
      <div className="page-heading"><div><h1>Upload JAR</h1><p>Upload a Java JAR and inspect its public classes and methods.</p></div></div>
      <div className="upload-box">
        <label className="file-picker large"><span>Select JAR File</span><input type="file" accept=".jar,application/java-archive" onChange={handleFileChange} /></label>
        {file && <div className="selected-file-box"><strong>{file.name}</strong><span>{formatBytes(file.size)}</span></div>}
        <button className="primary-button" disabled={!file || loading} onClick={handleUpload}>{loading ? 'Uploading...' : 'Upload JAR'}</button>
      </div>
      {loading && <div className="progress-area"><div className="progress-track"><div className="progress-bar" style={{ width: `${progress}%` }} /></div><span>{progress}%</span></div>}
      {error && <div className="error">{error}</div>}
      {uploadedJar && <div className="success"><strong>JAR uploaded successfully.</strong><div className="success-details"><span>{uploadedJar.fileName}</span><code>{uploadedJar.id}</code></div><button className="secondary-button" onClick={onUploaded}>View Uploaded JARs</button></div>}
    </section>
  )
}

function UploadedJarsPage() {
  const [jars, setJars] = useState([])
  const [selectedJar, setSelectedJar] = useState(null)
  const [classes, setClasses] = useState([])
  const [selectedClass, setSelectedClass] = useState('')
  const [methods, setMethods] = useState([])
  const [selectedMethod, setSelectedMethod] = useState(null)
  const [loadingJars, setLoadingJars] = useState(true)
  const [loadingClasses, setLoadingClasses] = useState(false)
  const [loadingMethods, setLoadingMethods] = useState(false)
  const [error, setError] = useState('')

  async function loadJars() {
    setLoadingJars(true); setError('')
    try { setJars((await getAllJars()) || []) } catch (err) { setError(extractError(err)) } finally { setLoadingJars(false) }
  }

  useEffect(() => { loadJars() }, [])

  async function handleJarSelect(jar) {
    setSelectedJar(jar); setSelectedClass(''); setClasses([]); setMethods([]); setSelectedMethod(null); setLoadingClasses(true); setError('')
    try { setClasses((await getPublicClasses(jar.id)).classes || []) } catch (err) { setError(extractError(err)) } finally { setLoadingClasses(false) }
  }

  async function handleClassSelect(className) {
    if (!selectedJar) return
    setSelectedClass(className); setMethods([]); setSelectedMethod(null); setLoadingMethods(true); setError('')
    try { setMethods((await getPublicMethods(selectedJar.id, className)).methods || []) } catch (err) { setError(extractError(err)) } finally { setLoadingMethods(false) }
  }

  return (
    <section>
      <div className="page-heading"><div><h1>Uploaded JARs</h1><p>Select a JAR → class → method to create a JavaService.</p></div><button className="secondary-button" onClick={loadJars}>Refresh</button></div>
      {error && <div className="error page-error">{error}</div>}
      <div className="browser-grid">
        <section className="card browser-panel"><PanelHeader title="JAR Files" subtitle={`${jars.length} uploaded JAR(s)`} loading={loadingJars} /><div className="list">{!loadingJars && jars.length === 0 ? <Empty text="No JAR files have been uploaded yet." /> : jars.map(jar => <button key={jar.id} className={`list-item ${selectedJar?.id === jar.id ? 'selected' : ''}`} onClick={() => handleJarSelect(jar)}><span className="file-icon">JAR</span><span className="item-content"><strong>{jar.fileName}</strong><small>{formatBytes(jar.size)}</small></span></button>)}</div></section>
        <section className="card browser-panel"><PanelHeader title="Public Classes" subtitle={selectedJar ? selectedJar.fileName : 'Select a JAR file'} loading={loadingClasses} />{!selectedJar ? <Empty text="Click a JAR file to view its public classes." /> : <div className="list">{!loadingClasses && classes.length === 0 ? <Empty text="No public classes found." /> : classes.map(className => <button key={className} className={`list-item ${selectedClass === className ? 'selected' : ''}`} onClick={() => handleClassSelect(className)}><span className="class-icon">C</span><span className="item-content"><strong>{className}</strong></span></button>)}</div>}</section>
        <section className="card browser-panel methods-panel"><PanelHeader title="Public Methods" subtitle={selectedClass || 'Select a public class'} loading={loadingMethods} />{!selectedClass ? <Empty text="Click a class to view its public methods." /> : <div className="methods-list">{!loadingMethods && methods.length === 0 ? <Empty text="No public methods found." /> : methods.map((method, index) => <MethodCard key={`${method.name}-${index}`} method={method} onSelect={() => setSelectedMethod(method)} />)}</div>}</section>
      </div>
      {selectedMethod && <JavaServiceModal jar={selectedJar} className={selectedClass} method={selectedMethod} onClose={() => setSelectedMethod(null)} onCreated={() => setSelectedMethod(null)} />}
    </section>
  )
}

function MethodCard({ method, onSelect }) {
  return <button className="method-card method-select-button" onClick={onSelect} title="Configure JavaService">
    <div className="method-name"><span className="method-icon">ƒ</span><strong>{method.name}</strong><span className="configure-hint">Configure JavaService →</span></div>
    <div className="method-return"><span>Returns</span><code>{method.returnType}</code></div>
    <div className="parameters"><span>Parameters</span>{method.parameters?.length ? method.parameters.map((p, i) => <div className="parameter" key={`${p.type}-${i}`}><code>{p.name}</code><span>:</span><code>{p.type}</code></div>) : <span className="no-params">No parameters</span>}</div>
  </button>
}

function JavaServiceModal({ jar, className, method, onClose, onCreated }) {
  const [serviceName, setServiceName] = useState(method.name)
  const [description, setDescription] = useState('')
  const [enabled, setEnabled] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    if (!serviceName.trim()) { setError('Service name is required.'); return }
    setSaving(true); setError('')
    try {
      await createJavaService({
        serviceName: serviceName.trim(), description: description.trim(), enabled,
        jarId: jar.id, className, methodName: method.name, returnType: method.returnType,
        parameters: method.parameters || []
      })
      onCreated()
    } catch (err) { setError(extractError(err)) }
    finally { setSaving(false) }
  }

  return <div className="modal-backdrop" onMouseDown={onClose}>
    <div className="modal" onMouseDown={e => e.stopPropagation()}>
      <div className="modal-header"><div><h2>Configure JavaService</h2><p>Create a service from the selected Java method.</p></div><button className="close-button" onClick={onClose}>×</button></div>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="service-source"><span>Source</span><strong>{jar.fileName}</strong><code>{className}.{method.name}()</code></div>
        <label className="form-field"><span>Service Name</span><input value={serviceName} onChange={e => setServiceName(e.target.value)} placeholder="e.g. createUserService" autoFocus /></label>
        <label className="form-field"><span>Description</span><textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe what this JavaService does." rows="3" /></label>
        <label className="checkbox-field"><input type="checkbox" checked={enabled} onChange={e => setEnabled(e.target.checked)} /><span>Enable service</span></label>
        <div className="modal-actions"><button type="button" className="secondary-button" onClick={onClose}>Cancel</button><button type="submit" className="primary-button" disabled={saving}>{saving ? 'Creating...' : 'Create JavaService'}</button></div>
      </form>
    </div>
  </div>
}

function JavaServicesPage() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function loadServices() {
    setLoading(true); setError('')
    try { setServices((await getAllJavaServices()) || []) } catch (err) { setError(extractError(err)) } finally { setLoading(false) }
  }

  useEffect(() => { loadServices() }, [])

  return <section>
    <div className="page-heading"><div><h1>JavaServices</h1><p>JavaServices created from uploaded JAR methods.</p></div><button className="secondary-button" onClick={loadServices}>Refresh</button></div>
    {error && <div className="error page-error">{error}</div>}
    <section className="card services-table-card">
      {loading ? <Empty text="Loading JavaServices..." /> : services.length === 0 ? <Empty text="No JavaServices have been created yet." /> : <div className="services-table-wrap"><table className="services-table"><thead><tr><th>Service Name</th><th>Source JAR</th><th>Class</th><th>Method</th><th>Status</th><th>Created</th></tr></thead><tbody>{services.map(service => <tr key={service.id}><td><strong>{service.serviceName}</strong>{service.description && <small>{service.description}</small>}</td><td>{service.jarFileName}</td><td><code>{service.className}</code></td><td><code>{service.methodName}()</code></td><td><span className={service.enabled ? 'status enabled' : 'status disabled'}>{service.enabled ? 'Enabled' : 'Disabled'}</span></td><td>{formatDate(service.createdAt)}</td></tr>)}</tbody></table></div>}
    </section>
  </section>
}

function PanelHeader({ title, subtitle, loading }) { return <div className="panel-header"><div><h2>{title}</h2><p>{subtitle}</p></div>{loading && <Spinner />}</div> }
function Empty({ text }) { return <div className="empty">{text}</div> }
function Spinner() { return <span className="spinner" /> }
function extractError(err) { return err?.response?.data?.message || err?.message || 'Something went wrong.' }
function formatBytes(bytes = 0) { if (bytes === 0) return '0 Bytes'; const units = ['Bytes','KB','MB','GB']; const i = Math.floor(Math.log(bytes) / Math.log(1024)); return `${(bytes / 1024 ** i).toFixed(2)} ${units[i]}` }
function formatDate(value) { if (!value) return '-'; const d = new Date(value); return Number.isNaN(d.getTime()) ? value : d.toLocaleString() }

export default App
