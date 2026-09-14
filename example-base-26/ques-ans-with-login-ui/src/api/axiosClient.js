import axios from "axios";

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

axiosClient.interceptors.request.use(
    (config) => {

        const token = localStorage.getItem("accessToken");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

/*
 * Handle authentication errors globally.
 */
axiosClient.interceptors.response.use(
    (response) => response,

    (error) => {

        const status = error.response?.status;

        if (status === 401 || status === 403) {

            /*
             * JWT is probably expired/invalid.
             */
            localStorage.removeItem("accessToken");

            /*
             * Redirect user to login.
             */
            window.location.href =
                "/login?reason=session-expired";

            return Promise.reject(
                new Error(
                    "Your session has expired. Please login again."
                )
            );
        }

        return Promise.reject(error);
    }
);

export default axiosClient;