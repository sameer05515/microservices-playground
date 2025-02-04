import axios from "axios";

const API_URL = "http://localhost:3005/api/v3/tasks/paginated";

function handleError(error /**: any*/, initialMessage = "") {
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
    handleError(error, "[fetchPaginatedTasks]: Error fetching paginated tasks:");
  }
};

const fetchPaginatedFilteredTasksByStatus = async (status = "", page = 1, pageSize = 5) => {
  try {
    const response = await axios.get(
      `${API_URL}/filter?page=${page}&pageSize=${pageSize}&status=${encodeURIComponent(status)}`
    );
    // const response = await axios.get(`${API_URL}/filter?status=${encodeURIComponent(status)}`);
    console.log("[fetchPaginatedFilteredTasksByStatus]:", response.data);
    if (response.data && response.data.tasks) {
      console.log("[fetchPaginatedFilteredTasksByStatus]: Task Details: ", response.data.tasks.length);
    } else {
      console.error("[fetchPaginatedFilteredTasksByStatus]: No tasks found.");
    }
  } catch (error) {
    console.error("[fetchPaginatedFilteredTasksByStatus]: Error data: ", error);
  }
};

const fetTasksSortByMultipleConditions = async (page = 1, pageSize = 5) => {
  try {
    // const response = await axios.get(`${API_URL}/sort?sort=${encodeURIComponent("dueDate:asc,status:desc")}`);
    const response = await axios.get(
      `${API_URL}/sort?page=${page}&pageSize=${pageSize}&sort=${encodeURIComponent("status:desc,dueDate:asc")}`
    );
    if (response.data && response.data.tasks) {
      console.log(
        "[fetTasksSortByMultipleConditions]: Task Details: ",
        response.data.tasks.map(({ dueDate, status }) => `${dueDate}_${status}`).join(" ,\n ")
      );
    } else {
      console.error("[fetTasksSortByMultipleConditions]: No tasks found.");
    }
  } catch (error) {
    console.error("[fetTasksSortByMultipleConditions]: Error data: ", error);
  }
};

// Example usage
// fetchPaginatedTasks(1, 5);
// fetchPaginatedFilteredTasksByStatus("open", 5, 1);
// fetTasksSortByMultipleConditions(5, 1);
Promise.resolve()
  .then(() => {
    console.log("====================================================Step 1");
    return fetchPaginatedTasks(6, 1);
  })
  .then(() => {
    console.log("====================================================Step 2");
    return fetchPaginatedFilteredTasksByStatus("open", 5, 1);
  })
  .then(() => {
    console.log("====================================================Step 3");
    return fetTasksSortByMultipleConditions(5, 1);
  })
  .catch((error) => handleError(error, "Error occurred"))
  .finally(() => console.log("completed finally!!"));
