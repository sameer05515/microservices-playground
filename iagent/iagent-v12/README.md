
## V9 DbService enhancements

- **Test Service before save:** a DbService query must execute successfully against the selected connection before the Save button becomes enabled. Changing the connection, query, or parameter values invalidates the previous test.
- **Parameterized SQL:** use placeholders such as `#status#` in a query. Example:

```sql
SELECT * FROM todos
WHERE completed = #status#;
```

  iAgent converts placeholders to JDBC `?` parameters and executes them with `PreparedStatement`.
- **DbService Details:** every saved DbService has a Details action showing the saved connection name, query, and parameter placeholders.
- **Run Query:** saved parameterized DbServices prompt for their parameter values before execution.
- Parameter values entered for Test Service are used for execution testing and are **not persisted** with the DbService.

# iAgent V9

Java Integration & Dynamic Service Platform built with Spring Boot, MongoDB and React/Vite.

## V8 features

### Existing V7 features
- Upload JARs and persist metadata in MongoDB.
- Discover public classes and public methods from uploaded JARs.
- Create and test dynamic JavaServices.
- Expose JavaServices through runtime REST endpoints.
- Track JavaService execution history, request arguments, response/error and execution time.
- Enforce unique JavaService names and endpoint paths.

### New V8 features

#### Add Connection
- Add a database connection with a custom JDBC URL, username and password.
- **Test Connection** validates the database before saving it.
- Saving a connection persists its metadata in MongoDB.
- Password is not returned by the API listing response.
- MySQL and PostgreSQL JDBC drivers are included in the backend.

API:
- `POST /api/db-connections/test`
- `POST /api/db-connections`
- `GET /api/db-connections`

Example request:
```json
{
  "name": "customer-db",
  "jdbcUrl": "jdbc:mysql://localhost:3306/customerdb",
  "username": "root",
  "password": "secret"
}
```

#### DbServices
- Create a reusable DbService with a name, saved connection and SQL query.
- DbService definition is persisted in MongoDB.
- Run a saved DbService against its configured target database.
- Result-set queries return columns and rows; update queries return update count.

API:
- `POST /api/db-services`
- `GET /api/db-services`
- `POST /api/db-services/{serviceId}/execute`

## Important security note
This V8 version stores the database password in MongoDB so that the saved connection can be executed later. For production, encrypt the password using a managed secret/key system and add authentication/authorization before exposing these APIs. DbService SQL is intentionally powerful; do not expose it to untrusted users without access controls.

## Run

### MongoDB
```bash
cd backend
docker compose up -d
```

### Backend
```bash
cd backend
mvn spring-boot:run
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend: `http://localhost:5173`
Backend: `http://localhost:8080`
MongoDB: `mongodb://localhost:27017/iagent`

## JDBC support
The backend includes MySQL and PostgreSQL JDBC drivers. The JDBC URL determines which driver is used. For another database, add that vendor's JDBC driver dependency to `backend/pom.xml`.

### V10 MongoDB startup fix

If upgrading from an earlier V8/V9 database, old `db_services` documents may contain `endpointPath: null`. MongoDB cannot create a normal unique index on that field when multiple existing documents contain null. V10 disables automatic MongoDB index creation for this reason and performs DbService name/endpoint uniqueness validation in the application layer. Existing DbService data is therefore preserved.

## V11 - Stored Procedure Services

V11 adds Stored Procedure Services on top of V10.

### Features

- Configure a stored procedure against an existing DB Connection.
- Configure REST service name and endpoint path.
- Configure parameters with `IN`, `OUT`, and `INOUT` modes.
- Configure JDBC SQL types such as `VARCHAR`, `INTEGER`, `BIGINT`, `DECIMAL`, etc.
- Test the stored procedure before saving it.
- Save stored procedure metadata in MongoDB.
- Execute a saved procedure directly from the UI.
- Runtime endpoint:

```text
POST http://localhost:8080/api/stored-procedure-services/runtime/{endpointPath}
```

Example:

```text
POST http://localhost:8080/api/stored-procedure-services/runtime/get-todos
Content-Type: application/json

{"status": true}
```

- Stored procedure execution history is stored in MongoDB and exposed in the `SP Execution History` UI.

### APIs

```text
GET  /api/stored-procedure-services
GET  /api/stored-procedure-services/{id}
POST /api/stored-procedure-services/test
POST /api/stored-procedure-services
POST /api/stored-procedure-services/{id}/execute
POST /api/stored-procedure-services/runtime/{path}
GET  /api/stored-procedure-services/execution-history
GET  /api/stored-procedure-services/{id}/execution-history
```

### Example procedure configuration

Procedure:

```text
get_todos
```

Parameters:

| Name | Mode | SQL Type |
|---|---|---|
| status | IN | BOOLEAN |
| total | OUT | INTEGER |

The test/save flow executes the procedure against the selected target database before allowing the service to be persisted.

## V12 - Code Optimization & Modularization

V12 keeps the V11 functionality unchanged while improving maintainability:

- React UI split into meaningful component files instead of one large `App.jsx`.
- Shared display/type-conversion helpers moved to `utils.js`.
- JavaService execution logic split into:
  - `JavaServiceExecutor` — orchestration and reflection execution.
  - `JavaTypeResolver` — Java parameter type resolution.
  - `JavaServiceExecutionLogger` — execution history persistence.
- Frontend package version updated to `0.0.12`.
- V11 Stored Procedure, DbService and JavaService functionality is preserved.

### V12 frontend structure

```text
frontend/src/
├── App.jsx
├── Connections.jsx
├── DbServices.jsx
├── Services.jsx
├── StoredProcedures.jsx
├── History.jsx
├── DbHistory.jsx
├── StoredProcedureHistory.jsx
├── Guide.jsx
├── Empty.jsx
├── utils.js
└── api.js
```

### V12 JavaService structure

```text
backend/src/main/java/com/iagent/javaservice/service/
├── JavaServiceExecutor.java
├── JavaServiceManager.java
├── JavaTypeResolver.java
└── JavaServiceExecutionLogger.java
```
