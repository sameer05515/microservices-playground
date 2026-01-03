from typing import Optional, List
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from app.models.user import User, Role
from app.utils.password import hash_password, verify_password

class UserRepository:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        self.collection = db.users
    
    async def create(self, user: User) -> dict:
        user_dict = user.model_dump(exclude={"id"})
        user_dict["password"] = hash_password(user_dict["password"])
        user_dict["createdAt"] = datetime.utcnow()
        user_dict["updatedAt"] = None
        
        result = await self.collection.insert_one(user_dict)
        user_dict["_id"] = result.inserted_id
        user_dict["id"] = str(user_dict["_id"])
        return user_dict
    
    async def find_by_id(self, user_id: str) -> Optional[dict]:
        try:
            user = await self.collection.find_one({"_id": ObjectId(user_id)})
            if user:
                user["id"] = str(user["_id"])
            return user
        except:
            return None
    
    async def find_by_username(self, username: str) -> Optional[dict]:
        user = await self.collection.find_one({"username": username})
        if user:
            user["id"] = str(user["_id"])
        return user
    
    async def find_by_email(self, email: str) -> Optional[dict]:
        user = await self.collection.find_one({"email": email.lower()})
        if user:
            user["id"] = str(user["_id"])
        return user
    
    async def exists_by_username(self, username: str) -> bool:
        user = await self.collection.find_one({"username": username})
        return user is not None
    
    async def exists_by_email(self, email: str) -> bool:
        user = await self.collection.find_one({"email": email.lower()})
        return user is not None
    
    async def find_all(self) -> List[dict]:
        cursor = self.collection.find({})
        users = []
        async for user in cursor:
            user["id"] = str(user["_id"])
            users.append(user)
        return users
    
    async def find_by_role(self, role: Role) -> List[dict]:
        cursor = self.collection.find({"role": role.value})
        users = []
        async for user in cursor:
            user["id"] = str(user["_id"])
            users.append(user)
        return users
    
    async def update_role(self, user_id: str, role: Role) -> Optional[dict]:
        try:
            result = await self.collection.update_one(
                {"_id": ObjectId(user_id)},
                {"$set": {"role": role.value, "updatedAt": datetime.utcnow()}}
            )
            if result.modified_count > 0:
                return await self.find_by_id(user_id)
            return None
        except:
            return None
    
    async def update_user(self, user_id: str, username: Optional[str] = None, email: Optional[str] = None) -> Optional[dict]:
        try:
            update_data = {"updatedAt": datetime.utcnow()}
            if username:
                update_data["username"] = username
            if email:
                update_data["email"] = email.lower()
            
            result = await self.collection.update_one(
                {"_id": ObjectId(user_id)},
                {"$set": update_data}
            )
            if result.modified_count > 0:
                return await self.find_by_id(user_id)
            return None
        except:
            return None
    
    async def update_password(self, user_id: str, new_password: str) -> bool:
        try:
            result = await self.collection.update_one(
                {"_id": ObjectId(user_id)},
                {"$set": {"password": hash_password(new_password), "updatedAt": datetime.utcnow()}}
            )
            return result.modified_count > 0
        except:
            return False
    
    async def delete(self, user_id: str) -> bool:
        try:
            result = await self.collection.delete_one({"_id": ObjectId(user_id)})
            return result.deleted_count > 0
        except:
            return False
    
    async def verify_password(self, user: dict, password: str) -> bool:
        return verify_password(password, user["password"])

