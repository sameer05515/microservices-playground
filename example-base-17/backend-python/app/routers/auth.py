from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.auth import RegisterRequest, LoginRequest, AuthResponse
from app.models.user import User, Role
from app.repositories.user_repository import UserRepository
from app.database import get_database
from app.utils.jwt import generate_token
from app.dependencies import get_current_user
from motor.motor_asyncio import AsyncIOMotorDatabase

router = APIRouter()

@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
async def register(request: RegisterRequest, db: AsyncIOMotorDatabase = Depends(get_database)):
    user_repo = UserRepository(db)
    
    # Check if user already exists
    if await user_repo.exists_by_username(request.username):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User already exists with this username"
        )
    
    if await user_repo.exists_by_email(request.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User already exists with this email"
        )
    
    # Create user
    user = User(
        username=request.username,
        email=request.email,
        password=request.password,
        role=request.role or Role.USER
    )
    
    user_dict = await user_repo.create(user)
    
    # Generate token
    token = generate_token(
        user_dict["id"],
        user_dict["username"],
        user_dict["email"],
        user_dict["role"]
    )
    
    return AuthResponse(
        message="User registered successfully",
        username=user_dict["username"],
        email=user_dict["email"],
        role=user_dict["role"],
        success=True,
        token=token
    )

@router.post("/login", response_model=AuthResponse)
async def login(request: LoginRequest, db: AsyncIOMotorDatabase = Depends(get_database)):
    user_repo = UserRepository(db)
    
    # Find user by email
    user = await user_repo.find_by_email(request.email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    # Verify password
    if not await user_repo.verify_password(user, request.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    # Check if user has role assigned
    if not user.get("role"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User role not assigned. Please contact administrator."
        )
    
    # Generate token
    token = generate_token(
        user["id"],
        user["username"],
        user["email"],
        user["role"]
    )
    
    return AuthResponse(
        message="Login successful",
        username=user["username"],
        email=user["email"],
        role=user["role"],
        success=True,
        token=token
    )

@router.get("/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    return {
        "user": {
            "id": current_user["id"],
            "username": current_user["username"],
            "email": current_user["email"],
            "role": current_user["role"]
        }
    }

