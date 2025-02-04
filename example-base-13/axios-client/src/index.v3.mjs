// const axios = require("axios");
import axios from "axios";

const API_URL = "http://localhost:3005/api/v3/items";

const saveItemsToDB = async () => {
  try {
    const response = await axios.post(API_URL, { name: "Item A", category: "Tech", price: 100 });
    console.log("Filtered Items:", response.data);
  } catch (error) {
    console.error("Error saving items:", error);
  }
};

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
saveItemsToDB();
fetchItemsWithFilter();
fetchSortedItems();
