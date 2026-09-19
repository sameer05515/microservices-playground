import { useEffect, useState } from 'react'
import { api } from './api'

const initialOperation = {
  source: '',
  destination: ''
}

function App() {
  const [path, setPath] = useState('')
  const [items, setItems] = useState([])
  const [operation, setOperation] = useState(initialOperation)
  const [search, setSearch] = useState('')
  const [result, setResult] = useState(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [root, setRoot] = useState('')

  const load = async (target = path) => {
    try {
      setError('')
      const data = await api.list(target)
      setItems(data)
      setPath(target)
    } catch (e) {
      setError(e.message)
    }
  }

  useEffect(() => {
    api.root().then(data => setRoot(data.root)).catch(e => setError(e.message))
    load('')
  }, [])

  const run = async (fn, successMessage) => {
    try {
      setBusy(true)
      setError('')
      await fn()
      setMessage(successMessage)
      await load(path)
    } catch (e) {
      setError(e.message)
    } finally {
      setBusy(false)
    }
  }

  const join = (base, name) => base ? `${base}/${name}` : name

  const navigate = item => {
    if (item.directory) {
      load(item.relativePath)
    }
  }

  const goUp = () => {
    if (!path) return
    const parts = path.split('/')
    parts.pop()
    load(parts.join('/'))
  }

  const executeSearch = async () => {
    try {
      setBusy(true)
      setError('')
      setResult(await api.find(search, path))
    } catch (e) {
      setError(e.message)
    } finally {
      setBusy(false)
    }
  }

  const count = () => run(async () => setResult(await api.count(path)), '')
  const emptyFolders = () => run(async () => setResult(await api.emptyFolders(path)), '')
  const duplicates = () => run(async () => setResult(await api.duplicates(path)), '')

  const ask = (label, defaults = {}) => {
    const value = window.prompt(label, defaults.value || '')
    return value
  }

  const doMkdir = () => {
    const value = ask('Directory path relative to workspace:', { value: path ? `${path}/new-folder` : 'new-folder' })
    if (value) run(() => api.mkdir(value), 'Directory created')
  }

  const doCopy = () => {
    const source = ask('Source path:', { value: path })
    if (!source) return
    const destination = ask('Destination path:', { value: `${source}-copy` })
    if (destination) run(() => api.copy(source, destination), 'Copy completed')
  }

  const doMove = () => {
    const source = ask('Source path:', { value: path })
    if (!source) return
    const destination = ask('Destination path:', { value: `${source}-moved` })
    if (destination) run(() => api.move(source, destination), 'Move completed')
  }

  const doDelete = item => {
    const target = item?.relativePath || ask('Path to delete:', { value: path })
    if (!target) return
    if (window.confirm(`Delete "${target}"?`)) {
      run(() => api.delete(target), 'Delete completed')
    }
  }

  const doZip = () => {
    const source = ask('Folder/file to ZIP:', { value: path })
    if (!source) return
    const destination = ask('ZIP destination:', { value: `${source}.zip` })
    if (destination) run(() => api.zip(source, destination), 'ZIP created')
  }

  const doUnzip = () => {
    const source = ask('ZIP file:', { value: path })
    if (!source) return
    const destination = ask('Extraction directory:', { value: `${source.replace(/\.zip$/i, '')}-extracted` })
    if (destination) run(() => api.unzip(source, destination), 'ZIP extracted')
  }

  return (
    <div className="app">
      <header>
        <div>
          <h1>File Utils</h1>
          <p>Java NIO + Spring Boot + React/Vite</p>
        </div>
        <div className="root">
          <span>Workspace</span>
          <code>{root || 'loading...'}</code>
        </div>
      </header>

      <section className="toolbar">
        <button onClick={goUp}>↑ Up</button>
        <button onClick={() => load('')}>Home</button>
        <button onClick={() => load(path)}>Refresh</button>
        <button onClick={doMkdir}>New Folder</button>
        <button onClick={doCopy}>Copy</button>
        <button onClick={doMove}>Move</button>
        <button onClick={doZip}>Zip</button>
        <button onClick={doUnzip}>Unzip</button>
        <button className="danger" onClick={() => doDelete()}>Delete Path</button>
      </section>

      <div className="pathbar">
        <span>Current:</span>
        <code>/ {path}</code>
      </div>

      <main>
        <section className="panel browser">
          <div className="panel-title">
            <h2>Explorer</h2>
            <span>{items.length} items</span>
          </div>

          {items.length === 0 ? (
            <div className="empty">No files or folders.</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Size</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.relativePath}>
                    <td>
                      <button
                        className="link"
                        onClick={() => navigate(item)}
                      >
                        {item.directory ? '📁' : '📄'} {item.name}
                      </button>
                    </td>
                    <td>{item.directory ? 'DIRECTORY' : item.type}</td>
                    <td>{item.directory ? '—' : formatBytes(item.size)}</td>
                    <td>
                      <button className="small danger" onClick={() => doDelete(item)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <section className="panel tools">
          <h2>Analysis Tools</h2>

          <div className="tool">
            <label>Find files</label>
            <div className="row">
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="e.g. .java or report"
              />
              <button onClick={executeSearch} disabled={!search || busy}>Find</button>
            </div>
          </div>

          <div className="button-grid">
            <button onClick={count}>File Counter</button>
            <button onClick={emptyFolders}>Empty Folder Finder</button>
            <button onClick={duplicates}>Duplicate File Finder</button>
          </div>

          {result !== null && (
            <div className="result">
              <h3>Result</h3>
              <pre>{JSON.stringify(result, null, 2)}</pre>
            </div>
          )}
        </section>
      </main>

      {(message || error) && (
        <div className={error ? 'toast error' : 'toast success'}>
          {error || message}
          <button onClick={() => { setError(''); setMessage('') }}>×</button>
        </div>
      )}

      <footer>
        <span>Zip • Unzip • Copy • Move • Delete • Find • Count • Empty Folders • Duplicates</span>
      </footer>
    </div>
  )
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`
  return `${(bytes / 1024 / 1024 / 1024).toFixed(1)} GB`
}

export default App
