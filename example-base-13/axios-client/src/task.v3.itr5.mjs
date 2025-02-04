import axios from "axios";

const API_URL = "http://localhost:3005/api/v3/tasks/paginated";

const fetTasksSortByMultipleConditions = async (page = 1, pageSize = 5) => {
  try {
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

fetTasksSortByMultipleConditions(5, 5);
