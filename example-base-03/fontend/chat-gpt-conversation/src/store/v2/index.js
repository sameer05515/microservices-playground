import { createStore,applyMiddleware } from "redux";
import {thunk} from "redux-thunk";
import rootReducer from "./rootReducer";

// approach to connect multiple reducers after combining them in rootReducer in store
// Create the store with the combined reducers
const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
