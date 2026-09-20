export async function createNavbar() {
    // Add Style 
    const css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = "./src/components/navbar/navbar.css";
    document.querySelector("head").appendChild(css);
    
    // Add HTML
    const response = await fetch("./src/components/navbar/navbar.html");
    const html = await response.text();
    const container = document.createElement("div");
    container.innerHTML = html;
    
    // Add Functionality
    activateNavbar(container);


    return container.firstElementChild
}


const activateNavbar = (container) => {
    container.querySelectorAll("#nav-links a").forEach(link => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            console.log(`Navigating to ${link.getAttribute("href")}`);
        });
    });
    
};