import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from model import *


app = Flask(__name__)
CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = 'postgresql+psycopg://neondb_owner:npg_F8olgPakJ4fb@ep-broad-butterfly-b31q904m-pooler.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
    "pool_pre_ping": True
}

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
        })

    if user.password != password:
        return jsonify({
            "success": False,
            "message": "Invalid email or password"
        })

    return jsonify({
        "success": True,
        "message": "Login successful",
        "user_email": user.email,
        "user_id": user.id,
        "role": user.role
    })



@app.route("/api/teams", methods=["POST"])
def create_team():
    data = request.get_json()

    lead_email = data.get("lead")
    member_emails = [
        data.get("member1"),
        data.get("member2"),
        data.get("member3")
    ]

    # Remove empty members
    member_emails = [
        email for email in member_emails
        if email
    ]

    # All team members
    all_emails = [lead_email] + member_emails

    # Check team size
    if len(all_emails) < 2 or len(all_emails) > 4:
        return jsonify({
            "success": False,
            "message": "A team must have between 2 and 4 members."
        }), 400

    # Check duplicate members
    if len(all_emails) != len(set(all_emails)):
        return jsonify({
            "success": False,
            "message": "A team cannot contain the same member twice."
        }), 400

    # Find users
    users = User.query.filter(
        User.email.in_(all_emails)
    ).all()

    if len(users) != len(all_emails):
        return jsonify({
            "success": False,
            "message": "One or more users could not be found."
        }), 404

    # Find lead
    lead = next(
        user for user in users
        if user.email == lead_email
    )

    # Check lead is a student
    if lead.role != "student":
        return jsonify({
            "success": False,
            "message": "Only students can create teams."
        }), 403

    # Check lead isn't already leading a team
    if lead.led_team:
        return jsonify({
            "success": False,
            "message": "You are already leading a team."
        }), 409

    # Check availability
    unavailable_users = [
        user.email
        for user in users
        if not user.availability
    ]

    if unavailable_users:
        return jsonify({
            "success": False,
            "message": "One or more users are already in a team.",
            "users": unavailable_users
        }), 409

    try:
        # Create team
        team = Team(
            problem_stmt=None,
            lead_id=lead.id,
            team_no=Team.query.count() + 1
        )

        db.session.add(team)
        db.session.flush()

        # Add members
        for user in users:
            team_member = TeamMember(
                team_id=team.id,
                user_id=user.id
            )

            db.session.add(team_member)

            # Mark user unavailable
            user.availability = False

        db.session.commit()

        return jsonify({
            "success": True,
            "message": "Team created successfully",
            "team_id": team.id,
            "team_no": team.team_no
        }), 201

    except Exception as e:
        db.session.rollback()

        return jsonify({
            "success": False,
            "message": "Failed to create team."
        }), 500


@app.route("/api/all_teams", methods=["GET"])
def get_all_teams():
    teams = Team.query.all()
    team_list = []
    for team in teams:
        members = []
        for tm in team.team_members:
            members.append({
                "email": tm.user.email,
                "role": "Lead" if tm.user.id == team.lead_id else "Member"
            })
        team_data = {
            "id": team.id,
            "team_no": team.team_no,
            "lead_id": team.lead_id,
            "members": members,
            "team_problem_stmt": team.problem_stmt
        }
        team_list.append(team_data)
    return jsonify(team_list), 200


@app.route("/api/find_teammates", methods=["GET"])
def find_teammates():
    users = User.query.filter_by(role="student", availability=True).all()
    return jsonify([{
        "email": user.email
    } for user in users]), 200


@app.route("/api/update_problem_stmt", methods=["POST"])
def update_problem_stmt():
    data = request.get_json()
    team_id = data.get("team_id")
    problem_stmt = data.get("problem_stmt")

    if not team_id or not problem_stmt:
        return jsonify({
            "success": False,
            "message": "Team ID and problem statement are required."
        }), 400

    team = Team.query.get(team_id)
    if not team:
        return jsonify({
            "success": False,
            "message": "Team not found."
        }), 404

    try:
        team.problem_stmt = problem_stmt
        db.session.commit()
        return jsonify({
            "success": True,
            "message": "Problem statement updated successfully."
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "success": False,
            "message": "Failed to update problem statement."
        }), 500


@app.route("/api/exit_team/<user_email>", methods=["POST"])
def exit_team(user_email):

    user = User.query.filter_by(email=user_email).first()

    if not user:
        return jsonify({
            "success": False,
            "message": "User not found."
        }), 404

    team_member = TeamMember.query.filter_by(
        user_id=user.id
    ).first()

    if not team_member:
        return jsonify({
            "success": False,
            "message": "You are not a member of any team."
        }), 404

    team = team_member.team

    if not team:
        return jsonify({
            "success": False,
            "message": "Team not found."
        }), 404

    # Check if exiting member is the leader
    was_leader = team.lead_id == user.id

    # Remove member
    db.session.delete(team_member)
    user.availability = True

    # Get remaining members
    remaining_members = [
        member for member in team.team_members
        if member.user_id != user.id
    ]

    # If fewer than 2 members remain, delete the team
    if len(remaining_members) < 2:

        for member in remaining_members:
            member.user.availability = True

        db.session.delete(team)

    # If leader exited, promote first remaining member
    elif was_leader:

        new_leader = remaining_members[0]

        team.lead_id = new_leader.user_id

    db.session.commit()

    return jsonify({
        "success": True,
        "message": "Successfully exited team."
    }), 200


if __name__ == "__main__":
    # with app.app_context():
    #     team_member = TeamMember.query.first()

    #     print("Team Member ID:", team_member.id)
    #     print("User ID:", team_member.user_id)
    #     print("User Email:", team_member.user.email)

    app.run(debug=True, port=5001)