import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

export const exportAllData = async () => {

    const response = await api.get(
        "/export",
        {
            responseType: "blob",
        }
    );

    return response.data;
};