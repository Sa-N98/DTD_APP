import { createNavbar } from "./components/navbar/navbar.js";

import { createHomePage } from "./pages/home/home.js";
import { createAboutPage } from "./pages/about/about.js";
import { createSettingsPage } from "./pages/settings/settings.js";
import { createLoginPage } from "./pages/login_page/login_page.js";
import { loginFunctionality } from "./pages/login_page/login_page.js";

import { createM0APage } from "./pages/milestones/m0a/m0a.js";
import { createM1APage } from "./pages/milestones/m1a/m1a.js";
import { createM1BPage } from "./pages/milestones/m1b/m1b.js";
import { createM2APage } from "./pages/milestones/m2a/m2a.js";
import { createM2BPage } from "./pages/milestones/m2b/m2b.js";
import { createM3APage } from "./pages/milestones/m3a/m3a.js";
import { createM3BPage } from "./pages/milestones/m3b/m3b.js";

import {initPages} from "./pages/pages.js";
import { saveUser } from "./utils/auth.js";
import { getUser } from "./utils/auth.js";




const app = document.querySelector("#app");


// Create components
const navbar = await createNavbar();

const homePage = await createHomePage();
const aboutPage = await createAboutPage();
const settingsPage = await createSettingsPage();
const loginPage = await createLoginPage();

const m0aPage = await createM0APage();
const m1aPage = await createM1APage();
const m1bPage = await createM1BPage();
const m2aPage = await createM2APage();
const m2bPage = await createM2BPage();
const m3aPage = await createM3APage();
const m3bPage = await createM3BPage();


// Place components


const pageContainer = app.querySelector("page-container");



var loginPageContainer = document.getElementById("login_page");
loginPageContainer.appendChild(loginPage);

const user = getUser();


if (user.user_id && user.role && user.email) {
    loginPageContainer.remove();
    initPages();
    app.querySelector("nav-bar").appendChild(navbar);
    pageContainer.appendChild(homePage);
    pageContainer.appendChild(aboutPage);
    pageContainer.appendChild(settingsPage);
    pageContainer.appendChild(m0aPage);
    pageContainer.appendChild(m1aPage);
    pageContainer.appendChild(m1bPage);
    pageContainer.appendChild(m2aPage);
    pageContainer.appendChild(m2bPage);
    pageContainer.appendChild(m3aPage);
    pageContainer.appendChild(m3bPage);
} else {
   const login_data = await loginFunctionality(loginPage);


    if (login_data.success) {
        loginPageContainer.remove();

        saveUser(login_data);
        
        initPages();
        app.querySelector("nav-bar").appendChild(navbar);
        pageContainer.appendChild(homePage);
        pageContainer.appendChild(aboutPage);
        pageContainer.appendChild(settingsPage);
        pageContainer.appendChild(m0aPage);
        pageContainer.appendChild(m1aPage);
        pageContainer.appendChild(m1bPage);
        pageContainer.appendChild(m2aPage);
        pageContainer.appendChild(m2bPage);
        pageContainer.appendChild(m3aPage);
        pageContainer.appendChild(m3bPage);
        console.log("Login successful");

} 
}
