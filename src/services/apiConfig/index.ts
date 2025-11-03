import axios from "axios";

const baseURL = "http://192.168.1.7:3100";
export const URL = baseURL;

const api = axios.create({ baseURL });

export default api;
