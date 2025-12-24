from fastapi import APIRouter
from datetime import datetime

router = APIRouter()

@router.get("")
async def health():
    return {
        "status": "OK",
        "message": "RBAC Backend API is running",
        "timestamp": datetime.utcnow().isoformat()
    }

