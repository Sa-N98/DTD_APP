export async function createTimer() {
    // Add Style 
    const css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = "./src/components/countdown/countdown.css";
    document.querySelector("head").appendChild(css);
    
    // Add HTML
    const response = await fetch("./src/components/countdown/countdown.html");
    const html = await response.text();
    const container = document.createElement("div");
    container.innerHTML = html;
    
    // Add Functionality


    return container.firstElementChild
}