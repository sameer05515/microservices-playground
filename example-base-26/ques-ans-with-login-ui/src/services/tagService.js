import axiosClient from "../api/axiosClient";



export const getTags = async () => {
    const response = await axiosClient.get("/tags");
    return response.data;
};

export const getTagById = async (id) => {
    const response = await axiosClient.get(`/tags/${id}`);
    return response.data;
};

export const createTag = async (tag) => {
    const response = await axiosClient.post("/tags", tag);
    return response.data;
};

export const updateTag = async (id, tag) => {
    const response = await axiosClient.put(`/tags/${id}`, tag);
    return response.data;
};

export const deleteTag = async (id) => {
    await axiosClient.delete(`/tags/${id}`);
};