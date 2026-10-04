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

    return element;
}
