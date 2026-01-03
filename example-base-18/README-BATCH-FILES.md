# Batch Files Guide

This folder contains Windows batch (.bat) files to help you run the application easily.

## Available Batch Files

### 1. `check-prerequisites.bat`
**Purpose**: Check if all required tools are installed

**What it checks**:
- Java 21+
- Maven 3.6+
- Node.js 18+
- npm
- MongoDB (warning if not found)

**Usage**: Double-click or run from command prompt
```cmd
check-prerequisites.bat
```

---

### 2. `install-dependencies.bat`
**Purpose**: Install all dependencies for both backend and frontend

**What it does**:
- Installs Maven dependencies for Spring Boot backend
- Installs npm packages for Next.js frontend

**Usage**: Double-click or run from command prompt
```cmd
install-dependencies.bat
```

**Note**: Run this first before starting the application if dependencies are not installed.

---

### 3. `start-backend.bat`
**Purpose**: Start only the Spring Boot backend server

**What it does**:
- Checks if Maven is installed
- Starts the backend on port 8080
- Opens Swagger UI at http://localhost:8080/swagger-ui.html

**Usage**: Double-click or run from command prompt
```cmd
start-backend.bat
```

**Note**: Keep this window open while the backend is running.

---

### 4. `start-frontend.bat`
**Purpose**: Start only the Next.js frontend server

**What it does**:
- Checks if Node.js is installed
- Installs dependencies if node_modules doesn't exist
- Starts the frontend on port 3000

**Usage**: Double-click or run from command prompt
```cmd
start-frontend.bat
```

**Note**: Keep this window open while the frontend is running.

---

### 5. `start-all.bat`
**Purpose**: Start both backend and frontend servers simultaneously

**What it does**:
- Opens a new window for the backend server
- Opens a new window for the frontend server
- Both servers run in separate command windows

**Usage**: Double-click or run from command prompt
```cmd
start-all.bat
```

**Note**: 
- Close the individual command windows to stop each server
- Backend starts first, then frontend after 5 seconds

---

### 6. `build-all.bat`
**Purpose**: Build both backend and frontend for production

**What it does**:
- Builds Spring Boot JAR file
- Builds Next.js production bundle

**Usage**: Double-click or run from command prompt
```cmd
build-all.bat
```

**Output**:
- Backend JAR: `backend-spring-boot\target\backend-spring-boot-*.jar`
- Frontend build: `frontend-nextjs\.next`

---

## Quick Start Guide

### First Time Setup

1. **Check Prerequisites**
   ```cmd
   check-prerequisites.bat
   ```

2. **Install Dependencies**
   ```cmd
   install-dependencies.bat
   ```

3. **Start MongoDB** (if not running as a service)
   ```cmd
   mongod
   ```

4. **Start Application**
   ```cmd
   start-all.bat
   ```

### Daily Usage

**Option 1: Start Everything Together**
```cmd
start-all.bat
```

**Option 2: Start Separately**
- Open one terminal: `start-backend.bat`
- Open another terminal: `start-frontend.bat`

---

## Troubleshooting

### Backend won't start
- Check if MongoDB is running: `mongod` or check MongoDB service
- Check if port 8080 is available
- Verify Java and Maven are installed: `check-prerequisites.bat`

### Frontend won't start
- Check if port 3000 is available
- Try installing dependencies: `install-dependencies.bat`
- Verify Node.js and npm are installed: `check-prerequisites.bat`

### Dependencies not installing
- Check internet connection
- Try running as Administrator
- Clear npm cache: `npm cache clean --force`
- Clear Maven cache: `mvn dependency:purge-local-repository`

---

## Manual Commands (Alternative)

If batch files don't work, you can run commands manually:

### Backend
```cmd
cd backend-spring-boot
mvn spring-boot:run
```

### Frontend
```cmd
cd frontend-nextjs
npm install
npm run dev
```

---

## Notes

- All batch files pause at the end so you can see any error messages
- Make sure MongoDB is running before starting the backend
- Backend must be running before frontend can connect to it
- Use `Ctrl+C` to stop servers running in command windows

