import {UrlUtils} from "../../UrlUtils.class.js";

const header_config = {
    "practice": {
        "display": "练习",
        "module": "general",
        "page": "practice"
    },
    "home": {
        "display": "个人",
        "module": "user",
        "page": "person.html"
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // 跳转
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
        });
    });

    const header = document.getElementById("main-header");
    const header_nav = document.createElement("div");
    header_nav.classList.add("header-nav");
    header.appendChild(header_nav);

    const logo = document.createElement("h3");
    logo.classList.add("logo-text");
    logo.textContent = "LexiLeap";
    header_nav.appendChild(logo);

    const nav = document.createElement("nav");
    nav.classList.add("header-links");
    header_nav.appendChild(nav);

    Object.keys(header_config).forEach(key => {
        const value = header_config[key];
        const entry = document.createElement("a");
        entry.setAttribute("href", value.url);
        entry.classList.add("nav-link");
        entry.textContent = value.display;

        console.log(`module ${value.module}, page ${value.page}`);
        entry.addEventListener("click", function(e) {
            e.preventDefault();
            UrlUtils.redirect(value.module, value.page);
        });

        nav.appendChild(entry);
    });
});