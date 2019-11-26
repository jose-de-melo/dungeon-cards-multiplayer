import axios from 'axios';

const api = axios.create({
    baseUrl: 'http://192.168.1.103:3000'
});

export default api;