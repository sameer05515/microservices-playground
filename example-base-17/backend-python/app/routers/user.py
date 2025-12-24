from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.user import UpdateUserRequest, ChangePasswordRequest, DashboardResponse
from app.repositories.user_repository import UserRepository
from app.database import get_database
from app.dependencies import get_current_user
from motor.motor_asyncio import AsyncIOMotorDatabase

router = APIRouter()

@router.get("/profile")
async def get_profile(
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    user_repo = UserRepository(db)
    user = await user_repo.find_by_id(current_user["id"])
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return {
        "message": "Profile retrieved successfully",
        "user": {
            "id": user["id"],
            "username": user["username"],
            "email": user["email"],
            "role": user["role"],
            "createdAt": user.get("createdAt")
        }
    }

@router.patch("/profile")
async def update_profile(
    request: UpdateUserRequest,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    user_repo = UserRepository(db)
    
    # Check if username or email already exists (if being changed)
    if request.username:
        existing = await user_repo.find_by_username(request.username)
        if existing and existing["id"] != current_user["id"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already exists"
            )
    
    if request.email:
        existing = await user_repo.find_by_email(request.email)
        if existing and existing["id"] != current_user["id"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already exists"
            )
    
    updated_user = await user_repo.update_user(
        current_user["id"],
        username=request.username,
        email=request.email
    )
    
    if not updated_user:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update profile"
        )
    
    return {
        "message": "Profile updated successfully",
        "user": {
            "id": updated_user["id"],
            "username": updated_user["username"],
            "email": updated_user["email"],
            "role": updated_user["role"]
        }
    }

@router.patch("/password")
async def change_password(
    request: ChangePasswordRequest,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    user_repo = UserRepository(db)
    user = await user_repo.find_by_id(current_user["id"])
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Verify current password
    if not await user_repo.verify_password(user, request.currentPassword):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect"
        )
    
    # Update password
    success = await user_repo.update_password(current_user["id"], request.newPassword)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to change password"
        )
    
    return {
        "message": "Password changed successfully"
    }

@router.get("/dashboard", response_model=DashboardResponse)
async def get_dashboard(current_user: dict = Depends(get_current_user)):
    return DashboardResponse(
        message="Welcome to User Dashboard",
        username=current_user["username"],
        role=current_user["role"],
        access="Self-scope resources only"
    )

