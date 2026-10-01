import { useState } from 'react'
import { createStoredProcedure, executeStoredProcedure, testStoredProcedure } from './api'
import Empty from './Empty'

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

export default StoredProcedures
