import { useEffect, useState } from 'react'
import { getAllJars, getPublicClasses, getPublicMethods, uploadJar } from './api'

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
        </nav>
        <div className="version">V2</div>
      </header>
      <main className="container">
        {page === 'upload' ? <UploadPage onUploaded={() => setPage('jars')} /> : <UploadedJarsPage />}
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
    } catch (err) {
      setError(extractError(err))
    } finally { setLoading(false) }
  }

  return (
    <section className="card upload-page">
      <div className="page-heading">
        <div><h1>Upload JAR</h1><p>Upload a Java JAR and inspect its public classes and methods.</p></div>
      </div>
      <div className="upload-box">
        <label className="file-picker large">
          <span>Select JAR File</span>
          <input type="file" accept=".jar,application/java-archive" onChange={handleFileChange} />
        </label>
        {file && <div className="selected-file-box"><strong>{file.name}</strong><span>{formatBytes(file.size)}</span></div>}
        <button className="primary-button" disabled={!file || loading} onClick={handleUpload}>{loading ? 'Uploading...' : 'Upload JAR'}</button>
      </div>
      {loading && <div className="progress-area"><div className="progress-track"><div className="progress-bar" style={{ width: `${progress}%` }} /></div><span>{progress}%</span></div>}
      {error && <div className="error">{error}</div>}
      {uploadedJar && (
        <div className="success">
          <strong>JAR uploaded successfully.</strong>
          <div className="success-details"><span>{uploadedJar.fileName}</span><code>{uploadedJar.id}</code></div>
          <button className="secondary-button" onClick={onUploaded}>View Uploaded JARs</button>
        </div>
      )}
    </section>
  )
}

function UploadedJarsPage() {
  const [jars, setJars] = useState([])
  const [selectedJar, setSelectedJar] = useState(null)
  const [classes, setClasses] = useState([])
  const [selectedClass, setSelectedClass] = useState('')
  const [methods, setMethods] = useState([])
  const [loadingJars, setLoadingJars] = useState(true)
  const [loadingClasses, setLoadingClasses] = useState(false)
  const [loadingMethods, setLoadingMethods] = useState(false)
  const [error, setError] = useState('')

  async function loadJars() {
    setLoadingJars(true); setError('')
    try { setJars((await getAllJars()) || []) }
    catch (err) { setError(extractError(err)) }
    finally { setLoadingJars(false) }
  }

  useEffect(() => { loadJars() }, [])

  async function handleJarSelect(jar) {
    setSelectedJar(jar); setSelectedClass(''); setClasses([]); setMethods([]); setLoadingClasses(true); setError('')
    try { setClasses((await getPublicClasses(jar.id)).classes || []) }
    catch (err) { setError(extractError(err)) }
    finally { setLoadingClasses(false) }
  }

  async function handleClassSelect(className) {
    if (!selectedJar) return
    setSelectedClass(className); setMethods([]); setLoadingMethods(true); setError('')
    try { setMethods((await getPublicMethods(selectedJar.id, className)).methods || []) }
    catch (err) { setError(extractError(err)) }
    finally { setLoadingMethods(false) }
  }

  return (
    <section>
      <div className="page-heading">
        <div><h1>Uploaded JARs</h1><p>Select a JAR → class → method to explore its public API.</p></div>
        <button className="secondary-button" onClick={loadJars}>Refresh</button>
      </div>
      {error && <div className="error page-error">{error}</div>}
      <div className="browser-grid">
        <section className="card browser-panel">
          <PanelHeader title="JAR Files" subtitle={`${jars.length} uploaded JAR(s)`} loading={loadingJars} />
          <div className="list">
            {!loadingJars && jars.length === 0 ? <Empty text="No JAR files have been uploaded yet." /> : jars.map(jar => (
              <button key={jar.id} className={`list-item ${selectedJar?.id === jar.id ? 'selected' : ''}`} onClick={() => handleJarSelect(jar)}>
                <span className="file-icon">JAR</span>
                <span className="item-content"><strong>{jar.fileName}</strong><small>{formatBytes(jar.size)}</small></span>
              </button>
            ))}
          </div>
        </section>

        <section className="card browser-panel">
          <PanelHeader title="Public Classes" subtitle={selectedJar ? selectedJar.fileName : 'Select a JAR file'} loading={loadingClasses} />
          {!selectedJar ? <Empty text="Click a JAR file to view its public classes." /> : (
            <div className="list">
              {!loadingClasses && classes.length === 0 ? <Empty text="No public classes found." /> : classes.map(className => (
                <button key={className} className={`list-item ${selectedClass === className ? 'selected' : ''}`} onClick={() => handleClassSelect(className)}>
                  <span className="class-icon">C</span><span className="item-content"><strong>{className}</strong></span>
                </button>
              ))}
            </div>
          )}
        </section>

        <section className="card browser-panel methods-panel">
          <PanelHeader title="Public Methods" subtitle={selectedClass || 'Select a public class'} loading={loadingMethods} />
          {!selectedClass ? <Empty text="Click a class to view its public methods." /> : (
            <div className="methods-list">
              {!loadingMethods && methods.length === 0 ? <Empty text="No public methods found." /> : methods.map((method, index) => <MethodCard key={`${method.name}-${index}`} method={method} />)}
            </div>
          )}
        </section>
      </div>
    </section>
  )
}

function PanelHeader({ title, subtitle, loading }) {
  return <div className="panel-header"><div><h2>{title}</h2><p>{subtitle}</p></div>{loading && <Spinner />}</div>
}

function MethodCard({ method }) {
  return <div className="method-card">
    <div className="method-name"><span className="method-icon">ƒ</span><strong>{method.name}</strong></div>
    <div className="method-return"><span>Returns</span><code>{method.returnType}</code></div>
    <div className="parameters"><span>Parameters</span>{method.parameters?.length ? method.parameters.map((p, i) => <div className="parameter" key={`${p.type}-${i}`}><code>{p.name}</code><span>:</span><code>{p.type}</code></div>) : <span className="no-params">No parameters</span>}</div>
  </div>
}

function Empty({ text }) { return <div className="empty">{text}</div> }
function Spinner() { return <span className="spinner" /> }
function extractError(err) { return err?.response?.data?.message || err?.message || 'Something went wrong.' }
function formatBytes(bytes = 0) { if (bytes === 0) return '0 Bytes'; const units = ['Bytes','KB','MB','GB']; const i = Math.floor(Math.log(bytes) / Math.log(1024)); return `${(bytes / 1024 ** i).toFixed(2)} ${units[i]}` }

export default App
