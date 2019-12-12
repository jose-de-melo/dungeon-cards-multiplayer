import axios from 'axios';

const api = axios.create({
    baseUri: "http://192.168.1.105:3000/"
});

export default api;