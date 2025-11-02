import { combineReducers } from "redux";

// Import all reducers in a grouped object for easier maintainability and scalability
import counterReducer from "./counter/reducer";
import backdropReducer from "./backdrop/reducer";
import applicationStateReducer from "./application-states/reducer";
import crReducer from "./consolidated-report/reducer";
import colorReducer from "./colors/colorReducer";
import contentReducer from "./know-your-positivity/reducer";

// Organize reducer mappings clearly
const reducers = {
  counter: counterReducer,
  backdrop: backdropReducer,
  applicationState: applicationStateReducer,
  crReport: crReducer,
  colors: colorReducer,
  positivityContent: contentReducer,
};

const rootReducer = combineReducers(reducers);

export default rootReducer;
