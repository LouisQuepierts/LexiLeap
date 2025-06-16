import { UrlUtils } from "../../UrlUtils.class.js";

UrlUtils.post("admin", "verify-token", "include").then(
    response => {
        console.log(response)
    }
).then(data => {
    if (!data.success) {
        UrlUtils.redirect('admin', 'login.html')
    }
});