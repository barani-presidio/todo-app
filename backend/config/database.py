from motor.motor_asyncio import AsyncIOMotorClient
import os

client = None
db = None


async def connect_db():
    global client, db
    mongodb_uri = os.getenv("MONGODB_URI", "mongodb://localhost:27017/todoapp")
    
    try:
        client = AsyncIOMotorClient(mongodb_uri)
        await client.admin.command('ping')
        
        db_name = mongodb_uri.split('/')[-1] if '/' in mongodb_uri else 'todoapp'
        db = client[db_name]
        
        print(f"MongoDB connected successfully")
        print(f"Database: {db_name}")
    except Exception as error:
        print(f"MongoDB connection error: {error}")
        raise


async def close_db():
    global client
    if client:
        client.close()
        print("MongoDB disconnected")


def get_database():
    return db

