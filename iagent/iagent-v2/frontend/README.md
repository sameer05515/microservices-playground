# iAgent V2

A recreation of the iAgent project, currently focused on JAR-based Java service discovery.

## V2 Flow

```text
Upload JAR
    |
    +--> Save physical JAR to server
    |
    +--> Save JAR definition to MongoDB
    |
    v
Uploaded JARs
    |
    | click JAR
    v
Public Classes
    |
    | click Class
    v
Public Methods
```

## V2 Features

### Backend

- Java 17
- Spring Boot 3.3.6
- MongoDB running from Docker
- JAR upload and server-side storage
- MongoDB JAR metadata
- Generated JAR ID
- Duplicate original JAR filename restriction
- Public class discovery
- Public method discovery
- Central CORS configuration
- Central API error handling

### Frontend

- React + Vite
- Axios
- Upload JAR page
- Uploaded JARs page
- JAR → Class → Method navigation
- Upload progress
- Duplicate upload error display
- Responsive UI

## Directory Structure

```text
iagent-v2/
├── README.md
├── backend/
│   ├── pom.xml
│   ├── docker-compose.yml
│   ├── README.md
│   └── src/
└── frontend/
    ├── package.json
    ├── vite.config.js
    ├── README.md
    └── src/
```

## Prerequisites

- JDK 17+
- Maven 3.9+
- Node.js 18+
- npm
- Docker Desktop

## Run Backend

```bash
cd backend
docker compose up -d
mvn spring-boot:run
```

Backend: `http://localhost:8080`

## Run Frontend

In another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend: `http://localhost:5173`

## API Summary

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/jars` | Upload a JAR |
| GET | `/api/jars` | List uploaded JARs |
| GET | `/api/jars/{jarId}/classes` | Get public classes |
| GET | `/api/jars/{jarId}/methods?className=...` | Get public methods |

## Duplicate File Name

If `arithmetic-service.jar` is already uploaded, another upload with the same original file name returns:

```text
HTTP 409 Conflict
```

The restriction is backed by a unique MongoDB index, not only by frontend validation.

## Example UI Flow

```text
Uploaded JARs
└── arithmetic-service.jar
      |
      └── com.example.service.ArithmeticService
              |
              ├── division(int, int)
              ├── multiplication(int, int)
              ├── subtraction(int, int)
              └── sum(int, int)
```

## Next Step

The natural next iAgent feature is **JavaService creation**: select a discovered class and method, configure the service definition, and persist it.
