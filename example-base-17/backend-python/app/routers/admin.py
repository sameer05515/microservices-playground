from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from app.schemas.user import UpdateRoleRequest, DashboardResponse
from app.schemas.auth import UserResponse
from app.models.user import Role
from app.repositories.user_repository import UserRepository
from app.database import get_database
from app.dependencies import allow_roles
from motor.motor_asyncio import AsyncIOMotorDatabase

router = APIRouter()

@router.get("/users")
async def get_users(
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: dict = Depends(allow_roles("ADMIN"))
):
    user_repo = UserRepository(db)
    users = await user_repo.find_all()
    
    user_responses = []
    for user in users:
        user_responses.append({
            "id": user["id"],
            "username": user["username"],
            "email": user["email"],
            "role": user["role"],
            "createdAt": user.get("createdAt")
        })
    
    return {
        "message": "Users retrieved successfully",
        "count": len(user_responses),
        "users": user_responses
    }

@router.get("/users/{user_id}")
async def get_user(
    user_id: str,
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: dict = Depends(allow_roles("ADMIN"))
):
    user_repo = UserRepository(db)
    user = await user_repo.find_by_id(user_id)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return {
        "message": "User retrieved successfully",
        "user": {
            "id": user["id"],
            "username": user["username"],
            "email": user["email"],
            "role": user["role"],
            "createdAt": user.get("createdAt")
        }
    }

@router.patch("/users/{user_id}/role")
async def update_user_role(
    user_id: str,
    request: UpdateRoleRequest,
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: dict = Depends(allow_roles("ADMIN"))
):
    user_repo = UserRepository(db)
    user = await user_repo.update_role(user_id, request.role)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return {
        "message": "User role updated successfully",
        "user": {
            "id": user["id"],
            "username": user["username"],
            "email": user["email"],
            "role": user["role"]
        }
    }

@router.delete("/users/{user_id}")
async def delete_user(
    user_id: str,
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: dict = Depends(allow_roles("ADMIN"))
):
    user_repo = UserRepository(db)
    deleted = await user_repo.delete(user_id)
    
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return {
        "message": "User deleted successfully"
    }

@router.get("/dashboard", response_model=DashboardResponse)
async def get_dashboard(current_user: dict = Depends(allow_roles("ADMIN"))):
    return DashboardResponse(
        message="Welcome to Admin Dashboard",
        username=current_user["username"],
        role=current_user["role"],
        access="Full system access"
    )

