import axios from 'axios';
const config = require('../config/config')

const api = axios.create({
    baseURL: config.IP_NODE_JS
});

export default api;