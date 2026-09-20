export function initPages() {
const css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = "./src/pages/page_style.css";
    document.querySelector("head").appendChild(css);
}