export const URL = "http://localhost/lexileap/";
export const SUBFIX = ".php";


export function _interface(module, _interface) {
    return URL + module + "/interface/" + _interface + SUBFIX;
}