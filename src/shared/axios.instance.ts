import axios from 'axios';
const { VITE_BASE_URL } = import.meta.env;

export const autoFetch = axios.create({
    baseURL: VITE_BASE_URL,
});
