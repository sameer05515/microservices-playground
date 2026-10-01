function Guide() { return <section className="card guide"><h1>How to Invoke iAgent Services</h1><p>V12 supports JavaServices, DbServices and Stored Procedure Services with runtime REST endpoints and execution history.</p><h2>JavaService</h2><pre>{`POST http://localhost:8080/api/java-services/runtime/calculate-sum
Content-Type: application/json

{"arguments":[10,20]}`}</pre><h2>DbService Runtime API</h2><p>When a DbService is saved with endpoint <code>/select-query</code>, invoke it using:</p><pre>{`POST http://localhost:8080/api/db-services/runtime/select-query
Content-Type: application/json

{"status": true}`}</pre><p>The JSON keys must match the <code>#parameter#</code> placeholders in the SQL. For example:</p><pre>{`SELECT * FROM todos
WHERE completed = #status#;`}</pre><p>For a query without parameters, send an empty JSON object <code>{}</code>.</p><h2>Stored Procedure Service</h2><p>Create a Stored Procedure Service by selecting a saved database connection, procedure name, endpoint and parameters. Parameters support <code>IN</code>, <code>OUT</code> and <code>INOUT</code> modes.</p><pre>{`POST http://localhost:8080/api/stored-procedure-services/runtime/get-todos
Content-Type: application/json

{"status": true}`}</pre><p>The procedure is tested before it can be saved. For OUT/INOUT parameters, configure the SQL type such as <code>INTEGER</code>, <code>VARCHAR</code> or <code>DECIMAL</code>. Runtime executions are recorded in <b>SP Execution History</b>.</p><h2>Execution History</h2><p>Every saved DbService runtime execution is recorded in MongoDB and displayed in <b>DbService History</b>, including request parameters, query, response, status, execution time and timestamp.</p></section> }

export default Guide
