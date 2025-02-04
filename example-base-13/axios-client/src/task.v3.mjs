import axios from "axios";

const API_URL = "http://localhost:3005/api/v3/tasks";

const saveTaskToDB = async () => {
  try {
    const response = await axios.post(API_URL, {
      name: "Sample Task",
      description: "A sample task to demonstrate saving",
      dueDate: "2025-12-31T00:00:00.000Z",
      status: "pending",
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
    console.error("Error saving tasks:", error);
  }
};

saveTaskToDB();
