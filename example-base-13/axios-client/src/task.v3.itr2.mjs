import axios from "axios";

const API_URL = "http://localhost:3005/tasks/sort";

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
    console.error("[fetchSortedTasks]: Error fetching sorted tasks:", error);
  }
};

// Example usage
fetchSortedTasks(["status", "dueDate"], ["desc", "asc"]);
