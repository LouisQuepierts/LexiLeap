import {UrlUtils} from "../../UrlUtils.class.js";

async function _auth() {
    try {
        const response = await UrlUtils.post("user", "verify-login", "include");
        if (response.status === 401) {
            UrlUtils.redirect("user", "sign-in.html");
            // console.log(response);
            return;
        }

        console.log(response);
        const data = (await response.json()).data;
        sessionStorage.setItem("userdata", JSON.stringify(data));
        console.log(data)

        // 触发用户数据加载完成事件
        const event = new CustomEvent('userdata-loaded', { detail: data });
        window.dispatchEvent(event);

    } catch (e) {
        console.error(e);
    }
}

await _auth();