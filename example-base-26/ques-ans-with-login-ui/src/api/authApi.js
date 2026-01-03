import axiosClient, { publicClient } from "./axiosClient";

export const signup = async (data) => {
    const response = await publicClient.post(
        "/auth/signup",
        data
    );
    return response.data;
};

export const login = async (data) => {
    const response = await publicClient.post(
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

export const getSecurityQuestions = async () => {
    const response = await publicClient.get("/security-questions");
    return response.data;
};

export const getMySecurityQuestions = async () => {
    const response = await axiosClient.get(
        "/users/me/security-questions"
    );
    return response.data;
};

export const updateMySecurityQuestions = async (questions) => {
    await axiosClient.put(
        "/users/me/security-questions",
        { questions }
    );
};

export const getForgotPasswordQuestions = async (email) => {
    const response = await publicClient.post(
        "/auth/forgot-password/questions",
        { email }
    );
    return response.data;
};

export const verifySecurityAnswers = async (email, answers) => {
    const response = await publicClient.post(
        "/auth/forgot-password/verify",
        { email, answers }
    );
    return response.data;
};

export const resetPassword = async (resetToken, newPassword) => {
    await publicClient.post(
        "/auth/reset-password",
        { resetToken, newPassword }
    );
};
