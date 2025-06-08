import {_interface} from "../../url_utils.js";

fetch(_interface("admin", "verify_token"), {
    credentials: 'include'
}).then(
    response => response.json()
).then(data => {
    if (!data.success) {
        window.location.href = "login.html";
    }
});