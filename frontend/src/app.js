import { createNavbar } from "./components/navbar/navbar.js";

import { createHomePage } from "./pages/home/home.js";
import { createAboutPage } from "./pages/about/about.js";
import { createSettingsPage } from "./pages/settings/settings.js";
import { createLoginPage } from "./pages/login_page/login_page.js";

import {initPages} from "./pages/pages.js";




const app = document.querySelector("#app");


// Create components
const navbar = await createNavbar();

const homePage = await createHomePage();
const aboutPage = await createAboutPage();
const settingsPage = await createSettingsPage();
const loginPage = await createLoginPage();

// Place components
app.querySelector("nav-bar").appendChild(navbar);

const pageContainer = app.querySelector("page-container");

initPages();
pageContainer.appendChild(homePage);
pageContainer.appendChild(aboutPage);
pageContainer.appendChild(settingsPage);

var loginPageContainer = document.getElementById("login_page");
loginPageContainer.appendChild(loginPage);