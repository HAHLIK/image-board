import axios from 'axios';

const URL = import.meta.env.VITE_URL
const URL_API =  URL + `/api`
const AUTH_API = URL + `/auth`

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