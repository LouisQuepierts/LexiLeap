import {UrlUtils} from "../../url_utils.js";

async function _auth() {
    try {
        const response = await UrlUtils.post("user", "verify-login", "include");
        if (response.status !== 200) {
            window.location.href = "/lexileap/user/view/sign-in.html";
            return;
        }

        const data = await response.json();
        window.userdata = data.userdata;
        console.log(data.userdata)

        // 触发用户数据加载完成事件
        const event = new CustomEvent('userdata-loaded', { detail: window.userdata });
        window.dispatchEvent(event);

    } catch (e) {
        console.error(e);
    }
}

await _auth();