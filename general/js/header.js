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
        if (key === "home") {
            return;
        }
        const value = header_config[key];
        const entry = document.createElement("a");
        entry.setAttribute("href", value.url);
        entry.classList.add("nav-link");
        entry.textContent = value.display;

        console.log(`module ${value.module}, page ${value.page}`);
        entry.addEventListener("click", function(e) {
            e.preventDefault();
            jump(key);
        });

        nav.appendChild(entry);
    });

    const avatar = document.createElement("img");
    avatar.classList.add("header-avatar");

    const userdata = sessionStorage.getItem("userdata");
    window.userdata = userdata !== undefined ? JSON.parse(userdata) : null;

    avatar.src = window.userdata ? window.userdata.avatar : "/lexileap/backend/userdata/default/avatar.png";
    avatar.addEventListener("click", function(e) {
        e.preventDefault();
        jump("home");
    });
    window.addEventListener('userdata-loaded', function(event) {
        console.log("userdata loaded");
        avatar.src = event.detail.avatar;
    })
    nav.appendChild(avatar);

    function jump(page) {
        if (sessionStorage.getItem("current-page") === page) {
            return;
        }

        const config = header_config[page];
        sessionStorage.setItem("current-page", page);
        UrlUtils.redirect(config.module, config.page);
    }
});