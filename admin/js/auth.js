import { UrlUtils } from "../../UrlUtils.class.js";

async function _auth() {
    const response = await UrlUtils.post("admin", "verify-token", "include");
    if (response.status !== 200) {
        UrlUtils.redirect('admin', 'login.html')
    }
}

await _auth();