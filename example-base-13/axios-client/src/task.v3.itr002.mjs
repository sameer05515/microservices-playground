import axios from "axios";

const API_URL = "http://localhost:3005/api/v3/tasks";

const TaskStatus = ["open", "in-progress", "on-hold", "closed"];
const StatusOrder = {
  open: 1,
  "in-progress": 2,
  "on-hold": 3,
  closed: 4,
};
const savingDisabled = true;

const saveTaskToDB = async () => {
  if (savingDisabled) {
    console.log("saving is disabled!");
    return;
  }
  for (let i = 1; i <= 100; i++) {
    for (let status of TaskStatus) {
      try {
        // Ensure the dueDate format is valid and use a Date object
        const day = String((i % 31) + 1).padStart(2, "0"); // Ensure the day is a two-digit number
        const minutes = String(i % 60).padStart(2, "0"); // Ensure minutes are valid
        const dueDate = new Date(`2025-12-${day}T00:${minutes}:00.000Z`);

        const response = await axios.post(API_URL, {
          name: `Sample Task- ${status} - ${i}`,
          description: "A sample task to demonstrate saving",
          dueDate: dueDate, // Pass Date object directly
          status: status,
        });

        console.log(
          "[saveItemsToDB]: Saved Item: ",
          response.data.message,
          "  ",
          response.data.task.name,
          "  ",
          response.data.task._id
        );
      } catch (error) {
        // Improve error handling to give more useful information
        console.error(
          `[saveItemsToDB]: Error saving task with status "${status}" and index ${i}:`,
          error.response ? error.response.data : error.message
        );
      }
    }
  }
};

const fetchAllTasks = async () => {
  try {
    const response = await axios.get(API_URL);
    console.log("[fetchAllTasks]: Total length: ", response.data.tasks.length);
  } catch (error) {
    console.error("[fetchAllTasks]: Error data:", error);
  }
};

const fetchTasksDetails = async (id = "") => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    console.log("[fetchTasksDetails]: Task Details: ", response.data.task.name);
  } catch (error) {
    console.error("[fetchTasksDetails]: Error data: ", error);
  }
};

const fetchFilteredTasksByStatus = async (status = "") => {
  try {
    const response = await axios.get(
      `${API_URL}/filter?status=${encodeURIComponent(status)}&status=${encodeURIComponent(status)}`
    );
    if (response.data && response.data.tasks) {
      console.log("[fetchFilteredTasksByStatus]: Task Details: ", response.data.tasks.length);
    } else {
      console.error("[fetchFilteredTasksByStatus]: No tasks found.");
    }
  } catch (error) {
    console.error("[fetchFilteredTasksByStatus]: Error data: ", error);
  }
};

const fetchFilteredTasksByStatuses = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/filter?status=${encodeURIComponent("open")}&status=${encodeURIComponent("closed")}`
    );
    if (response.data && response.data.tasks) {
      console.log("[fetchFilteredTasksByStatuses]: Task Details: ", response.data.tasks.length);
    } else {
      console.error("[fetchFilteredTasksByStatuses]: No tasks found.");
    }
  } catch (error) {
    console.error("[fetchFilteredTasksByStatuses]: Error data: ", error);
  }
};
//sort
const fetTasksSortedByStatus = async () => {
  try {
    const response = await axios.get(`${API_URL}/filter?sort=${encodeURIComponent("status")}`);
    if (response.data && response.data.tasks) {
      console.log(
        "[fetTasksSortedByStatus]: Task Details: ",
        response.data.tasks.map(({ status }) => status).join(" , ")
      );
    } else {
      console.error("[fetTasksSortedByStatus]: No tasks found.");
    }
  } catch (error) {
    console.error("[fetTasksSortedByStatus]: Error data: ", error);
  }
};

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

// saveTaskToDB();
// fetchAllTasks();
// fetchTasksDetails("67a1a26feb2c5d1f2d9ccce6");
// fetchFilteredTasksByStatus("open");
fetchFilteredTasksByStatuses();
// fetTasksSortedByStatus();
// fetTasksSortByMultipleConditions();
