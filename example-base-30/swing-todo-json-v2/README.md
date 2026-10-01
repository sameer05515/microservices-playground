# Swing Todo JSON V2

Modern Java Swing Todo CRUD application with JSON persistence.

## V2 Features

- Dark modern UI
- Add / Update / Delete
- Mark completed / pending
- Search by title or description
- Filter: ALL / PENDING / COMPLETED
- Priority: LOW / MEDIUM / HIGH
- Due date
- JSON persistence
- Maven project
- Java 17+

## Run

```powershell
mvn clean compile
mvn exec:java
```

Data is stored in:

```text
todos.json
```

## Build

```powershell
mvn clean package
```

## JSON example

```json
[
  {
    "id": 1,
    "title": "Learn Spring Boot",
    "description": "Revise Spring Boot",
    "completed": false,
    "priority": "HIGH",
    "dueDate": "2026-10-10"
  }
]
```
