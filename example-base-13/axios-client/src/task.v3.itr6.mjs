import axios from "axios";

// Create an axios instance with a base URL
const axiosInstance = axios.create({
  baseURL: "http://localhost:3005/api/v3/tasks"
});

const fetchTasksSortByMultipleConditions = async (page = 1, pageSize = 5) => {
  try {
    // Define the sort query
    const sortQuery = "status:desc,dueDate:asc";

    // Use axios instance and pass query parameters
    const response = await axiosInstance.get("/paginated/sort", {
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
