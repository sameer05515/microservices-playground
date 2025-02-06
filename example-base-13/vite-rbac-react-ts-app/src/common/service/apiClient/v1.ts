// apiClient.ts
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";

// Define the request props
export type ApiClientRequestProps<TRequest> = {
  method?: "get" | "put" | "post" | "delete" | "patch";
  url: string;
} & AxiosRequestConfig<TRequest>;

// Define the response structure
export type ApiResponse<TResponse> = {
  data?: TResponse;
  isError: boolean;
  message: string;
  status?: number;
};

/**
 * A generic API request utility that supports different types for request body and response.
 *
 * @template TRequest - Type for the request body.
 * @template TResponse - Type for the response data.
 * @param config - Axios request configuration.
 * @returns A promise with the response data, error status, and error message.
 */
export const apiRequest = async <TRequest, TResponse>(
  config: ApiClientRequestProps<TRequest>
): Promise<ApiResponse<TResponse>> => {
  try {
    const response: AxiosResponse<TResponse> = await axios(config);
    return {
      data: response.data,
      isError: false,
      message: "",
      status: response.status,
    };
  } catch (error) {
    const axiosError = error as AxiosError;
    const message =
      axiosError.response?.data || axiosError.message || "An error occurred";
    
    return {
      data: undefined,
      isError: true,
      message: typeof message === "string" ? message : JSON.stringify(message),
      status: axiosError.response?.status,
    };
  }
};
