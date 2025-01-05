// ConsolidatedServiceApis.js
import { apiRequest } from "../apiClient/v1";
import { prepareErrorMessage } from "../message-preparation-utils-v2";

// Backend URL and Endpoints
const BACKEND_APPLICATION_BASE_URL = "http://localhost:8080";
const BASE_URL = `${BACKEND_APPLICATION_BASE_URL}`;
const ENDPOINTS = {
  WELCOME: "/",
  FETCH_SECTIONS_V1: "/api/sections/v1/fetch-sections-v1",
  FETCH_SECTIONS_V2: "/api/sections/v1/fetch-sections-v2",
  FETCH_SECTIONS_V3: "/api/sections/v1/fetch-sections-v3",
  FETCH_SECTIONS_V4: "/api/sections/v1/fetch-sections-v4",
  FETCH_SECTIONS_V5: "/api/sections/v1/fetch-sections-v5",
  FETCH_SECTIONS_V6: "/api/sections/v1/fetch-sections-v6",
  FETCH_SECTIONS_V7: "/api/sections/v1/fetch-sections-v7",
  FETCH_SECTION_DETAILS_V1: "/api/sections/v1/fetch-section-details-v1",
  FETCH_SECTION_DETAILS_V2: "/api/sections/v1/fetch-section-details-v2",
};

/**
 * @deprecated
 * Generic function to fetch data from a given endpoint.
 * @param {string} endpointUrl - API endpoint URL.
 * @returns {Promise<{data: any, isError: boolean, message: string}>}
 */
const getFromEndpoint = async (endpointUrl) => {
  try {
    const { data, isError, message } = await apiRequest({
      method: "get",
      url: endpointUrl,
    });
    return { data, isError, message };
  } catch (error) {
    const errorMessage = prepareErrorMessage(
      error,
      `An unexpected error occurred while fetching data from endpoint: ${endpointUrl}`
    );
    console.error(errorMessage, error);
    return { data: null, isError: true, message: errorMessage };
  }
};

/**
 * Generic function to fetch data from a given endpoint.
 * @param {string} endpointUrl - API endpoint URL.
 * @param {string} queryParameterObject - Query Parameters as Object.
 * @returns {Promise<{data: any, isError: boolean, message: string}>}
 */
const getFromEndpointV2 = async (endpointUrl, queryParameterObject = {}) => {
  try {
    const { data, isError, message } = await apiRequest({
      method: "get",
      url: endpointUrl,
      params: queryParameterObject || {},
    });
    return { data, isError, message };
  } catch (error) {
    const errorMessage = prepareErrorMessage(
      error,
      `An unexpected error occurred while fetching data from endpoint: ${endpointUrl}`
    );
    console.error(errorMessage, error);
    return { data: null, isError: true, message: errorMessage };
  }
};

/**
 * Fetch welcome message.
 * @returns {Promise<{data: any, isError: boolean, message: string}>}
 */
const getWelcomeMessage = () => getFromEndpoint(`${BASE_URL}${ENDPOINTS.WELCOME}`);

/**
 * @deprecated
 * Fetch all sections (V1).
 * @returns {Promise<{data: any, isError: boolean, message: string}>}
 */
const fetchAllSectionsV1 = () => getFromEndpoint(`${BASE_URL}${ENDPOINTS.FETCH_SECTIONS_V1}`);

/**
 * @deprecated
 * Fetch all sections (V2).
 * @returns {Promise<{data: any, isError: boolean, message: string}>}
 */
const fetchAllSectionsV2 = () => getFromEndpoint(`${BASE_URL}${ENDPOINTS.FETCH_SECTIONS_V2}`);

/**
 * @deprecated
 * Fetch all sections (V3).
 * @returns {Promise<{data: any, isError: boolean, message: string}>}
 */
const fetchAllSectionsV3 = () => getFromEndpoint(`${BASE_URL}${ENDPOINTS.FETCH_SECTIONS_V3}`);

/**
 * @deprecated
 * Fetch all sections (V4).
 * @returns {Promise<{data: any, isError: boolean, message: string}>}
 */
const fetchAllSectionsV4 = () => getFromEndpoint(`${BASE_URL}${ENDPOINTS.FETCH_SECTIONS_V4}`);

/**
 * @deprecated
 * Fetch all sections (V5).
 * @returns {Promise<{data: any, isError: boolean, message: string}>}
 */
const fetchAllSectionsV5 = () => getFromEndpoint(`${BASE_URL}${ENDPOINTS.FETCH_SECTIONS_V5}`);

/**
 * @deprecated
 * Fetch all sections (V6).
 * @returns {Promise<{data: any, isError: boolean, message: string}>}
 */
const fetchAllSectionsV6 = () => getFromEndpoint(`${BASE_URL}${ENDPOINTS.FETCH_SECTIONS_V6}`);

/**
 * Fetch all sections (V7).
 * @returns {Promise<{data: any, isError: boolean, message: string}>}
 */
const fetchAllSectionsV7 = () => getFromEndpointV2(`${BASE_URL}${ENDPOINTS.FETCH_SECTIONS_V7}`);

/**
 * @deprecated
 * Fetch section details (V1).
 * @returns {Promise<{data: any, isError: boolean, message: string}>}
 */
const fetchAllSectionDetailsV1 = (qParamObject = { uniqueId: "", type: "" }) =>
  getFromEndpointV2(`${BASE_URL}${ENDPOINTS.FETCH_SECTION_DETAILS_V1}`, qParamObject);

/**
 * Fetch section details (V2).
 * @returns {Promise<{data: any, isError: boolean, message: string}>}
 */
const fetchAllSectionDetailsV2 = (qParamObject = { uniqueId: "", type: "" }) =>
  getFromEndpointV2(`${BASE_URL}${ENDPOINTS.FETCH_SECTION_DETAILS_V2}`, qParamObject);

const ConsolidatedServiceApis = {
  getWelcomeMessage,
  fetchAllSectionsV1,
  fetchAllSectionsV2,
  fetchAllSectionsV3,
  fetchAllSectionsV4,
  fetchAllSectionsV5,
  fetchAllSectionsV6,
  fetchAllSectionsV7,
  fetchAllSectionDetailsV1,
  fetchAllSectionDetailsV2,
};

export default ConsolidatedServiceApis;
