import axios from "axios";

const API_URL = "http://localhost:3005/api/v3/tasks/paginated";

function handleError(error /**: any*/, initialMessage="") {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data || error.message || "An error occurred";
    console.error(`${initialMessage} Axios error:`, message);
  } else {
    console.error(`${initialMessage} General error:`, error);
  }
}

const fetchPaginatedTasks = async (page = 1, pageSize = 5) => {
  try {
    const response = await axios.get(`${API_URL}?page=${page}&pageSize=${pageSize}`);
    console.log("[fetchPaginatedTasks]:", response.data);
  } catch (error) {
    // console.error("[fetchPaginatedTasks]: Error fetching paginated tasks:", error);
    handleError(error, "[fetchPaginatedTasks]: Error fetching paginated tasks:")
  }
};

// Example usage
fetchPaginatedTasks(1, 5);
