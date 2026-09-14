import axios from "axios";


const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL;


/*
 * Normal API client.
 */
const axiosClient = axios.create({

    baseURL: API_BASE_URL,

    headers: {
        "Content-Type": "application/json",
    },

    withCredentials: true,
});


/*
 * Separate client for refresh token.
 *
 * IMPORTANT:
 * No response interceptor here.
 */
const refreshClient = axios.create({

    baseURL: API_BASE_URL,

    headers: {
        "Content-Type": "application/json",
    },

    withCredentials: true,
});


/*
 * Add access token to normal requests.
 */
axiosClient.interceptors.request.use(
    (config) => {

        const token =
            localStorage.getItem("accessToken");

        if (token) {

            config.headers.Authorization =
                `Bearer ${token}`;
        }

        return config;
    },

    (error) => Promise.reject(error)
);


let refreshPromise = null;


/*
 * Handle authentication errors.
 */
axiosClient.interceptors.response.use(

    (response) => response,

    async (error) => {

        const originalRequest =
            error.config;

        const status =
            error.response?.status;


        /*
         * Only handle 401.
         */
        if (
            status !== 401 ||
            originalRequest?._retry
        ) {

            return Promise.reject(error);
        }


        originalRequest._retry = true;


        try {

            /*
             * Only one refresh request at a time.
             */
            if (!refreshPromise) {

                refreshPromise =
                    refreshClient
                        .post("/auth/refresh")
                        .finally(() => {

                            refreshPromise = null;
                        });
            }


            const refreshResponse =
                await refreshPromise;


            const newAccessToken =
                refreshResponse.data.accessToken;


            localStorage.setItem(
                "accessToken",
                newAccessToken
            );


            /*
             * Retry original request.
             */
            originalRequest.headers =
                originalRequest.headers || {};

            originalRequest.headers.Authorization =
                `Bearer ${newAccessToken}`;


            return axiosClient(
                originalRequest
            );

        } catch (refreshError) {

            /*
             * Refresh token expired/invalid.
             */
            localStorage.removeItem(
                "accessToken"
            );

            window.location.href =
                "/login?reason=session-expired";

            return Promise.reject(
                refreshError
            );
        }
    }
);


export default axiosClient;