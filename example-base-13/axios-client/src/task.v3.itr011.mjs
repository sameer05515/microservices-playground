import axios from "axios";

const API_URL = "http://localhost:3005/api/v3/tasks/filter-with-formatted-query";

function handleError(error /**: any*/, initialMessage = "") {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data || error.message || "An error occurred";
    console.error(`${initialMessage} Axios error:`, message);
  } else {
    console.error(`${initialMessage} General error:`, error);
  }
}

const fetchTasksFilteredByQuerySyntax = async () => {
  try {
    const response = await axios.get(`${API_URL}?filter=${encodeURIComponent("status:eq:[open,closed]")}`);
    if (response.data && response.data.tasks) {
      console.log(
        "[fetchTasksFilteredByQuerySyntax]: Task Details: ",
        response.data.tasks.map(({ dueDate, status }) => `${dueDate}_${status}`).join(" , ")
      );
      console.log("[fetchTasksFilteredByQuerySyntax]: Task Details count: ", response.data.tasks.length);
    } else {
      console.error("[fetchTasksFilteredByQuerySyntax]: No tasks found.");
    }
  } catch (error) {
    handleError(error, "[fetchTasksFilteredByQuerySyntax]: Error data: ");
  }
};

// Example usage
fetchTasksFilteredByQuerySyntax();
