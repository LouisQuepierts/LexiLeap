import { UrlUtils } from "../../url_utils.js";

const loginForm = document.getElementById('login-form');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');

loginForm.addEventListener('submit', e => {
    e.preventDefault();

    const username = usernameInput.value;
    const password = passwordInput.value;

    UrlUtils.post("admin", "login", "include", {
        username: username,
        password: password
    }).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    }).then(data => {
        console.log(data)
    })
})