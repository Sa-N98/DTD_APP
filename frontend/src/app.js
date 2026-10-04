import { createNavbar } from "./components/navbar/navbar.js";

import { createHomePage } from "./pages/home/home.js";
import { createAboutPage } from "./pages/about/about.js";
import { createSettingsPage } from "./pages/settings/settings.js";
import { createLoginPage } from "./pages/login_page/login_page.js";
import { loginFunctionality } from "./pages/login_page/login_page.js";

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
        console.log("Login successful");

} 
}
