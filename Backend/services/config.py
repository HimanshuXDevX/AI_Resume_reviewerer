from typing import List
from pydantic_settings import BaseSettings
from pydantic import field_validator

class Settings(BaseSettings):
    PORT: str
    API_PREFIX: str = "/api"
    DEBUG: bool = False
    GEMINI_API_KEY: str
    ALLOWED_ORIGINS: str = ""
    REDIS_URL: str
    CLERK_SECRET_KEY : str
    JWT_SECRET_KEY : str
    MONGO_URI: str
    DB_NAME: str
    CLOUDINARY_CLOUD_NAME: str
    CLOUDINARY_API_KEY: str
    CLOUDINARY_API_SECRET: str
    
    @field_validator("ALLOWED_ORIGINS")
    def parse_allowed_origins(cls, v: str) -> List[str]:
        return v.split(",") if v else []
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True

settings = Settings()