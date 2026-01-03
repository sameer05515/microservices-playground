from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.user import UpdateUserRequest, DashboardResponse
from app.models.user import Role
from app.repositories.user_repository import UserRepository
from app.database import get_database
from app.dependencies import allow_roles
from motor.motor_asyncio import AsyncIOMotorDatabase

router = APIRouter()

@router.get("/users")
async def get_users(
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: dict = Depends(allow_roles("ADMIN", "MANAGER"))
):
    user_repo = UserRepository(db)
    # Managers can only see USER role users
    users = await user_repo.find_by_role(Role.USER)
    
    user_responses = []
    for user in users[:50]:  # Limit results
        user_responses.append({
            "id": user["id"],
            "username": user["username"],
            "email": user["email"],
            "role": user["role"],
            "createdAt": user.get("createdAt")
        })
    
    return {
        "message": "Limited users retrieved successfully",
        "count": len(user_responses),
        "users": user_responses
    }

@router.patch("/users/{user_id}")
async def update_user(
    user_id: str,
    request: UpdateUserRequest,
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: dict = Depends(allow_roles("ADMIN", "MANAGER"))
):
    user_repo = UserRepository(db)
    user = await user_repo.find_by_id(user_id)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Managers cannot update ADMIN or MANAGER accounts
    if user["role"] in ["ADMIN", "MANAGER"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden: Cannot update admin or manager accounts"
        )
    
    updated_user = await user_repo.update_user(
        user_id,
        username=request.username,
        email=request.email
    )
    
    if not updated_user:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update user"
        )
    
    return {
        "message": "User updated successfully",
        "user": {
            "id": updated_user["id"],
            "username": updated_user["username"],
            "email": updated_user["email"],
            "role": updated_user["role"]
        }
    }

@router.get("/dashboard", response_model=DashboardResponse)
async def get_dashboard(current_user: dict = Depends(allow_roles("ADMIN", "MANAGER"))):
    return DashboardResponse(
        message="Welcome to Manager Dashboard",
        username=current_user["username"],
        role=current_user["role"],
        access="Limited resource access - can read/update USER accounts only"
    )

