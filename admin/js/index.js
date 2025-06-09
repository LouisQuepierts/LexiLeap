import { UrlUtils } from "../../url_utils.js";

UrlUtils.post("admin", "verify_token", "include"
).then(
    response => response.json()
).then(data => {
    if (!data.success) {
        window.location.href = "login.html";
    }
});