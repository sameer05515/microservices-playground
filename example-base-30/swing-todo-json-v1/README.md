# Swing Todo JSON - V1

A simple Java Swing Todo CRUD application.

## Features

- Add Todo
- Update Todo
- Delete Todo
- Toggle Completed/Pending
- Refresh
- JSON file persistence
- Clean separation:
  - Model
  - Repository
  - Service
  - UI

## Requirements

- Java 17+
- Maven 3.9+

## Run

```powershell
mvn clean compile
mvn exec:java
```

The application creates:

```text
todos.json
```

in the application's current working directory.

## JSON example

```json
[
  {
    "id": 1,
    "title": "Learn Java",
    "description": "Practice Collections",
    "completed": false
  }
]
```

## Project Structure

```text
src/main/java/com/prem/todo
├── Main.java
├── model
│   └── Todo.java
├── repository
│   └── TodoRepository.java
├── service
│   └── TodoService.java
└── ui
    └── TodoFrame.java
```
