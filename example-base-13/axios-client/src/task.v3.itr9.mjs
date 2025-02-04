import axios from "axios";

// Axios instance with baseURL
const apiClient = axios.create({
  baseURL: "http://localhost:3005/api/v3/tasks/paginated",
});

class SortingQueryBuilder {
  #sortParams /**: string[]*/ = [];

  static builder() {
    return new SortingQueryBuilder();
  }

  addSort({ field, order = "asc" } /**: { field: string, order?: "asc" | "desc" }*/) {
    this.#sortParams.push(`${field}:${order}`);
    return this;
  }

  build() /**: string*/ {
    return this.#sortParams.join(",");
  }
}

/**
 * This below code is an improvised version as per below:
 * > `params` are the URL parameters to be sent with the request  Must be a plain object or a URLSearchParams object
 *
 */
const fetchTasksSortByMultipleConditions = async (sortQuery = "", page = 1, pageSize = 5) => {
  try {
    const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });

    if (sortQuery) params.append("sort", sortQuery);

    const response = await apiClient.get("/sort", { params });

    console.log(
      "[fetchTasksSortByMultipleConditions]: Task Details:",
      response.data?.tasks
        ?.map(({ dueDate, status } /**: { dueDate: string; status: string }*/) => `${dueDate}_${status}`)
        .join(" ,\n ") || "No tasks found."
    );
  } catch (error) {
    console.error("[fetchTasksSortByMultipleConditions]: Error data:", error);
  }
};

// Example usage
fetchTasksSortByMultipleConditions(
  SortingQueryBuilder.builder().addSort({ field: "status", order: "asc" }).build(),
  2,
  1
);
