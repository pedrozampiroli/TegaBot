import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/suporte17Java/rest/",
});

export default api;