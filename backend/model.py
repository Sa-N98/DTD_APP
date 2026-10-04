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


class TeamMember(db.Model):
    __tablename__ = "team_members"

    id = db.Column(
        db.Integer,
        primary_key=True,
        autoincrement=True
    )

    team_id = db.Column(
        db.Integer,
        nullable=False
    )

    user_id = db.Column(
        db.Integer,
        nullable=False
    )

