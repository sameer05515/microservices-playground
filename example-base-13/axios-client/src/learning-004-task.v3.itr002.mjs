import axios from "axios";

const API_URL = "http://localhost:3005/api/v3/tasks";
const TASK_STATUSES = ["open", "in-progress", "on-hold", "closed"];
const STATUS_ORDER = Object.freeze({
  open: 1,
  "in-progress": 2,
  "on-hold": 3,
  closed: 4,
});
const savingDisabled = true;

/**
 * Saves batches of tasks for each status and index. Makes requests in parallel for efficiency.
 */
const saveTasksToDB = async () => {
  if (savingDisabled) {
    console.log("Saving is disabled!");
    return;
  }
  for (let i = 1; i <= 100; i++) {
    const day = String((i % 31) + 1).padStart(2, "0");
    const minutes = String(i % 60).padStart(2, "0");
    const dueDate = new Date(`2025-12-${day}T00:${minutes}:00.000Z`);

    // Parallel: batch insert all statuses for each i
    const createPromises = TASK_STATUSES.map((status) =>
      axios
        .post(API_URL, {
          name: `Sample Task - ${status} - ${i}`,
          description: "A sample task to demonstrate saving",
          dueDate,
          status,
        })
        .then((res) =>
          console.log(
            "[saveTasksToDB]: Saved Item:",
            res.data.message,
            res.data.task?.name,
            res.data.task?._id
          )
        )
        .catch((err) =>
          console.error(
            `[saveTasksToDB]: Error for status "${status}" index ${i}:`,
            err?.response?.data || err.message || err
          )
        )
    );
    await Promise.all(createPromises);
  }
};

const fetchAllTasks = async () => {
  try {
    const { data } = await axios.get(API_URL);
    console.log("[fetchAllTasks]: Total length:", data.tasks?.length ?? 0);
  } catch (error) {
    console.error("[fetchAllTasks]:", error?.response?.data || error.message || error);
  }
};

const fetchTaskDetails = async (id = "") => {
  if (!id) {
    console.error("[fetchTaskDetails]: No ID provided.");
    return;
  }
  try {
    const { data } = await axios.get(`${API_URL}/${id}`);
    console.log("[fetchTaskDetails]:", data.task?.name);
  } catch (error) {
    console.error("[fetchTaskDetails]:", error?.response?.data || error.message || error);
  }
};

/**
 * Fetch tasks filtered by a single status.
 * Avoids duplicate query parameter.
 */
const fetchTasksByStatus = async (status = "") => {
  if (!status) {
    console.error("[fetchTasksByStatus]: Status is required.");
    return;
  }
  try {
    const { data } = await axios.get(`${API_URL}/filter`, {
      params: { status },
    });
    if (data.tasks) {
      console.log("[fetchTasksByStatus]: Count:", data.tasks.length);
    } else {
      console.error("[fetchTasksByStatus]: No tasks found.");
    }
  } catch (error) {
    console.error("[fetchTasksByStatus]:", error?.response?.data || error.message || error);
  }
};

/**
 * Fetch tasks filtered by multiple statuses.
 * Accepts an array and uses repeated query params (axios handles this).
 */
const fetchTasksByMultipleStatuses = async (statuses = ["open", "closed"]) => {
  try {
    const { data } = await axios.get(`${API_URL}/filter`, {
      params: { status: statuses },
      paramsSerializer: (params) =>
        params.status.map((s) => `status=${encodeURIComponent(s)}`).join("&"),
    });
    if (data.tasks) {
      console.log("[fetchTasksByMultipleStatuses]: Count:", data.tasks.length);
    } else {
      console.error("[fetchTasksByMultipleStatuses]: No tasks found.");
    }
  } catch (error) {
    console.error("[fetchTasksByMultipleStatuses]:", error?.response?.data || error.message || error);
  }
};

/**
 * Fetches tasks sorted by status.
 */
const fetchTasksSortedByStatus = async () => {
  try {
    const { data } = await axios.get(`${API_URL}/filter`, {
      params: { sort: "status" },
    });
    if (data.tasks) {
      console.log(
        "[fetchTasksSortedByStatus]:",
        data.tasks.map(({ status }) => status).join(", ")
      );
    } else {
      console.error("[fetchTasksSortedByStatus]: No tasks found.");
    }
  } catch (error) {
    console.error("[fetchTasksSortedByStatus]:", error?.response?.data || error.message || error);
  }
};

/**
 * Fetches tasks sorted by multiple conditions.
 * sortOrder example: "dueDate:asc,status:desc"
 */
const fetchTasksSortByMultiple = async (
  sortOrder = "dueDate:asc,status:desc"
) => {
  try {
    const { data } = await axios.get(`${API_URL}/sort`, {
      params: { sort: sortOrder },
    });
    if (data.tasks) {
      console.log(
        "[fetchTasksSortByMultiple]:",
        data.tasks
          .map(({ dueDate, status }) => `${dueDate}_${status}`)
          .join(" ,\n ")
      );
    } else {
      console.error("[fetchTasksSortByMultiple]: No tasks found.");
    }
  } catch (error) {
    console.error("[fetchTasksSortByMultiple]:", error?.response?.data || error.message || error);
  }
};

// Example usage (uncomment as needed):
// await saveTasksToDB();
// await fetchAllTasks();
// await fetchTaskDetails("67a1a26feb2c5d1f2d9ccce6");
// await fetchTasksByStatus("open");
fetchTasksByMultipleStatuses(); // defaults to ["open", "closed"]
// await fetchTasksSortedByStatus();
// await fetchTasksSortByMultiple();
