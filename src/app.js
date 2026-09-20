import { createNavbar } from "./components/navbar/navbar.js";

import { createHomePage } from "./pages/home/home.js";
import { createAboutPage } from "./pages/about/about.js";
import { createSettingsPage } from "./pages/settings/settings.js";

import {initPages} from "./pages/page.js";




const app = document.querySelector("#app");


// Create components
const navbar = await createNavbar();

const homePage = await createHomePage();
const aboutPage = await createAboutPage();
const settingsPage = await createSettingsPage();


// Place components
app.querySelector("navBar").appendChild(navbar);

const pageContainer = app.querySelector("pageContainer");

initPages();
pageContainer.appendChild(homePage);
pageContainer.appendChild(aboutPage);
pageContainer.appendChild(settingsPage);