import { useState } from 'react'
import Empty from './Empty'
import { convertArg } from './utils'

function Services({ services, onRefresh, onExecute }) {
  const [test, setTest] = useState(null); const [args, setArgs] = useState([])
  const open = s => { setTest(s); setArgs((s.parameters || []).map(() => '')) }
  return <section className="card"><div className="section-title"><div><h1>JavaServices</h1><p>Configured dynamic REST services.</p></div><button onClick={onRefresh}>Refresh</button></div><div className="service-grid">{services.map(s => <article className="service-card" key={s.id}><div className="service-head"><strong>{s.serviceName}</strong><span className={s.enabled ? 'badge ok' : 'badge'}>{s.enabled ? 'ENABLED' : 'DISABLED'}</span></div><div className="endpoint">POST {s.endpointPath}</div><div className="muted">{s.className}.{s.methodName}()</div><button className="primary small" onClick={() => open(s)}>Test Service</button></article>)}{!services.length && <Empty text="No JavaServices created yet." />}</div>
    {test && <div className="modal-backdrop"><div className="modal"><div className="modal-head"><div><h2>Test {test.serviceName}</h2><p>POST {test.endpointPath}</p></div><button onClick={() => setTest(null)}>×</button></div>{(test.parameters || []).map((p,i) => <label key={i}>{p.name} <small>{p.type}</small><input value={args[i] ?? ''} onChange={e => setArgs(a => a.map((x,j) => j === i ? e.target.value : x))} placeholder={p.type} /></label>)}{!test.parameters?.length && <div className="info-box">This method has no arguments.</div>}<div className="actions"><button onClick={() => setTest(null)}>Cancel</button><button className="primary" onClick={async () => { const converted=(test.parameters||[]).map((p,i)=>convertArg(args[i],p.type)); await onExecute(test,converted); setTest(null) }}>Execute</button></div></div></div>}
  </section>
}

export default Services
