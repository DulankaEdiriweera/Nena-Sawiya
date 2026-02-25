from flask_pymongo import PyMongo
from dotenv import load_dotenv
import os

mongo = PyMongo()

def init_db(app):
    load_dotenv()

    app.config["MONGO_URI"] = os.getenv("MONGO_URI")

    mongo.init_app(app)

    #Test connection
    try:
        mongo.cx.admin.command("ping")
        print("MongoDB Connected Successfully!")
    except Exception as e:
        print("MongoDB Connection Failed!")
        print("Error:", e)