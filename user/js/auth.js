import {UrlUtils} from "../../UrlUtils.class.js";

async function _auth() {
    try {
        const session = sessionStorage.getItem("userdata");
        if (!!session) {
            const time = JSON.parse(session).time;
            if (time + 1000 * 60 * 60 < Date.now()) {
                return;
            }
        }

        const response = await UrlUtils.post("user", "verify-login", "include");
        if (response.status === 401) {
            UrlUtils.redirect("user", "sign-in.html");
            // console.log(response);
            return;
        }

        const data = (await response.json()).data;
        data.time = new Date(data.time);
        sessionStorage.setItem("userdata", JSON.stringify(data));

        const event = new CustomEvent('userdata-loaded', { detail: data });
        window.dispatchEvent(event);

    } catch (e) {
        console.error(e);
    }
}

await _auth();