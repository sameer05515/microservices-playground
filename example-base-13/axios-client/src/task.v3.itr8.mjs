import axios from "axios";

const API_URL = "http://localhost:3005/api/v3/tasks/paginated";

class SortingQueryBuilder {
  #sortParams /**: string[]*/ = [];

  constructor() {
    this.#sortParams = [];
  }

  static builder() {
    return new SortingQueryBuilder();
  }

  addSort({ field /**: string*/, order /**: "asc" | "desc"*/ = "asc" }) /**: SortingQueryBuilder*/ {
    this.#sortParams.push(`${field}:${order === "asc" ? order : "desc"}`);
    return this;
  }

  build() /**: string*/ {
    return this.#sortParams.length > 0 ? encodeURIComponent(this.#sortParams.join(",")) : "";
  }
}

const fetchTasksSortByMultipleConditions = async (sortQuery = "", page = 1, pageSize = 5) => {
  try {
    // Define the sort query
    // const sortQuery = "status:desc,dueDate:asc";
    if (typeof sortQuery !== "string") {
      throw new Error("Invalid sort query: " + sortQuery);
    }

    // Use axios config to pass query params
    const response = await axios.get("/sort", {
      params: {
        page,
        pageSize,
        sort: sortQuery,
      },
      baseURL: API_URL,
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

fetchTasksSortByMultipleConditions(
  SortingQueryBuilder.builder().addSort({ field: "status", order: "asc" }).build(),
  2,
  4
);
