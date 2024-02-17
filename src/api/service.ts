import axios, { type RawAxiosRequestHeaders } from "axios";
import { BaseUrlDev } from "./constants";

const http = axios.create({ baseURL: `${BaseUrlDev}/` });
// const token = localStorage.getItem("token");
// const headers = { Authorization: `Bearer ${token}` };

// Allow insecure HTTP requests
http.defaults.validateStatus = function (status) {
    return status >= 200 && status < 300;
};

export default http;

export function get(url: string, headers?: RawAxiosRequestHeaders) {
    return http.get(url, {
        headers: headers,
    });
};

export function post(url: string, data?: any, headers?: RawAxiosRequestHeaders) {
    return http.post(url, data, {
        headers: headers,
    });
}

export function patch(url: string, data?: any, headers?: RawAxiosRequestHeaders) {
    return http.patch(url, data, {
        headers: headers,
    });
}
export function put(url: string, data?: any, headers?: RawAxiosRequestHeaders) {
    return http.put(url, data, {
        headers: headers,
    });
}
export function deleteRequest(url: string, headers?: RawAxiosRequestHeaders) {
    return http.delete(url, {
        headers: headers,
    });
}