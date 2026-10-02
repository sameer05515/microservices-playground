# Swing Ques-Ans UI

Java Swing desktop client for the `ques-ans-api` Spring Boot backend.

## Backend

Default backend URL:

```text
http://localhost:8080
```

The backend must expose:

```text
GET/POST/PUT/DELETE /api/questions
GET/POST/PUT/DELETE /api/tags
GET /api/export
```

## Run

```powershell
mvn clean package
mvn exec:java -Dexec.mainClass="com.prem.quesui.Main"
```

Or:

```powershell
java -jar target/swing-ques-ans-ui-1.0.0.jar
```

## Features

### Questions
- Search questions
- Pagination
- Create
- Edit
- Delete
- Multiple answers
- Tag assignment

### Tags
- List
- Create
- Edit
- Delete

### Export
- Downloads `/api/export`
- Save as `question-bank.json`

## API base URL

Use **Settings -> API Base URL** from the application menu to change the backend URL.

Example:

```text
http://localhost:8080
```
