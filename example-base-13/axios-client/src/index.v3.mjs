// const axios = require("axios");
import axios from "axios";

const API_URL = "http://localhost:3005/api/v3/items";

const categories = ["Tech", "Home", "Entertainment", "Study"];
const savingDisabled=true;

const saveItemsToDB = async () => {
  if(savingDisabled){
    console.log('saving is disabled!');
    return;
  }
  for (let i = 1; i <= 100; i++) {
    for (let cat of categories) {
      try {
        const response = await axios.post(API_URL, { name: `Item-${cat}-${i}`, category: cat, price: 1000 + i });
        console.log("[saveItemsToDB]: Saved Item:", response.data.message, "  ", response.data.item.name, "  ", response.data.item._id );
      } catch (error) {
        console.error("Error saving items:", error);
      }
    }
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
// fetchItemsWithFilter();
// fetchSortedItems();
