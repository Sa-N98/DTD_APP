import os
from flask import Flask
from model import *


app = Flask(__name__)

app.config["SQLALCHEMY_DATABASE_URI"] = 'postgresql://neondb_owner:npg_F8olgPakJ4fb@ep-broad-butterfly-b31q904m-pooler.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'

db.init_app(app)


@app.route("/")
def home():
    return "DTD_APP API is running!"


if __name__ == "__main__":
    with app.app_context():
        team_member = TeamMember.query.first()

        print("Team Member ID:", team_member.id)
        print("User ID:", team_member.user_id)
        print("User Email:", team_member.user.email)

    app.run(debug=True)