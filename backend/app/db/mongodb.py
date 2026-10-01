from pymongo import MongoClient
from pymongo.database import Database
from typing import Optional
import os

from app.config import settings

class MongoDB:
    _client: Optional[MongoClient] = None
    _db: Optional[Database] = None

    @classmethod
    def get_client(cls) -> MongoClient:
        """Get MongoDB client instance."""
        if cls._client is None:
            cls._client = MongoClient(settings.MONGODB_URL)
        return cls._client

    @classmethod
    def get_db(cls) -> Database:
        """Get MongoDB database instance."""
        if cls._db is None:
            client = cls.get_client()
            cls._db = client.get_database("eratrip")
        return cls._db

    @classmethod
    def get_collection(cls, collection_name: str):
        """Get MongoDB collection."""
        db = cls.get_db()
        return db[collection_name]

    @classmethod
    def init_mongodb(cls):
        """Initialize MongoDB (create collections and indexes)."""
        db = cls.get_db()

        # Create collections
        trip_data = db["trip_data"]

        # Create indexes
        trip_data.create_index("user_id")
        trip_data.create_index("status")
        trip_data.create_index("created_at", expireAfterSeconds=2592000)  # 30 days TTL

        print("✅ MongoDB initialized")
        return db

# Create collection references
trip_data_collection = MongoDB.get_collection("trip_data")
user_preferences_collection = MongoDB.get_collection("user_preferences")