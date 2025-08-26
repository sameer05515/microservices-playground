import axios from "axios";

const API_URL = "http://localhost:3005/api/v3/tasks/sort";

/**
 * Fetch tasks sorted by given fields and order.
 * @param {string[]} sortFields - Fields to sort by (e.g., ["status", "dueDate"])
 * @param {("asc" | "desc")[]} sortOrders - Corresponding sort orders (default: "asc")
 */
const fetchSortedTasks = async (sortFields = [], sortOrders = []) => {
  try {
    // Construct query string
    const sortQuery = sortFields.map((field, index) => `${field}:${sortOrders[index] || "asc"}`).join(",");

    console.log("sortQuery", sortQuery);
    const response = await axios.get(`${API_URL}?sort=${encodeURIComponent(sortQuery)}`);

    console.log("[fetchSortedTasks]: Sorted Tasks:", response.data.tasks);
  } catch (error) {
    // console.error("[fetchSortedTasks]: Error fetching sorted tasks:", error);
    if (axios.isAxiosError(error)) {
      // Extract meaningful error message and status from backend
      const message = error.response?.data || error.message || "An error occurred";
      // const status = error.response?.status;
      console.error("[fetchSortedTasks]: Error fetching sorted tasks:", message);
      // return {
      //   data: null,
      //   isError: true,
      //   message: typeof message === "string" ? message : JSON.stringify(message),
      //   //status,
      //   // response:undefined,
      //   // error
      // };
    } else {
      console.error("[fetchSortedTasks]: Error fetching sorted tasks:", error);
      // return {
      //   data: null,
      //   isError: true,
      //   message: error ? JSON.stringify(error) : "An error occurred",
      //   // response:undefined,
      //   // error
      // };
    }
  }
};

// Example usage
fetchSortedTasks(["status", "dueDate"], ["desc", "asc"]);
