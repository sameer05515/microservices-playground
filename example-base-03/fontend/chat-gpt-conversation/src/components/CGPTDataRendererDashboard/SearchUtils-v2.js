import { isValidArray, isValidNumber, isValidString } from "../../common/utils/basic-validations";
import { getSanitizedString } from "../../common/utils/safely-updations";
import { prepareErrorMessage } from "./message-preparation-utils-v2";

const validateOrThrow = (result = false, errorMessage = "") => {
  if (!result) {
    throw new Error(errorMessage || "Validation failed!");
  }

  return true;
};

const validateSearchArguments = (data = [], query = "", startIndex = 0, limit = 10) => {
  validateOrThrow(isValidArray(data), "Input data must be an array");
  validateOrThrow(isValidString(query), `query is not a valid string '${query}'`);
  validateOrThrow(isValidNumber(startIndex) && startIndex >= 0, "Start index must be a non-negative number");
  validateOrThrow(isValidNumber(limit) && limit > 0, "Limit must be greater than zero");

  return true;
};

export const getFilteredDataForSearchQueryWithPagination = (
  data = [],
  query = "",
  startIndex = 0,
  limit = 10
) => {
  try {
    validateSearchArguments(data, query, startIndex, limit);
    throw new Error("This method not fully implemented yet!!");
  } catch (error) {
    const errorMessage = prepareErrorMessage(error, "An unexpected error occurred during data fetching");
    console.error(`Error fetching data: ${errorMessage}`, error);
    return {
      data: [],
      isError: true,
      message: errorMessage,
    };
  }
};

// export const getFilteredDataForSearchQuery = async (data = [], query = "") => {
//   try {
//     validateOrThrow(isValidArray(data), "Input data must be an array");
//     validateOrThrow(isValidString(query), `query is not a valid string '${query}'`);

//     const lowerQuery = getSanitizedString(query).toLowerCase();

//     const filteredData = data.filter(
//       ({ title, messages }) =>
//         title.toLowerCase().includes(lowerQuery) ||
//         messages.some((msg) => msg.text.toLowerCase().includes(lowerQuery))
//     );

//     return { data: filteredData, isError: false, message: "Successfully filtered data" };
//   } catch (error) {
//     const errorMessage = prepareErrorMessage(error, "An unexpected error occurred during data fetching");
//     console.error(`Error fetching data: ${errorMessage}`, error);
//     return {
//       data: [],
//       isError: true,
//       message: errorMessage,
//     };
//   }
// };


export const getFilteredDataForSearchQuery = (data = [], query = "") => {
  return new Promise((resolve, reject) => {
    try {
      validateOrThrow(isValidArray(data), "Input data must be an array");
      validateOrThrow(isValidString(query), `Query is not a valid string: '${query}'`);

      const lowerQuery = getSanitizedString(query).toLowerCase();

      const filteredData = data.filter(
        ({ title, messages }) =>
          title.toLowerCase().includes(lowerQuery) ||
          messages.some((msg) => msg.text.toLowerCase().includes(lowerQuery))
      );

      resolve({
        data: filteredData,
        isError: false,
        message: "Successfully filtered data",
      });
    } catch (error) {
      const errorMessage = prepareErrorMessage(
        error,
        "An unexpected error occurred during data fetching"
      );
      console.error(`Error fetching data: ${errorMessage}`, error);
      
      reject({
        data: [],
        isError: true,
        message: errorMessage,
      });
    }
  });
};
