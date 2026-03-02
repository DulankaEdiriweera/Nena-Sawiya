from flask import Blueprint, request, jsonify
from flask_bcrypt import Bcrypt
from flask_jwt_extended import (
    create_access_token,
    jwt_required,
    get_jwt
)
from models.user_model import UserModel

auth_bp = Blueprint("auth_bp", __name__)

bcrypt = Bcrypt()


# ---------------- REGISTER ----------------
@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not name or not email or not password:
        return jsonify({"message": "All fields are required"}), 400

    if UserModel.find_by_email(email):
        return jsonify({"message": "Email already exists"}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")

    UserModel.create_user(name, email, hashed_password)

    return jsonify({"message": "User registered successfully"}), 201


# ---------------- LOGIN ----------------
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    user = UserModel.find_by_email(email)

    if not user or not bcrypt.check_password_hash(user["password"], password):
        return jsonify({"message": "Invalid credentials"}), 401

    additional_claims = {
        "role": user["role"],
        "name": user["name"]
    }

    access_token = create_access_token(
        identity=str(user["_id"]),
        additional_claims=additional_claims
    )

    return jsonify({
        "token": access_token,
        "role": user["role"],
        "name": user["name"]
    }), 200


# ---------------- ADMIN ONLY ROUTE ----------------
@auth_bp.route("/admin", methods=["GET"])
@jwt_required()
def admin_test():
    claims = get_jwt()

    if claims["role"] != "admin":
        return jsonify({"message": "Admins only"}), 403

    return jsonify({"message": "Welcome Admin"}), 200