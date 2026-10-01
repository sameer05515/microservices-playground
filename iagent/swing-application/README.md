# iAgent Swing Client V1

A Java Swing desktop client for invoking iAgent runtime JavaService REST endpoints.

## Requirements
- JDK 17+
- Maven 3.9+
- iAgent backend running (default example: `http://localhost:8080`)

## Run
```bash
mvn clean package
java -jar target/iagent-swing-client-1.0.0.jar

mvn exec:java "-Dexec.mainClass=com.iagent.swingclient.Main"
```

## Example
For an iAgent runtime service:

`POST http://localhost:8080/api/java-services/runtime/calculate-sum`

Enter arguments one per line:

```text
10
20
```

The client sends:

```json
{"arguments":[10,20]}
```

## Project structure
```text
src/main/java/com/iagent/swingclient/
├── Main.java
├── model/InvocationRequest.java
├── service/IagentApiClient.java
└── ui/MainFrame.java
```

## Design notes
- Uses Java 17 `java.net.http.HttpClient`.
- Uses Jackson for JSON serialization/deserialization.
- Uses `SwingWorker` so the Swing Event Dispatch Thread is not blocked during HTTP calls.
- V1 focuses on invoking an existing runtime JavaService. Service discovery, authentication, dynamic parameter forms and execution history can be added in later versions.
