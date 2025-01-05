// apiClient.ts
import axios /**, { type AxiosRequestConfig }*/ from "axios";

// export type ApiClientRequestProps<TRequest> = {
//   method?: "get" | "put" | "post" | "delete" | "patch"| string;
//   url: string;
// } & AxiosRequestConfig<TRequest>;

/**
 * A generic API request utility that supports different types for request body and response.
 *
 * @template TRequest - Type for the request body.
 * @template TResponse - Type for the response data.
 * @param method - HTTP method ("get", "post", "put", "delete").
 * @param url - The endpoint URL relative to the API base URL.
 * @param data - Optional request body data.
 * @returns A promise with the response data, error status, and error message.
 */
export const apiRequest = async /** <TRequest, TResponse>*/(
  config /**: ApiClientRequestProps<TRequest>*/
)=>
// : Promise<{
//   data?: TResponse;
//   isError: boolean;
//   message: string;
//   status?: number;
//   response: unknown;
//   error: unknown;
// }> 
// => 
  {
  try {
    const response = await axios(config);
    return {
      data: response.data /**as TResponse*/,
      isError: false,
      message: "",
      // response,
      // error: undefined
    };
  } catch (error) {
    console.error("API Request Error: ", error);
    console.error(`axios.isAxiosError(error): ${axios.isAxiosError(error)}`);

    if (axios.isAxiosError(error)) {
      // Extract meaningful error message and status from backend
      const message =
        error.response?.data || error.message || "An error occurred";
      // const status = error.response?.status;
      return {
        data: null,
        isError: true,
        message:
          typeof message === "string" ? message : JSON.stringify(message),
        //status,
        // response:undefined,
        // error
      };
    } else {
      return {
        data: null,
        isError: true,
        message: error ? JSON.stringify(error) : "An error occurred",        
        // response:undefined,
        // error
      };
    }
  }
};
