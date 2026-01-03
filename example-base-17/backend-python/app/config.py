from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PORT: int = 8000
    JWT_SECRET: str = "your_super_secret_jwt_key_change_this_in_production"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRATION_HOURS: int = 24
    MONGODB_URI: str = "mongodb://localhost:27017/ex_base_17_backend_python"
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()

