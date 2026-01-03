from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field
from app.models.user import Role

class UpdateUserRequest(BaseModel):
    username: Optional[str] = Field(None, min_length=3, max_length=30)
    email: Optional[EmailStr] = None

class UpdateRoleRequest(BaseModel):
    role: Role

class ChangePasswordRequest(BaseModel):
    currentPassword: str
    newPassword: str = Field(..., min_length=6)

class DashboardResponse(BaseModel):
    message: str
    username: str
    role: str
    access: str

