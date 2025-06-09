import { UrlUtils } from "../../url_utils.js";

window.sign_in = sign_in;
window.sign_up = sign_up;

const REGNX_EMAIL = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
const REGNX_USERNAME = /^[a-zA-Z0-9_-]{3,16}$/;
const REGNX_PASSWORD = /^[a-zA-Z0-9_-]{6,16}$/;

function sign_in() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!REGNX_EMAIL.test(email)) {
        alert('Invalid email');
        return;
    }

    UrlUtils.post('user', 'sign-in', 'include', {
        email: email,
        password: password
    }).then(res => {
        if (res.status === 200) {
            window.location.href = '/user/index.html';
        } else {
            alert(res.message);
        }
    });
}

function sign_up() {
    const email = document.getElementById('email').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (!REGNX_EMAIL.test(email)) {
        alert('Invalid email');
        return;
    }

    if (!REGNX_USERNAME.test(username)) {
        alert('Invalid username');
        return;
    }

    if (!REGNX_PASSWORD.test(password)) {
        alert('Invalid password');
        return;
    }

    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }

    const data = {
        email: email,
        username: username,
        password: password
    };

    console.log(data);

    UrlUtils.post('user', 'sign-up', 'include', data).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return response.json();
    }).then(data => {
        if (data.success)  {
            window.location.href = './sign-in.html';
        } else {
            alert('Sign up failed');
        }
    }).catch(err => {
        console.error(err);
        alert('Sign up failed');
    });
}