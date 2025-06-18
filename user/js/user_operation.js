import { UrlUtils } from "../../UrlUtils.class.js";

window.sign_in = sign_in;
window.sign_up = sign_up;
window.sign_out=sign_out;
window.to_sign_up=to_sign_up;

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
        console.log(response);//打印响应对象到控制台，便于调试
        if (!response.ok) {//不正常
            throw new Error('Network response was not ok');
        }

        return response.json();//解析成json格式
    }).then(data => {//处理json数据
        if (data.success)  {
            UrlUtils.redirect('user', 'sign-in.html');
        } else {
            alert(data.message);//显示服务器返回的错误信息
        }
    }).catch(err => {
        //捕获并处理请求过程中发生的任何错误
        console.error(err);
        //显示通用错误提示
        alert('Error occur');
    })
}