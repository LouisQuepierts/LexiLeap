export const URL = "http://localhost/lexileap/backend/";
export const SUBFIX = ".php";

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
            callback(true, xhr.response);
        };
        xhr.onerror = () => {
            callback(false, xhr.response);
        };

        xhr.send(form);
    }
}