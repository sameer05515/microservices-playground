import axiosClient from "../api/axiosClient";

// const api = axios.create({
//     baseURL: import.meta.env.VITE_API_BASE_URL,
//     headers: {
//         "Content-Type": "application/json",
//     },
// });

export const getQuestions = async ({
    page = 0,
    size = 10,
    search = "",
} = {}) => {

    const response = await axiosClient.get("/questions", {
        params: {
            page,
            size,
            search,
        },
    });

    return response.data;
};

export const getQuestionById = async (id) => {

    const response = await axiosClient.get(
        `/questions/${id}`
    );

    return response.data;
};

export const createQuestion = async (question) => {

    const response = await axiosClient.post(
        "/questions",
        question
    );

    return response.data;
};

export const updateQuestion = async (
    id,
    question
) => {

    const response = await axiosClient.put(
        `/questions/${id}`,
        question
    );

    return response.data;
};

export const deleteQuestion = async (id) => {

    await axiosClient.delete(`/questions/${id}`);
};