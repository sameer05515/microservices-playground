import { useEffect, useMemo, useRef, useState } from 'react'
import {
  AppBar, Toolbar, Typography, Box, Paper, Button, Stack, Breadcrumbs,
  Link, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, TextField, Select, MenuItem, FormControl, InputLabel,
  Pagination, Chip, LinearProgress, Dialog, DialogTitle, DialogContent,
  DialogActions, Alert, Grid, Card, CardContent, Tooltip
} from '@mui/material'
import {
  Folder, InsertDriveFile, UploadFile, Download, Delete, ContentCopy,
  DriveFileMove, Archive, Unarchive, Search, Refresh, CreateNewFolder,
  Visibility, BarChart, FindInPage, FolderOff, FileCopy
} from '@mui/icons-material'
import { api, uploadFiles } from './api'

const API = '/api/files'

export default function App() {
  const [path, setPath] = useState('')
  const [items, setItems] = useState([])
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(10)
  const [totalPages, setTotalPages] = useState(0)
  const [sortBy, setSortBy] = useState('name')
  const [direction, setDirection] = useState('asc')
  const [root, setRoot] = useState('')
  const [search, setSearch] = useState('')
  const [analysis, setAnalysis] = useState(null)
  const [preview, setPreview] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(null)
  const [jobs, setJobs] = useState([])
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef(null)

  const load = async (target = path, targetPage = page) => {
    try {
      setError('')
      const data = await api.list(target, targetPage, size, sortBy, direction)
      setItems(data.content)
      setTotalPages(data.totalPages)
      setPage(data.page)
      setPath(target)
    } catch (e) {
      setError(e.message)
    }
  }

  useEffect(() => {
    api.root().then(x => setRoot(x.root)).catch(e => setError(e.message))
    load('', 0)
  }, [])

  useEffect(() => {
    load(path, page)
  }, [size, sortBy, direction])

  const breadcrumb = useMemo(() => {
    if (!path) return []
    return path.split('/').filter(Boolean)
  }, [path])

  const action = async (fn, success = 'Operation completed') => {
    try {
      setError('')
      await fn()
      setMessage(success)
      await load(path, page)
    } catch (e) {
      setError(e.message)
    }
  }

  const upload = async files => {
    if (!files?.length) return

    try {
      setError('')
      setUploadProgress(0)
      await uploadFiles(path, files, setUploadProgress)
      setMessage(`${files.length} file(s) uploaded`)
      await load(path, page)
    } catch (e) {
      setError(e.message)
    } finally {
      setTimeout(() => setUploadProgress(null), 800)
    }
  }

  const prompt = (label, value = '') => window.prompt(label, value)

  const createFolder = () => {
    const name = prompt('Folder path:', path ? `${path}/new-folder` : 'new-folder')
    if (name) action(() => api.mkdir(name), 'Folder created')
  }

  const copyItem = item => {
    const destination = prompt('Destination:', `${item.relativePath}-copy`)
    if (destination) action(() => api.copy(item.relativePath, destination), 'Copied')
  }

  const moveItem = item => {
    const destination = prompt('Destination:', `${item.relativePath}-moved`)
    if (destination) action(() => api.move(item.relativePath, destination), 'Moved')
  }

  const deleteItem = item => {
    if (window.confirm(`Delete ${item.relativePath}?`)) {
      action(() => api.delete(item.relativePath), 'Deleted')
    }
  }

  const startZip = async item => {
    const destination = prompt('ZIP destination:', `${item.relativePath}.zip`)
    if (!destination) return

    try {
      const job = await api.zip(item.relativePath, destination)
      setJobs(x => [job, ...x])
      setMessage(`ZIP job started: ${job.jobId}`)
      pollJob(job.jobId)
    } catch (e) {
      setError(e.message)
    }
  }

  const startUnzip = async item => {
    const destination = prompt(
      'Extraction directory:',
      item.relativePath.replace(/\.zip$/i, '') + '-extracted'
    )
    if (!destination) return

    try {
      const job = await api.unzip(item.relativePath, destination)
      setJobs(x => [job, ...x])
      setMessage(`UNZIP job started: ${job.jobId}`)
      pollJob(job.jobId)
    } catch (e) {
      setError(e.message)
    }
  }

  const pollJob = id => {
    const timer = setInterval(async () => {
      try {
        const job = await api.job(id)
        setJobs(current => current.map(x => x.jobId === id ? job : x))

        if (['COMPLETED', 'FAILED'].includes(job.status)) {
          clearInterval(timer)
          if (job.status === 'COMPLETED') {
            setMessage(`${job.type} completed`)
            load(path, page)
          }
        }
      } catch (e) {
        clearInterval(timer)
        setError(e.message)
      }
    }, 700)
  }

  const find = async () => {
    try {
      setAnalysis(await api.find(search, path))
    } catch (e) {
      setError(e.message)
    }
  }

  const analysisCall = async fn => {
    try {
      setAnalysis(await fn())
    } catch (e) {
      setError(e.message)
    }
  }

  const openPreview = item => {
    if (item.directory) return
    setPreview({
      name: item.name,
      url: `${API}/preview?path=${encodeURIComponent(item.relativePath)}`,
      type: item.type
    })
  }

  const goUp = () => {
    const parts = path.split('/').filter(Boolean)
    parts.pop()
    load(parts.join('/'), 0)
  }

  const navigate = target => load(target, 0)

  const toggleSort = field => {
    if (sortBy === field) {
      setDirection(x => x === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setDirection('asc')
    }
  }

  const download = item => {
    window.open(`${API}/download?path=${encodeURIComponent(item.relativePath)}`, '_blank')
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static">
        <Toolbar>
          <Folder sx={{ mr: 1 }} />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            File Utils Dashboard
          </Typography>
          <Chip label="Spring Boot + React + MUI" sx={{ color: 'white' }} />
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 3 }}>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid size={{ xs: 12, md: 3 }}>
            <Card>
              <CardContent>
                <Typography color="text.secondary">Workspace</Typography>
                <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                  {root}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <Card>
              <CardContent>
                <Typography color="text.secondary">Current Path</Typography>
                <Typography>{path || '/'}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card>
              <CardContent>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  <Button startIcon={<CreateNewFolder />} onClick={createFolder}>New Folder</Button>
                  <Button startIcon={<UploadFile />} variant="contained" onClick={() => inputRef.current?.click()}>
                    Upload
                  </Button>
                  <Button startIcon={<Refresh />} onClick={() => load(path, page)}>Refresh</Button>
                  <input
                    hidden
                    ref={inputRef}
                    type="file"
                    multiple
                    onChange={e => upload([...e.target.files])}
                  />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {uploadProgress !== null && (
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>Upload progress: {uploadProgress}%</Typography>
            <LinearProgress variant="determinate" value={uploadProgress} />
          </Paper>
        )}

        <Paper
          sx={{
            p: 3,
            mb: 2,
            border: dragging ? '2px dashed' : '2px dashed transparent',
            borderColor: dragging ? 'primary.main' : 'transparent',
            bgcolor: dragging ? 'primary.50' : 'background.paper'
          }}
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => {
            e.preventDefault()
            setDragging(false)
            upload([...e.dataTransfer.files])
          }}
        >
          <Stack alignItems="center" spacing={1}>
            <UploadFile fontSize="large" color="primary" />
            <Typography variant="h6">Drag & Drop files here</Typography>
            <Typography color="text.secondary">
              Files will be uploaded into <b>{path || '/'}</b>
            </Typography>
          </Stack>
        </Paper>

        <Paper sx={{ p: 2, mb: 2 }}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
            <Button onClick={goUp} disabled={!path}>Up</Button>
            <Breadcrumbs sx={{ flexGrow: 1 }}>
              <Link component="button" underline="hover" onClick={() => navigate('')}>
                /
              </Link>
              {breadcrumb.map((part, i) => {
                const target = breadcrumb.slice(0, i + 1).join('/')
                return (
                  <Link
                    component="button"
                    key={target}
                    underline="hover"
                    onClick={() => navigate(target)}
                  >
                    {part}
                  </Link>
                )
              })}
            </Breadcrumbs>

            <FormControl size="small" sx={{ minWidth: 130 }}>
              <InputLabel>Sort</InputLabel>
              <Select value={sortBy} label="Sort" onChange={e => setSortBy(e.target.value)}>
                <MenuItem value="name">Name</MenuItem>
                <MenuItem value="type">Type</MenuItem>
                <MenuItem value="size">Size</MenuItem>
                <MenuItem value="modified">Modified</MenuItem>
              </Select>
            </FormControl>

            <Button onClick={() => setDirection(x => x === 'asc' ? 'desc' : 'asc')}>
              {direction.toUpperCase()}
            </Button>
          </Stack>
        </Paper>

        <Paper sx={{ mb: 2 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Button onClick={() => toggleSort('name')}>Name</Button>
                  </TableCell>
                  <TableCell>
                    <Button onClick={() => toggleSort('type')}>Type</Button>
                  </TableCell>
                  <TableCell>
                    <Button onClick={() => toggleSort('size')}>Size</Button>
                  </TableCell>
                  <TableCell>
                    <Button onClick={() => toggleSort('modified')}>Modified</Button>
                  </TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map(item => (
                  <TableRow hover key={item.relativePath}>
                    <TableCell>
                      <Button
                        color="inherit"
                        startIcon={item.directory ? <Folder /> : <InsertDriveFile />}
                        onClick={() => item.directory ? navigate(item.relativePath) : openPreview(item)}
                      >
                        {item.name}
                      </Button>
                    </TableCell>
                    <TableCell>{item.directory ? 'DIRECTORY' : item.type}</TableCell>
                    <TableCell>{item.directory ? '—' : formatBytes(item.size)}</TableCell>
                    <TableCell>{new Date(item.modified).toLocaleString()}</TableCell>
                    <TableCell align="right">
                      <Stack direction="row" justifyContent="flex-end">
                        {!item.directory && (
                          <>
                            <Tooltip title="Preview">
                              <IconButton onClick={() => openPreview(item)}><Visibility /></IconButton>
                            </Tooltip>
                            <Tooltip title="Download">
                              <IconButton onClick={() => download(item)}><Download /></IconButton>
                            </Tooltip>
                            {item.name.toLowerCase().endsWith('.zip') && (
                              <Tooltip title="Unzip">
                                <IconButton onClick={() => startUnzip(item)}><Unarchive /></IconButton>
                              </Tooltip>
                            )}
                          </>
                        )}

                        <Tooltip title="Copy">
                          <IconButton onClick={() => copyItem(item)}><ContentCopy /></IconButton>
                        </Tooltip>

                        <Tooltip title="Move">
                          <IconButton onClick={() => moveItem(item)}><DriveFileMove /></IconButton>
                        </Tooltip>

                        {!item.directory && (
                          <Tooltip title="Zip">
                            <IconButton onClick={() => startZip(item)}><Archive /></IconButton>
                          </Tooltip>
                        )}

                        <Tooltip title="Delete">
                          <IconButton color="error" onClick={() => deleteItem(item)}><Delete /></IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ p: 2 }}>
            <FormControl size="small">
              <InputLabel>Rows</InputLabel>
              <Select value={size} label="Rows" onChange={e => { setSize(e.target.value); setPage(0) }}>
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={25}>25</MenuItem>
                <MenuItem value={50}>50</MenuItem>
              </Select>
            </FormControl>
            <Pagination
              count={Math.max(totalPages, 1)}
              page={page + 1}
              onChange={(_, value) => load(path, value - 1)}
              color="primary"
            />
          </Stack>
        </Paper>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Analysis</Typography>
              <Stack spacing={1}>
                <Stack direction="row" spacing={1}>
                  <TextField
                    size="small"
                    fullWidth
                    label="Find"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                  <Button variant="contained" startIcon={<Search />} onClick={find}>Find</Button>
                </Stack>
                <Button startIcon={<BarChart />} onClick={() => analysisCall(() => api.count(path))}>
                  File Counter
                </Button>
                <Button startIcon={<FolderOff />} onClick={() => analysisCall(() => api.emptyFolders(path))}>
                  Empty Folder Finder
                </Button>
                <Button startIcon={<FileCopy />} onClick={() => analysisCall(() => api.duplicates(path))}>
                  Duplicate File Finder
                </Button>
              </Stack>

              {analysis !== null && (
                <Box component="pre" sx={{
                  mt: 2,
                  p: 2,
                  bgcolor: '#101827',
                  color: '#dbeafe',
                  borderRadius: 1,
                  overflow: 'auto',
                  maxHeight: 350
                }}>
                  {JSON.stringify(analysis, null, 2)}
                </Box>
              )}
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Async Jobs</Typography>
              {jobs.length === 0 && (
                <Typography color="text.secondary">No archive jobs.</Typography>
              )}
              <Stack spacing={2}>
                {jobs.map(job => (
                  <Box key={job.jobId}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography>{job.type}</Typography>
                      <Chip
                        size="small"
                        label={job.status}
                        color={job.status === 'COMPLETED' ? 'success' : job.status === 'FAILED' ? 'error' : 'primary'}
                      />
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={job.progress || 0}
                      sx={{ my: 1 }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {job.progress}% — {job.message}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      <Dialog open={Boolean(preview)} onClose={() => setPreview(null)} maxWidth="lg" fullWidth>
        <DialogTitle>{preview?.name}</DialogTitle>
        <DialogContent dividers>
          {preview && renderPreview(preview)}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreview(null)}>Close</Button>
        </DialogActions>
      </Dialog>

      {(message || error) && (
        <Alert
          severity={error ? 'error' : 'success'}
          onClose={() => { setMessage(''); setError('') }}
          sx={{ position: 'fixed', right: 20, bottom: 20, zIndex: 9999 }}
        >
          {error || message}
        </Alert>
      )}
    </Box>
  )
}

function renderPreview(file) {
  const url = file.url
  const type = file.type.toLowerCase()

  if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(type)) {
    return (
      <Box sx={{ textAlign: 'center' }}>
        <img src={url} alt={file.name} style={{ maxWidth: '100%', maxHeight: '70vh' }} />
      </Box>
    )
  }

  if (type === 'pdf') {
    return <Box component="iframe" src={url} sx={{ width: '100%', height: '70vh', border: 0 }} />
  }

  if (['txt', 'json', 'xml', 'csv', 'java', 'js', 'jsx', 'css', 'html', 'md'].includes(type)) {
    return (
      <Box
        component="iframe"
        src={url}
        sx={{ width: '100%', height: '60vh', border: 1, borderColor: 'divider' }}
      />
    )
  }

  return (
    <Stack alignItems="center" spacing={2} sx={{ py: 5 }}>
      <FindInPage fontSize="large" />
      <Typography>This file type is not previewable in the dashboard.</Typography>
      <Button href={url} target="_blank" variant="contained">Open File</Button>
    </Stack>
  )
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(1)} MB`
  return `${(bytes / 1024 ** 3).toFixed(1)} GB`
}
