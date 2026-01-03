import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export const getTags = async () => {
    const response = await api.get("/tags");
    return response.data;
};

export const getTagById = async (id) => {
    const response = await api.get(`/tags/${id}`);
    return response.data;
};

export const createTag = async (tag) => {
    const response = await api.post("/tags", tag);
    return response.data;
};

export const updateTag = async (id, tag) => {
    const response = await api.put(`/tags/${id}`, tag);
    return response.data;
};

export const deleteTag = async (id) => {
    await api.delete(`/tags/${id}`);
};