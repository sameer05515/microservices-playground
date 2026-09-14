import axios from "axios";

const axiosClient = axios.create({

    baseURL: import.meta.env.VITE_API_BASE_URL,

    headers: {
        "Content-Type": "application/json",
    },

    withCredentials: true,
});


/*
 * Add access token.
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
 * Handle API responses.
 */
axiosClient.interceptors.response.use(

    (response) => response,

    async (error) => {

        const originalRequest =
            error.config;

        const status =
            error.response?.status;


        /*
         * Only expired/invalid authentication.
         */
        if (
            status !== 401 ||
            originalRequest?._retry
        ) {

            return Promise.reject(error);
        }


        /*
         * Never refresh the refresh request itself.
         */
        if (
            originalRequest.url
                ?.includes("/auth/refresh")
        ) {

            localStorage.removeItem(
                "accessToken"
            );

            window.location.href =
                "/login?reason=session-expired";

            return Promise.reject(error);
        }


        originalRequest._retry = true;


        try {

            /*
             * If another request is already
             * refreshing, reuse that request.
             */
            if (!refreshPromise) {

                refreshPromise =
                    axiosClient
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
             * Refresh token is also invalid/expired.
             *
             * User must login again.
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