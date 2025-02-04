import axios from "axios";

const API_URL = "http://localhost:3005/api/v3/tasks/paginated";

const fetchTasksSortByMultipleConditions = async (page = 1, pageSize = 5) => {
  try {
    // Define the sort query
    const sortQuery = "status:desc,dueDate:asc";

    // Use axios config to pass query params
    const response = await axios.get(API_URL + "/sort", {
      params: {
        page,
        pageSize,
        sort: sortQuery
      }
    });

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

fetchTasksSortByMultipleConditions(5, 5);
