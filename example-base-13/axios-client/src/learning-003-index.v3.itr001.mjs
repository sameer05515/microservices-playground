import axios from "axios";

const API_URL = "http://localhost:3005/api/v3/items";
const categories = ["Tech", "Home", "Entertainment", "Study"];
const savingDisabled = true;

// More efficient item saving with Promise.all (per batch)
const saveItemsToDB = async () => {
  if (savingDisabled) {
    console.log('Saving is disabled!');
    return;
  }
  for (let i = 1; i <= 100; i++) {
    const itemPromises = categories.map(cat =>
      axios.post(API_URL, {
        name: `Item-${cat}-${i}`,
        category: cat,
        price: 1000 + i
      }).then(response => {
        console.log(
          "[saveItemsToDB]: Saved Item:",
          response.data.message,
          response.data.item.name,
          response.data.item._id
        );
      }).catch(error => {
        console.error("Error saving item:", error?.response?.data || error.message || error);
      })
    );
    await Promise.all(itemPromises);
  }
};

const fetchItemsWithFilter = async (category = "Tech") => {
  try {
    const response = await axios.get(API_URL, { params: { category } });
    console.log("Filtered Items:", response.data);
  } catch (error) {
    console.error("Error fetching items (with filter):", error?.response?.data || error.message || error);
  }
};

const fetchSortedItems = async (sortBy = "price") => {
  try {
    const response = await axios.get(API_URL, { params: { sortBy } });
    console.log("Sorted Items:", response.data);
  } catch (error) {
    console.error("Error fetching items (with sort):", error?.response?.data || error.message || error);
  }
};

// Unified execution section for demo and flexibility
const run = async () => {
  await saveItemsToDB();
  await fetchItemsWithFilter();
  await fetchSortedItems();
};

run();
