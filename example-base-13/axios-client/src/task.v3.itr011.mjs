import axios from "axios";

const API_URL = "http://localhost:3005/api/v3/tasks/sort";

const fetTasksSortByMultipleConditions = async () => {
  try {
    const response = await axios.get(`${API_URL}/sort?sort=${encodeURIComponent("dueDate:asc,status:desc")}`);
    // const response = await axios.get(`${API_URL}/sort?sort=${encodeURIComponent("status:desc,dueDate:asc")}`);
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
fetTasksSortByMultipleConditions();
