from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings
from typing import Optional

client: Optional[AsyncIOMotorClient] = None
database = None

async def connect_db():
    global client, database
    client = AsyncIOMotorClient(settings.MONGODB_URI)
    # Extract database name from URI or use default
    db_name = settings.MONGODB_URI.split("/")[-1].split("?")[0]
    database = client[db_name]
    print(f"✅ Connected to MongoDB: {settings.MONGODB_URI}")

async def close_db():
    global client
    if client:
        client.close()
        print("✅ MongoDB connection closed")

def get_database():
    return database
