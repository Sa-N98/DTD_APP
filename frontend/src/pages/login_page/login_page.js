export async function createLoginPage() {
    // Add Style 
    const css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = "./src/pages/login_page/login_page.css";
    document.querySelector("head").appendChild(css);
    
    // Add HTML
    const response = await fetch("./src/pages/login_page/login_page.html");
    const html = await response.text();
    const container = document.createElement("div");
    container.innerHTML = html;
    
    // Add Functionality

    return container.firstElementChild
}