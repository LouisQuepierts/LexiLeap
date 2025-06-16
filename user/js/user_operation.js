import { UrlUtils } from "../../UrlUtils.class.js";

window.sign_in = sign_in;
window.sign_up = sign_up;
window.to_sign_up = to_sign_up;

const REGEX_EMAIL = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
const REGEX_USERNAME = /^[\u4E00-\u9FA5A-Za-z0-9_]{2,20}$/;
const REGEX_PASSWORD = /^[a-zA-Z\w]{6,20}$/;

function sign_in() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!REGEX_EMAIL.test(email)) {
        alert('Invalid email');
        return;
    }

    UrlUtils.post('user', 'sign-in', 'include', {
        email: email,
        password: password
    }).then(response => {
        console.log(response);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return response.json();
    }).then(data => {
        if (data.success)  {
            UrlUtils.redirect('general', 'practice/index.html');
        } else {
            alert(data.message);
        }
    }).catch(err => {
        console.error(err);
        alert('Error occur');
    });
}

function to_sign_up() {
    UrlUtils.redirect('user', 'sign-up.html');
}

function sign_up() {
    const email = document.getElementById('email').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (!REGEX_EMAIL.test(email)) {
        alert('Invalid email');
        return;
    }

    if (!REGEX_USERNAME.test(username)) {
        alert('Invalid username');
        return;
    }

    if (!REGEX_PASSWORD.test(password)) {
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
        console.log(response);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return response.json();
    }).then(data => {
        if (data.success)  {
            UrlUtils.redirect('user', 'sign-in.html');
        } else {
            alert(data.message);
        }
    }).catch(err => {
        console.error(err);
        alert('Error occur');
    });
}

function sign_out() {
    UrlUtils.get('user', 'sign-out').then(response => {
        console.log(response);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return response.json();
    }).then(data => {
        if (data.success)  {
            UrlUtils.redirect('user', 'sign-in.html');
        } else {
            alert(data.message);
        }
    }).catch(err => {
        console.error(err);
        alert('Error occur');
    })
}