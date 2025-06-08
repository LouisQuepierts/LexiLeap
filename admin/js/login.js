import { _interface } from "../../url_utils.js";

const loginForm = document.getElementById('login-form');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');

loginForm.addEventListener('submit', e => {
    e.preventDefault();

    const username = usernameInput.value;
    const password = passwordInput.value;

    fetch(_interface('admin', 'login'), {
        method: 'POST',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: JSON.stringify({
            username: username,
            password: password
        }),
        credentials: 'include'
    }).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    }).then(data => {
        console.log(data)
    })
})