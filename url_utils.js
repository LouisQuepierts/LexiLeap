export const URL = "http://localhost/lexileap/backend/";
export const SUBFIX = ".php";

export class UrlUtils {
    static interface(module, _interface) {
        return URL + module + "/interface/" + _interface + SUBFIX;
    }

    static post(module, _interface, credential = 'omit', data = {}) {
        return fetch(UrlUtils.interface(module, _interface), {
            method: 'POST',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: JSON.stringify(data),
            credentials: credential
        });
    }

    static get(module, _interface, credential) {
        return fetch(UrlUtils.interface(module, _interface), {
            method: 'GET',
            credentials: credential
        });
    }
}