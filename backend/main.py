import os
from flask import Flask
from model import db, User


app = Flask(__name__)

app.config["SQLALCHEMY_DATABASE_URI"] = 'neon_connection_string'

db.init_app(app)


@app.route("/")
def home():
    return "DTD_APP API is running!"


if __name__ == "__main__":
    with app.app_context():
        users = User.query.all()

        for user in users:
            print(user.id, user.email, user.role, user.availability)

    app.run(debug=True)