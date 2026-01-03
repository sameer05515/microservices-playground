from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import connect_db, close_db
from app.routers import auth, admin, manager, user, health

app = FastAPI(
    title="RBAC Backend API",
    description="FastAPI REST API with Role-Based Access Control (RBAC)",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database lifecycle events
@app.on_event("startup")
async def startup_event():
    await connect_db()

@app.on_event("shutdown")
async def shutdown_event():
    await close_db()

# Include routers
app.include_router(health.router, prefix="/api/health", tags=["Health"])
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])
app.include_router(manager.router, prefix="/api/manage", tags=["Manager"])
app.include_router(user.router, prefix="/api/profile", tags=["User"])

@app.get("/")
async def root():
    return {
        "message": "RBAC Backend API",
        "version": "1.0.0",
        "endpoints": {
            "health": "/api/health",
            "auth": {
                "register": "POST /api/auth/register",
                "login": "POST /api/auth/login",
                "me": "GET /api/auth/me"
            },
            "admin": {
                "users": "GET /api/admin/users",
                "dashboard": "GET /api/admin/dashboard"
            },
            "manager": {
                "users": "GET /api/manage/users",
                "dashboard": "GET /api/manage/dashboard"
            },
            "user": {
                "profile": "GET /api/profile/profile",
                "dashboard": "GET /api/profile/dashboard"
            }
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=settings.PORT)

