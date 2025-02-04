import axios from "axios";

const API_URL = "http://localhost:3005/api/v3/tasks";

const TaskStatus = ["open", "in-progress", "on-hold", "closed"];

const saveTaskToDB = async () => {
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
          "[saveItemsToDB]: Saved Item:",
          response.data.message,
          "  ",
          response.data.task.name,
          "  ",
          response.data.task._id
        );
      } catch (error) {
        // Improve error handling to give more useful information
        console.error(
          `Error saving task with status "${status}" and index ${i}:`,
          error.response ? error.response.data : error.message
        );
      }
    }
  }
};

saveTaskToDB();
