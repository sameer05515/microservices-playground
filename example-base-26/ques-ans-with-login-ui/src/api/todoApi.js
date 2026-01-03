import axiosClient from "./axiosClient";

export const getTodos = async () => {

    const response = await axiosClient.get("/todos");

    return response.data;
};

export const createTodo = async (title) => {

    const response = await axiosClient.post(
        "/todos",
        {
            title,
        }
    );

    return response.data;
};

export const updateTodo = async (
    id,
    title,
    completed
) => {

    const response = await axiosClient.put(
        `/todos/${id}`,
        {
            title,
            completed,
        }
    );

    return response.data;
};

export const deleteTodo = async (id) => {

    await axiosClient.delete(`/todos/${id}`);
};