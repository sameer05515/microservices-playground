# iAgent Swing Client V2

A Java 17 Swing desktop client for invoking iAgent runtime **JavaServices and DbServices**.

## Requirements
- JDK 17+
- Maven 3.9+
- iAgent backend running on `http://localhost:8080` (or enter another URL)

## Run from command line

### Option 1: Maven
```powershell
mvn clean compile
mvn exec:java "-Dexec.mainClass=com.iagent.swingclient.Main"
```

### Option 2: Executable fat JAR
```powershell
mvn clean package
java -jar target/iagent-swing-client-2.0.0.jar
```

The V2 JAR bundles Jackson dependencies, so `java -jar` works without an external classpath.

## JavaService invocation
Select **JavaService**.

Example:
```text
POST http://localhost:8080/api/java-services/runtime/calculate-sum
```

Arguments, one per line:
```text
10
20
```

Request sent:
```json
{"arguments":[10,20]}
```

## DbService invocation
Select **DbService**.

Example:
```text
POST http://localhost:8080/api/db-services/runtime/select-query
```

For a DbService configured with:
```sql
SELECT * FROM todos WHERE completed = #status#;
```

enter:
```json
{
  "status": true
}
```

The client sends:
```json
{
  "parameters": {
    "status": true
  }
}
```

## V2 changes
- Added JavaService / DbService selector.
- Added DbService JSON parameter support.
- Added generic runtime HTTP invocation handling.
- Preserved asynchronous Swing execution using `SwingWorker`.
- Improved request parsing into a dedicated `RequestParser`.
- Added executable fat JAR using Maven Shade Plugin.
- JavaService invocation remains compatible with V1.
