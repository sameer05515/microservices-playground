import { useMemo, useState } from 'react';
import axios from 'axios';
import {
  Alert, Box, Button, Card, CardContent, Chip, CircularProgress,
  Container, Divider, Grid, Paper, Stack, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, TextField, Typography
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const API = 'http://localhost:8080/api/duplicates';

const formatBytes = (bytes = 0) => {
  if (bytes < 1024) return `${bytes} B`;
  const units = ['KB', 'MB', 'GB', 'TB'];
  let value = bytes;
  let unit = -1;
  do { value /= 1024; unit++; } while (value >= 1024 && unit < units.length - 1);
  return `${value.toFixed(value >= 100 ? 0 : 2)} ${units[unit]}`;
};

function App() {
  const [rootPath, setRootPath] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState(null);

  const totalFiles = useMemo(
    () => data?.groups?.reduce((sum, g) => sum + g.files.length, 0) ?? 0,
    [data]
  );

  const scan = async () => {
    if (!rootPath.trim()) {
      setError('Please enter a folder path.');
      return;
    }
    setLoading(true);
    setError('');
    setData(null);
    try {
      const response = await axios.post(`${API}/scan`, { rootPath: rootPath.trim() });
      setData(response.data);
    } catch (e) {
      setError(e.response?.data?.error || e.message || 'Unable to scan folder.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h4" fontWeight={800}>Duplicate File Finder</Typography>
          <Typography color="text.secondary" sx={{ mt: .5 }}>
            Spring Boot + SHA-256 + React + Material UI
          </Typography>
        </Box>

        <Paper sx={{ p: 2.5 }}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <TextField
              fullWidth
              label="Folder path"
              placeholder="C:\Users\Prem\Downloads"
              value={rootPath}
              onChange={e => setRootPath(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && scan()}
            />
            <Button
              variant="contained"
              size="large"
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
              onClick={scan}
              disabled={loading}
              sx={{ minWidth: 150 }}
            >
              {loading ? 'Scanning...' : 'Find Duplicates'}
            </Button>
          </Stack>
        </Paper>

        {error && <Alert severity="error">{error}</Alert>}

        {data && (
          <>
            <Grid container spacing={2}>
              {[
                ['Duplicate Groups', data.duplicateGroups],
                ['Duplicate Files', totalFiles],
                ['Wasted Space', formatBytes(data.wastedBytes)],
                ['Scan Time', `${data.scanDurationMs} ms`]
              ].map(([label, value]) => (
                <Grid key={label} size={{ xs: 12, sm: 6, md: 3 }}>
                  <Card>
                    <CardContent>
                      <Typography color="text.secondary" variant="body2">{label}</Typography>
                      <Typography variant="h5" fontWeight={800} sx={{ mt: 1 }}>{value}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Paper sx={{ p: 2 }}>
              <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" gap={1}>
                <Box>
                  <Typography variant="h6" fontWeight={700}>Scan Result</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {data.rootPath}
                  </Typography>
                </Box>
                <Chip label={`${data.duplicateGroups} groups`} />
              </Stack>
            </Paper>

            {data.groups.length === 0 ? (
              <Alert severity="success">No duplicate files found.</Alert>
            ) : (
              <Stack spacing={2}>
                {data.groups.map(group => {
                  const open = expanded === group.groupNumber;
                  return (
                    <Paper key={group.groupNumber} variant="outlined">
                      <Box
                        className="group-header"
                        onClick={() => setExpanded(open ? null : group.groupNumber)}
                      >
                        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" gap={1}>
                          <Box>
                            <Typography fontWeight={700}>
                              Group #{group.groupNumber}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {group.files.length} identical files · {formatBytes(group.fileSize)} each
                            </Typography>
                          </Box>
                          <Stack direction="row" spacing={1}>
                            <Chip label={`Wasted ${formatBytes(group.wastedBytes)}`} color="warning" />
                            <Chip label={open ? 'Hide' : 'Show'} />
                          </Stack>
                        </Stack>
                      </Box>

                      {open && (
                        <>
                          <Divider />
                          <TableContainer>
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell>File</TableCell>
                                  <TableCell>Path</TableCell>
                                  <TableCell>Size</TableCell>
                                  <TableCell>Last Modified</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {group.files.map(file => (
                                  <TableRow key={file.path}>
                                    <TableCell sx={{ fontWeight: 600 }}>{file.fileName}</TableCell>
                                    <TableCell className="path-cell">{file.path}</TableCell>
                                    <TableCell>{formatBytes(file.size)}</TableCell>
                                    <TableCell>{new Date(file.lastModified).toLocaleString()}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                          <Box sx={{ px: 2, py: 1.5 }}>
                            <Typography variant="caption" color="text.secondary">
                              SHA-256: {group.sha256}
                            </Typography>
                          </Box>
                        </>
                      )}
                    </Paper>
                  );
                })}
              </Stack>
            )}
          </>
        )}
      </Stack>
    </Container>
  );
}

export default App;
