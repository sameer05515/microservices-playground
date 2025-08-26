import axios from "axios";
// import { SortingQueryBuilder } from "./SortingQueryBuilder";

const API_URL = "http://localhost:3005/api/v3/tasks/sort";
export class SortingQueryBuilder {
  #sortParams /**: string[]*/ = [];

  addSort(field /**: string*/, order /**: "asc" | "desc"*/ = "asc") /**: SortingQueryBuilder*/ {
    this.#sortParams.push(`${field}:${order}`);
    return this;
  }

  build() /**: string*/ {
    return this.#sortParams.length > 0 ? encodeURIComponent(this.#sortParams.join(",")) : "";
  }
}

//======================================

export class TaskService {
  static async fetchSortedTasks(sortFields /**: string[]*/ = [], sortOrders /**: ("asc" | "desc")[]*/ = []) {
    try {
      // Build sorting query dynamically
      const queryBuilder = new SortingQueryBuilder();
      sortFields.forEach((field, index) => queryBuilder.addSort(field, sortOrders[index] || "asc"));
      const sortQuery = queryBuilder.build();

      console.log("Sort Query:", sortQuery);

      // Send GET request with sort parameters
      const response = await axios.get(`${API_URL}?sort=${sortQuery}`);

      console.log("[fetchSortedTasks]: Sorted Tasks:", response.data.tasks);
    } catch (error) {
      TaskService.handleError(error);
    }
  }

  static handleError(error /**: any*/) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data || error.message || "An error occurred";
      console.error("[fetchSortedTasks]: Axios error:", message);
    } else {
      console.error("[fetchSortedTasks]: General error:", error);
    }
  }
}

// Example usage:
TaskService.fetchSortedTasks(["status", "dueDate"], ["desc", "asc"]);
