import {UrlUtils} from "../../UrlUtils.class.js";

async function _auth() {
    try {
        const response = await UrlUtils.post("user", "verify-login", "include");
        if (response.status === 401) {
            window.location.href = "/lexileap/user/view/sign-in.html";
            console.log(response)
            return;
        }

        const data = await response.json();
        window.userdata = data.userdata;
        console.log(data.userdata)

        // 触发用户数据加载完成事件
        const event = new CustomEvent('userdata-loaded', { detail: window.userdata });
        window.dispatchEvent(event);

    } catch (e) {
        console.log('error:');
        console.error(e);
    }
}

await _auth();