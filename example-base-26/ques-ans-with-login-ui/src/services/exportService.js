import axiosClient from "../api/axiosClient";

// const api = axios.create({
//     baseURL: import.meta.env.VITE_API_BASE_URL,
// });

export const exportAllData = async () => {

    const response = await axiosClient.get(
        "/export",
        {
            responseType: "blob",
        }
    );

    return response.data;
};