import {UrlUtils} from "../../UrlUtils.class";

window.admin = [];
window.admin.login = login;

function login() {
    const loginForm = document.getElementById('login-form');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    const username = usernameInput.value;
    const password = passwordInput.value;

    loginForm.reset();

    UrlUtils.post("admin", "login", "include", {
        username: username,
        password: password
    }).then(response => {
        if (response.status === 200) {
            UrlUtils.redirect('admin', 'admin-edit-page.html');
        }
    }).catch(err => {
        console.error(err);
    })
}