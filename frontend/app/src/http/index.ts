import axios from 'axios';

const URL_API = `http://localhost/api`
const AUTH_API = `http://localhost/auth`

export const $api = axios.create({
    withCredentials: true,
    baseURL: URL_API,
})

$api.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
    return config;
})

export const $auth = axios.create({
    withCredentials: true,
    baseURL: AUTH_API,
})