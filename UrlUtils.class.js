export const URL = "http://localhost/lexileap/backend/";
export const SUBFIX = ".php";
export const ROOT = "/" + window.location.pathname.split('/')[1] + "/";

export class UrlUtils {

    static interface(module, interface0) {
        return URL + module + "/interface/" + interface0 + SUBFIX;
    }

    static post(module, interface0, credential = 'omit', data = {}) {
        return fetch(UrlUtils.interface(module, interface0), {
            method: 'POST',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: JSON.stringify(data),
            credentials: credential
        });
    }

    static get(module, interface0, credential) {
        return fetch(UrlUtils.interface(module, interface0), {
            method: 'GET',
            credentials: credential
        });
    }
    
    static upload(module, interface0, file, callback) {
        const form = new FormData();
        form.append("file", file);

        const xhr = new XMLHttpRequest();
        xhr.open("POST", UrlUtils.interface(module, interface0), true);
        xhr.withCredentials = true;
        xhr.onload = () => {
            console.log(xhr.responseText);
            callback(true, JSON.parse(xhr.responseText));
        };
        xhr.onerror = () => {
            callback(false, JSON.parse(xhr.responseText));
        };

        try {
            xhr.send(form);
        } catch (e) {
            console.error(e);
        }
    }

    static redirect(module, page) {
        window.location.href = ROOT + module + "/view/" + page;
    }
}