import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from model import *


app = Flask(__name__)
CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = 'postgresql://neondb_owner:npg_F8olgPakJ4fb@ep-broad-butterfly-b31q904m-pooler.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'

db.init_app(app)


@app.route("/")
def home():
    return "DTD_APP API is running!"

@app.route("/api/login", methods=["POST"])
def login():

    data = request.get_json()

    email = data["email"]
    password = data["password"]

    user = User.query.filter_by(email=email).first()

    if user is None:
        return jsonify({
            "success": False,
            "message": "Invalid email or password"
        }), 401

    if user.password != password:
        return jsonify({
            "success": False,
            "message": "Invalid email or password"
        }), 401

    return jsonify({
        "success": True,
        "message": "Login successful",
        "user_id": user.id,
        "role": user.role
    })


if __name__ == "__main__":
    # with app.app_context():
    #     team_member = TeamMember.query.first()

    #     print("Team Member ID:", team_member.id)
    #     print("User ID:", team_member.user_id)
    #     print("User Email:", team_member.user.email)

    app.run(debug=True)