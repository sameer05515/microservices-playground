import { useMemo, useState } from 'react'
import { getPublicClasses, getPublicMethods, uploadJar } from './api'

function App() {
  const [file, setFile] = useState(null)
  const [jar, setJar] = useState(null)
  const [classes, setClasses] = useState([])
  const [selectedClass, setSelectedClass] = useState('')
  const [methods, setMethods] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingClasses, setLoadingClasses] = useState(false)
  const [loadingMethods, setLoadingMethods] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')

  const selectedClassMethods = useMemo(() => methods || [], [methods])

  function resetError() {
    setError('')
  }

  function handleFileChange(event) {
    resetError()
    setJar(null)
    setClasses([])
    setSelectedClass('')
    setMethods([])

    const selected = event.target.files?.[0]

    if (!selected) {
      setFile(null)
      return
    }

    if (!selected.name.toLowerCase().endsWith('.jar')) {
      setError('Please select a .jar file.')
      setFile(null)
      return
    }

    setFile(selected)
  }

  async function handleUpload() {
    if (!file) {
      setError('Please select a JAR file first.')
      return
    }

    resetError()
    setLoading(true)
    setProgress(0)
    setJar(null)
    setClasses([])
    setSelectedClass('')
    setMethods([])

    try {
      const result = await uploadJar(file, event => {
        if (event.total) {
          setProgress(Math.round((event.loaded / event.total) * 100))
        }
      })

      setJar(result)

      await loadClasses(result.id)
    } catch (err) {
      setError(extractError(err))
    } finally {
      setLoading(false)
    }
  }

  async function loadClasses(jarId) {
    setLoadingClasses(true)
    resetError()

    try {
      const result = await getPublicClasses(jarId)
      setClasses(result.classes || [])
    } catch (err) {
      setError(extractError(err))
    } finally {
      setLoadingClasses(false)
    }
  }

  async function handleClassSelect(className) {
    setSelectedClass(className)
    setMethods([])

    if (!className || !jar?.id) {
      return
    }

    setLoadingMethods(true)
    resetError()

    try {
      const result = await getPublicMethods(jar.id, className)
      setMethods(result.methods || [])
    } catch (err) {
      setError(extractError(err))
    } finally {
      setLoadingMethods(false)
    }
  }

  function extractError(err) {
    return (
      err?.response?.data?.message ||
      err?.message ||
      'Something went wrong.'
    )
  }

  return (
    <div className="app">
      <header className="topbar">
        <div>
          <div className="brand">iAgent</div>
          <div className="subtitle">Java Service Integration Platform</div>
        </div>
        <div className="version">V1</div>
      </header>

      <main className="container">
        <section className="card upload-card">
          <div className="section-title">
            <div>
              <h1>JAR Management</h1>
              <p>Upload a Java JAR and inspect its public classes.</p>
            </div>
          </div>

          <div className="upload-row">
            <label className="file-picker">
              <span>Select JAR</span>
              <input
                type="file"
                accept=".jar,application/java-archive"
                onChange={handleFileChange}
              />
            </label>

            <div className="selected-file">
              {file ? (
                <>
                  <strong>{file.name}</strong>
                  <span>{formatBytes(file.size)}</span>
                </>
              ) : (
                <span>No JAR selected</span>
              )}
            </div>

            <button
              className="primary-button"
              disabled={!file || loading}
              onClick={handleUpload}
            >
              {loading ? 'Uploading...' : 'Upload JAR'}
            </button>
          </div>

          {loading && (
            <div className="progress-area">
              <div className="progress-track">
                <div
                  className="progress-bar"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span>{progress}%</span>
            </div>
          )}

          {error && <div className="error">{error}</div>}
        </section>

        {jar && (
          <section className="card jar-info">
            <div className="section-title">
              <div>
                <h2>Uploaded JAR</h2>
                <p>Metadata returned by the backend.</p>
              </div>
            </div>

            <div className="metadata-grid">
              <Info label="File Name" value={jar.fileName} />
              <Info label="JAR ID" value={jar.id} mono />
              <Info label="Size" value={formatBytes(jar.size)} />
              <Info label="Uploaded At" value={formatDate(jar.uploadedAt)} />
            </div>
          </section>
        )}

        {jar && (
          <div className="workspace">
            <section className="card classes-panel">
              <div className="panel-header">
                <div>
                  <h2>Public Classes</h2>
                  <p>{classes.length} public class(es)</p>
                </div>
                {loadingClasses && <Spinner />}
              </div>

              <div className="list">
                {classes.length === 0 && !loadingClasses ? (
                  <Empty text="No public classes found." />
                ) : (
                  classes.map(className => (
                    <button
                      key={className}
                      className={`list-item ${
                        selectedClass === className ? 'selected' : ''
                      }`}
                      onClick={() => handleClassSelect(className)}
                    >
                      <span className="class-icon">C</span>
                      <span>{className}</span>
                    </button>
                  ))
                )}
              </div>
            </section>

            <section className="card methods-panel">
              <div className="panel-header">
                <div>
                  <h2>Public Methods</h2>
                  <p>
                    {selectedClass
                      ? selectedClass
                      : 'Select a class to inspect its methods.'}
                  </p>
                </div>
                {loadingMethods && <Spinner />}
              </div>

              {!selectedClass ? (
                <Empty text="Select a public class from the left." />
              ) : selectedClassMethods.length === 0 && !loadingMethods ? (
                <Empty text="No public methods found." />
              ) : (
                <div className="methods-list">
                  {selectedClassMethods.map((method, index) => (
                    <div className="method-card" key={`${method.name}-${index}`}>
                      <div className="method-name">
                        <span className="method-icon">ƒ</span>
                        <strong>{method.name}</strong>
                      </div>

                      <div className="method-return">
                        <span>Returns</span>
                        <code>{method.returnType}</code>
                      </div>

                      <div className="parameters">
                        <span>Parameters</span>
                        {method.parameters?.length ? (
                          method.parameters.map((parameter, parameterIndex) => (
                            <div
                              className="parameter"
                              key={`${parameter.type}-${parameterIndex}`}
                            >
                              <code>{parameter.name}</code>
                              <span>:</span>
                              <code>{parameter.type}</code>
                            </div>
                          ))
                        ) : (
                          <span className="no-params">No parameters</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  )
}

function Info({ label, value, mono }) {
  return (
    <div className="metadata-item">
      <span>{label}</span>
      <strong className={mono ? 'mono' : ''}>{value || '-'}</strong>
    </div>
  )
}

function Empty({ text }) {
  return <div className="empty">{text}</div>
}

function Spinner() {
  return <span className="spinner" />
}

function formatBytes(bytes = 0) {
  if (bytes === 0) return '0 Bytes'

  const units = ['Bytes', 'KB', 'MB', 'GB']
  const index = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / 1024 ** index).toFixed(2)} ${units[index]}`
}

function formatDate(value) {
  if (!value) return '-'

  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString()
}

export default App
