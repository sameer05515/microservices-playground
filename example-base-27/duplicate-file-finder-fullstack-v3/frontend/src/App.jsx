import {useEffect,useMemo,useState} from 'react';
import axios from 'axios';
import {
 Alert,Box,Button,Card,CardContent,Checkbox,Chip,CircularProgress,Container,
 Dialog,DialogActions,DialogContent,DialogTitle,Divider,Grid,IconButton,
 LinearProgress,Paper,Stack,Table,TableBody,TableCell,TableContainer,
 TableHead,TablePagination,TableRow,TextField,Typography
} from '@mui/material';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import SearchIcon from '@mui/icons-material/Search';
import StopIcon from '@mui/icons-material/Stop';
import DeleteIcon from '@mui/icons-material/Delete';
import DriveFileMoveIcon from '@mui/icons-material/DriveFileMove';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

const API='http://localhost:8080/api';
const fmt=b=>{if(b<1024)return b+' B';let u=['KB','MB','GB','TB'],i=-1,v=b;do{v/=1024;i++}while(v>=1024&&i<u.length-1);return v.toFixed(v>=100?0:2)+' '+u[i]};
const sortRows=(rows,key,dir)=>[...rows].sort((a,b)=>{
 let x=a[key],y=b[key]; if(typeof x==='string') {x=x.toLowerCase();y=y.toLowerCase()}
 return (x<y?-1:x>y?1:0)*(dir==='asc'?1:-1)
});

function App(){
 const [path,setPath]=useState('');
 const [ignoredFolders,setIgnoredFolders]=useState(['.git','node_modules','.idea','.mvn','venv','target']);
 const [ignoreInput,setIgnoreInput]=useState('');
 const [job,setJob]=useState(null),[loading,setLoading]=useState(false),[error,setError]=useState('');
 const [page,setPage]=useState(0),[rowsPerPage,setRowsPerPage]=useState(10);
 const [sort,setSort]=useState({key:'wastedBytes',dir:'desc'}),[selected,setSelected]=useState([]);
 const [folder,setFolder]=useState(''),[entries,setEntries]=useState([]);
 const [moveOpen,setMoveOpen]=useState(false),[target,setTarget]=useState('');
 const [folderLoading,setFolderLoading]=useState(false);

 const groups=useMemo(()=>sortRows(job?.groups||[],sort.key,sort.dir),[job,sort]);
 const visible=groups.slice(page*rowsPerPage,page*rowsPerPage+rowsPerPage);
 const duplicateFiles=(job?.groups||[]).reduce((n,g)=>n+g.files.length,0);
 const selectedFiles=(job?.groups||[]).flatMap(g=>g.files).filter(f=>selected.includes(f.path));

 const loadFolder=async p=>{
   if(!p)return;
   setFolderLoading(true);setError('');
   try{const r=await axios.get(`${API}/folders`,{params:{path:p}});setEntries(r.data);setFolder(p)}
   catch(e){setError(e.response?.data?.error||e.message)}finally{setFolderLoading(false)}
 };

 const start=async()=>{
   if(!path.trim())return setError('Enter a folder path.');
   setError('');setLoading(true);setJob(null);setSelected([]);setPage(0);
   try{
     const r=await axios.post(`${API}/duplicates/scan`,{
       rootPath:path.trim(),
       ignoredFolders
     });
     setJob({
       jobId:r.data.jobId,
       status:'QUEUED',
       percent:0,
       groups:[]
     });
   }catch(e){setError(e.response?.data?.error||e.message);setLoading(false)}
 };

 const addIgnoredFolder=()=>{
   const value=ignoreInput.trim().toLowerCase();
   if(!value)return;
   const values=value.split(',').map(x=>x.trim()).filter(Boolean);
   setIgnoredFolders(s=>[...new Set([...s,...values])]);
   setIgnoreInput('');
 };

 const removeIgnoredFolder=name=>{
   setIgnoredFolders(s=>s.filter(x=>x!==name));
 };

 useEffect(()=>{
   if(!job?.jobId||['COMPLETED','FAILED','CANCELLED'].includes(job.status))return;
   const id=setInterval(async()=>{
     try{const r=await axios.get(`${API}/duplicates/scan/${job.jobId}`);setJob(r.data);
       if(['COMPLETED','FAILED','CANCELLED'].includes(r.data.status)){setLoading(false);clearInterval(id)}
     }catch(e){setError(e.message);setLoading(false);clearInterval(id)}
   },700); return()=>clearInterval(id);
 },[job?.jobId,job?.status]);

 const cancel=async()=>{if(job?.jobId){await axios.post(`${API}/duplicates/scan/${job.jobId}/cancel`)}};

 const toggleSort=k=>setSort(s=>s.key===k?{key:k,dir:s.dir==='asc'?'desc':'asc'}:{key:k,dir:'asc'});
 const togglePath=p=>setSelected(s=>s.includes(p)?s.filter(x=>x!==p):[...s,p]);

 const deleteSelected=async()=>{
   if(!selected.length)return;
   if(!confirm(`Delete ${selected.length} selected file(s)?`))return;
   try{await axios.delete(`${API}/files`,{data:{rootPath:path,paths:selected}});setSelected([]);await refreshJob()}
   catch(e){setError(e.response?.data?.error||e.message)}
 };
 const moveSelected=async()=>{
   if(!target.trim())return;
   try{await axios.post(`${API}/files/move`,{targetDirectory:target},{params:{paths:selected}});setSelected([]);setMoveOpen(false);await refreshJob()}
   catch(e){setError(e.response?.data?.error||e.message)}
 };
 const refreshJob=async()=>{if(job?.jobId){const r=await axios.get(`${API}/duplicates/scan/${job.jobId}`);setJob(r.data)}};

 return <Container maxWidth="xl" sx={{py:3}}>
   <Stack spacing={2.5}>
    <Box><Typography variant="h4" fontWeight={800}>Duplicate File Finder v2</Typography>
    <Typography color="text.secondary">Async scan · live progress · cancellation · sorting · pagination · delete/move · folder browser</Typography></Box>

    <Paper sx={{p:2}}>
      <Typography variant="subtitle1" fontWeight={700}>Ignored folders</Typography>
      <Typography variant="body2" color="text.secondary" sx={{mb:1}}>
        Any directory whose name matches one of these values is skipped completely.
        Defaults: .git, node_modules, .idea
      </Typography>
      <Stack direction={{xs:'column',md:'row'}} spacing={1} sx={{mb:2}}>
        <TextField
          size="small"
          fullWidth
          label="Add folder name(s)"
          value={ignoreInput}
          onChange={e=>setIgnoreInput(e.target.value)}
          onKeyDown={e=>e.key==='Enter'&&addIgnoredFolder()}
          placeholder="target, build, .next"
        />
        <Button variant="outlined" onClick={addIgnoredFolder}>Add</Button>
      </Stack>
      <Stack direction="row" spacing={1} sx={{mb:2,flexWrap:'wrap'}}>
        {ignoredFolders.map(name=><Chip
          key={name}
          label={name}
          onDelete={()=>removeIgnoredFolder(name)}
          size="small"
          color="primary"
          variant="outlined"
          sx={{mb:.5}}
        />)}
      </Stack>
      <Divider sx={{mb:2}}/>
      <Stack direction={{xs:'column',md:'row'}} spacing={1.5}>
       <TextField fullWidth label="Folder to scan" value={path} onChange={e=>setPath(e.target.value)}
         onKeyDown={e=>e.key==='Enter'&&start()} placeholder="C:\Users\Prem\Downloads"/>
       <Button variant="contained" onClick={start} disabled={loading} startIcon={loading?<CircularProgress size={18} color="inherit"/>:<SearchIcon/>}>Scan</Button>
       <Button color="error" variant="outlined" onClick={cancel} disabled={!loading} startIcon={<StopIcon/>}>Cancel</Button>
      </Stack>
      {loading&&<Box sx={{mt:2}}><LinearProgress variant="determinate" value={job?.percent||0}/><Stack direction="row" justifyContent="space-between">
        <Typography variant="caption">{job?.status||'QUEUED'} · {job?.message}</Typography><Typography variant="caption">{job?.percent||0}%</Typography></Stack>
      </Box>}
    </Paper>

    {error&&<Alert severity="error">{error}</Alert>}

    {job&&<Grid container spacing={1.5}>
      {[['Groups',job.groups?.length||0],['Duplicate files',duplicateFiles],['Files discovered',job.filesDiscovered||0],['Files processed',job.filesProcessed||0]].map(([a,b])=>
       <Grid key={a} size={{xs:6,md:3}}><Card><CardContent><Typography color="text.secondary">{a}</Typography><Typography variant="h5" fontWeight={800}>{b}</Typography></CardContent></Card></Grid>)}
    </Grid>}

    {job?.status==='COMPLETED'&&<Stack direction={{xs:'column',md:'row'}} spacing={1}>
      <Button variant="contained" color="error" startIcon={<DeleteIcon/>} disabled={!selected.length} onClick={deleteSelected}>Delete selected ({selected.length})</Button>
      <Button variant="outlined" startIcon={<DriveFileMoveIcon/>} disabled={!selected.length} onClick={()=>setMoveOpen(true)}>Move selected</Button>
    </Stack>}

    {job?.groups?.length>0&&<Paper>
      <TableContainer>
       <Table>
        <TableHead><TableRow>
         <TableCell>Group</TableCell><TableCell onClick={()=>toggleSort('fileSize')} className="sortable">Size</TableCell>
         <TableCell onClick={()=>toggleSort('wastedBytes')} className="sortable">Wasted</TableCell>
         <TableCell>SHA-256</TableCell><TableCell>Files</TableCell>
        </TableRow></TableHead>
        <TableBody>{visible.map(g=><TableRow key={g.groupNumber}>
          <TableCell>#{g.groupNumber}</TableCell><TableCell>{fmt(g.fileSize)}</TableCell><TableCell>{fmt(g.wastedBytes)}</TableCell>
          <TableCell className="hash">{g.sha256}</TableCell>
          <TableCell><Stack>{g.files.map(f=><Stack key={f.path} direction="row" alignItems="center">
            <Checkbox size="small" checked={selected.includes(f.path)} onChange={()=>togglePath(f.path)}/>
            <Typography variant="body2" className="path">{f.path}</Typography>
          </Stack>)}</Stack></TableCell>
        </TableRow>)}</TableBody>
       </Table>
      </TableContainer>
      <TablePagination component="div" count={groups.length} page={page} rowsPerPage={rowsPerPage}
       onPageChange={(_,p)=>setPage(p)} onRowsPerPageChange={e=>{setRowsPerPage(+e.target.value);setPage(0)}}/>
    </Paper>}

    <Paper sx={{p:2}}>
      <Typography variant="h6" fontWeight={700}>Folder Browser</Typography>
      <Stack direction={{xs:'column',md:'row'}} spacing={1} sx={{mt:1}}>
       <TextField fullWidth size="small" label="Folder path" value={folder} onChange={e=>setFolder(e.target.value)}
        onKeyDown={e=>e.key==='Enter'&&loadFolder(folder)}/>
       <Button variant="outlined" onClick={()=>loadFolder(folder)} disabled={folderLoading}>Open</Button>
      </Stack>
      <Stack direction="row" spacing={1} sx={{mt:1,flexWrap:'wrap'}}>
       {folder&&<Button size="small" startIcon={<ArrowUpwardIcon/>} onClick={()=>loadFolder(folder.substring(0,Math.max(folder.lastIndexOf('\\'),folder.lastIndexOf('/'))))}>Parent</Button>}
       {entries.map(e=><Button key={e.path} size="small" variant="text" startIcon={e.directory?<FolderOpenIcon/>:undefined}
         onDoubleClick={()=>e.directory&&loadFolder(e.path)}>{e.name}{e.directory?' / ':` (${fmt(e.size)})`}</Button>)}
      </Stack>
      {folderLoading&&<LinearProgress sx={{mt:1}}/>}
    </Paper>
   </Stack>

   <Dialog open={moveOpen} onClose={()=>setMoveOpen(false)} fullWidth maxWidth="sm">
    <DialogTitle>Move selected files</DialogTitle>
    <DialogContent><TextField autoFocus fullWidth sx={{mt:1}} label="Target directory" value={target} onChange={e=>setTarget(e.target.value)} placeholder="C:\Duplicates"/></DialogContent>
    <DialogActions><Button onClick={()=>setMoveOpen(false)}>Cancel</Button><Button variant="contained" onClick={moveSelected}>Move</Button></DialogActions>
   </Dialog>
 </Container>
}
export default App;
