from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field
from app.models.user import Role

class RegisterRequest(BaseModel):
    username: str = Field(..., min_length=3, max_length=30)
    email: EmailStr
    password: str = Field(..., min_length=6)
    role: Optional[Role] = Role.USER

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class AuthResponse(BaseModel):
    message: str
    username: Optional[str] = None
    email: Optional[str] = None
    role: Optional[str] = None
    success: bool
    token: Optional[str] = None

class UserResponse(BaseModel):
    id: str
    username: str
    email: str
    role: str
    createdAt: Optional[datetime] = None
