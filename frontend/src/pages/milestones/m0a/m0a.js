import {getUser} from "../../../utils/auth.js";   

export async function createM0APage() {
    const response = await fetch("./src/pages/milestones/m0a/m0a.html");
    const html = await response.text();
    const container = document.createElement("div");
    container.innerHTML = html;

    const element = container.firstElementChild;
    element.id = "page-milestone-0a";
    element.classList.add("page");

    const css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = "./src/pages/milestones/m0a/m0a.css";
    document.querySelector("head").appendChild(css);

    createTeam(element);
    // existingTeam(element);

    return element;
}


function createTeam(element) {
    // Implementation for creating a team
    const createTeamBtn = element.querySelector("#create_team_button");
    const createTeamForm = element.querySelector("#create_team_form");
    const submitTeamBtn = element.querySelector("#submit_team");
    const teamLeadInput = element.querySelector("#team_lead");
    const feedbackDiv = element.querySelector("#team_feedback");
    const user = getUser();

    if (user && teamLeadInput) {
        teamLeadInput.value = user.email;
    }

    if (createTeamBtn && createTeamForm) {
        createTeamBtn.addEventListener("click", () => {
            const isHidden = createTeamForm.style.display === "none";
            createTeamForm.style.display = isHidden ? "block" : "none";
        });
    }

    submitTeamBtn.addEventListener("click", async (event) => {
        event.preventDefault();

        if (feedbackDiv) feedbackDiv.textContent = "Submitting...";

        const data = {
            lead: teamLeadInput.value,
            member1: element.querySelector('[name="member1"]').value,
            member2: element.querySelector('[name="member2"]').value,
            member3: element.querySelector('[name="member3"]').value
        };

        try {
            const response = await fetch(
                "http://127.0.0.1:5001/api/teams",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data)
                }
            );

            const result = await response.json();

            if (feedbackDiv) {
                feedbackDiv.textContent = result.message;
                feedbackDiv.style.color = result.success ? "green" : "red";

                if (result.success) {
                    createTeamForm.style.display = "none";
                }
            }

            console.log(result);
        } catch (error) {
            if (feedbackDiv) {
                feedbackDiv.textContent = "An error occurred while submitting.";
                feedbackDiv.style.color = "red";
            }
            console.error(error);
        }
    })
}

// function existingTeam(element) {
//     const teamsListDiv = element.querySelector("#existing_teams_list");

//     async function fetchTeams() {
//         try {
//             const response = await fetch("http://127.0.0.1:5000/api/existing_teams");
//             const teams = await response.json();

//             if (!teamsListDiv) return;
//             teamsListDiv.innerHTML = "";

//             teams.forEach(team => {
//                 const teamCard = document.createElement("div");
//                 teamCard.className = "team_card";

//                 const membersCount = team.members.length;
//                 teamCard.innerHTML = `
//                     <div class="team_info">Team ${team.team_no} - Members: ${membersCount}/4</div>
//                     <button class="view_team_btn">View Team</button>
//                 `;

//                 const viewBtn = teamCard.querySelector(".view_team_btn");
//                 viewBtn.addEventListener("click", () => {
//                     showTeamPopup(team);
//                 });

//                 teamsListDiv.appendChild(teamCard);
//             });
//         } catch (error) {
//             console.error("Error fetching teams:", error);
//         }
//     }

//     function showTeamPopup(team) {
//         const popup = document.createElement("div");
//         popup.className = "team_popup_overlay";

//         const membersList = team.members
//             .map(m => `<li>${m.email} (${m.role})</li>`)
//             .join("");

//         popup.innerHTML = `
//             <div class="team_popup_content">
//                 <h3>Team ${team.team_no} Details</h3>
//                 <p><strong>Problem Statement:</strong> ${team.team_problem_stmt || "Not yet defined"}</p>
//                 <ul>${membersList}</ul>
//                 <button class="close_popup">Close</button>
//             </div>
//         `;

//         popup.querySelector(".close_popup").addEventListener("click", () => {
//             document.body.removeChild(popup);
//         });

//         document.body.appendChild(popup);
//     }

//     fetchTeams();
// }