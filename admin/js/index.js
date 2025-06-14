import { UrlUtils } from "../../UrlUtils.class.js";

UrlUtils.post("admin", "verify_token", "include"
).then(
    response => {
        console.log(response)
    }
).then(data => {
    if (!data.success) {
        window.location.href = "login.html";
    }
});