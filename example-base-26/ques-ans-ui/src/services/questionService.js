import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export const getQuestions = async ({
    page = 0,
    size = 10,
    search = "",
} = {}) => {

    const response = await api.get("/questions", {
        params: {
            page,
            size,
            search,
        },
    });

    return response.data;
};

export const getQuestionById = async (id) => {

    const response = await api.get(
        `/questions/${id}`
    );

    return response.data;
};

export const createQuestion = async (question) => {

    const response = await api.post(
        "/questions",
        question
    );

    return response.data;
};

export const updateQuestion = async (
    id,
    question
) => {

    const response = await api.put(
        `/questions/${id}`,
        question
    );

    return response.data;
};

export const deleteQuestion = async (id) => {

    await api.delete(`/questions/${id}`);
};