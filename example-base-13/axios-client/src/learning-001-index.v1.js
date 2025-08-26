const axios = require("axios");

const API_URL = "http://localhost:3005/api/v1/items";

// GET request with filtering
const fetchItemsWithFilter = async () => {
  try {
    const response = await axios.get(API_URL, { params: { category: "Tech" } });
    console.log("Filtered Items:", response.data);
  } catch (error) {
    console.error("Error fetching items:", error);
  }
};

// GET request with sorting
const fetchSortedItems = async () => {
  try {
    const response = await axios.get(API_URL, { params: { sortBy: "price" } });
    console.log("Sorted Items:", response.data);
  } catch (error) {
    console.error("Error fetching items:", error);
  }
};

// Execute requests
fetchItemsWithFilter();
fetchSortedItems();
