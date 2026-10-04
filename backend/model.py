from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(
        db.Integer,
        primary_key=True,
        autoincrement=True
    )

    email = db.Column(
        db.String(255),
        unique=True,
        nullable=False
    )

    password = db.Column(
        db.String(255),
        nullable=False,
        default="123"
    )

    role = db.Column(
        db.String(255),
        nullable=False
    )

    availability = db.Column(
        db.Boolean,
        nullable=False,
        default=True
    )


