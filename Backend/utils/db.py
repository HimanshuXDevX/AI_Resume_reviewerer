import os
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("DB_NAME")

from models.user import User

client = AsyncIOMotorClient(MONGO_URI)
db = client[DB_NAME]

async def init_db():
    await init_beanie(database=db, document_models=[User])
