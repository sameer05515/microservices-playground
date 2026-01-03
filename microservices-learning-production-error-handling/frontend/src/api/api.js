import axios from "axios";
const api = axios.create({ baseURL: "http://localhost:8080", headers: { "Content-Type": "application/json" } });
export const userApi = { list: () => api.get("/users"), create: (d) => api.post("/users", d) };
export const productApi = { list: () => api.get("/products"), create: (d) => api.post("/products", d) };
export const orderApi = { list: () => api.get("/orders"), create: (d) => api.post("/orders", d) };
