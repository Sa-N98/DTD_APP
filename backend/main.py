from flask import Flask
from model import *

setup_database()

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = (
    "postgresql+psycopg://san@localhost:5432/dtd_app"
)

db.init_app(app)


@app.route("/")
def home():
    return "DTD_APP API is running!"


if __name__ == "__main__":
    with app.app_context():
        db.create_all()

    app.run(debug=True)


