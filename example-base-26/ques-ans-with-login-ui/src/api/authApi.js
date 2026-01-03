import axiosClient from "./axiosClient";

export const signup = async (data) => {

    const response = await axiosClient.post(
        "/auth/signup",
        data
    );

    return response.data;
};

export const login = async (data) => {

    const response = await axiosClient.post(
        "/auth/login",
        data
    );

    return response.data;
};

export const logout = async () => {

    await axiosClient.post("/auth/logout");
};

export const changePassword = async (data) => {

    await axiosClient.post(
        "/auth/change-password",
        data
    );
};