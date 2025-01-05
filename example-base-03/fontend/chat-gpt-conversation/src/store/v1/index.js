// store-v1.js

// approach to connect single reducer directly in store
import { createStore } from "redux";
import counterReducer from "../v2/counter/reducer";

// Create the store
const storeV1 = createStore(counterReducer);

export default storeV1;
