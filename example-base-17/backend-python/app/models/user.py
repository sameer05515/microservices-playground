from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field
from enum import Enum

class Role(str, Enum):
    ADMIN = "ADMIN"
    MANAGER = "MANAGER"
    USER = "USER"

class User(BaseModel):
    id: Optional[str] = None
    username: str = Field(..., min_length=3, max_length=30)
    email: EmailStr
    password: str = Field(..., min_length=6)
    role: Role = Role.USER
    enabled: bool = True
    createdAt: Optional[datetime] = None
    updatedAt: Optional[datetime] = None

    class Config:
        json_schema_extra = {
            "example": {
                "username": "jane_doe",
                "email": "jane@example.com",
                "password": "password123",
                "role": "USER"
            }
        }

class UserInDB(User):
    id: str
    createdAt: datetime
    updatedAt: Optional[datetime] = None

class UserResponse(BaseModel):
    id: str
    username: str
    email: str
    role: Role
    createdAt: Optional[datetime] = None

    class Config:
        from_attributes = True

