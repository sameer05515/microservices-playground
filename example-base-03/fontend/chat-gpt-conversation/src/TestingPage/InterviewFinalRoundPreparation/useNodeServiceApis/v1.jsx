// import { useDispatch } from "react-redux";

import { apiRequest } from "../../../common/utils/apiClient/v1";
import { prepareErrorMessage } from "../../../common/utils/message-preparation-utils-v2";

/**
 *
 * Associated backend is running from "D:\GIT\java-playground\node-service"
 *
 * */

const BACKEND_APPLICATION_BASE_URL = "http://localhost:8080";

// Base URL for CGPT API requests
const BASE_URL = `${BACKEND_APPLICATION_BASE_URL}/api/nodes`;

// Endpoint Constants
const ENDPOINTS = {
  GET_ALL_NODES: "",
};

// Hook for CGPT API operations
const useNodeServiceApis = () => {

  /**
   * Fetch all CGPT files (without conversation or message info).
   * @returns {Promise<{data: any, isError: boolean, message: string}>}
   */
  const fetchAllNodes = async () => {
    try {
      const { data, isError, message } = await apiRequest({
        method: "get",
        url: `${BASE_URL}${ENDPOINTS.GET_ALL_NODES}`,
      });
      return { data, isError, message };
    } catch (error) {
      const errorMessage = prepareErrorMessage(
        error,
        "An unexpected error occurred while fetching All CGPT Files."
      );
      // Optionally log error details for debugging
      console.error("Fetch All CGPT Files Error:", error);

      return { data: null, isError: true, message: errorMessage };
    } 
  }; 

  return {
    fetchAllNodes,
  };
};

export default useNodeServiceApis;
