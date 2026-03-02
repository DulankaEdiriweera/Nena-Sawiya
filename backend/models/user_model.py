from database.db import mongo
from bson import ObjectId
from datetime import datetime


class UserModel:

    @staticmethod
    def create_user(name, email, password, role="user"):
        user_data = {
            "name": name,
            "email": email,
            "password": password,
            "role": role,
            "created_at": datetime.utcnow()
        }
        return mongo.db.users.insert_one(user_data)

    @staticmethod
    def find_by_email(email):
        return mongo.db.users.find_one({"email": email})

    @staticmethod
    def find_by_id(user_id):
        return mongo.db.users.find_one({"_id": ObjectId(user_id)})