import { combineReducers } from "redux";
import counterReducer from "./counter/reducer";
import backdropReducer from "./backdrop/reducer";
import applicationStateReducer from "./application-states/reducer";
import crReducer from "./consolidated-report/reducer";
import colorReducer from "./colors/colorReducer";
import contentReducer from "./know-your-positivity/reducer";

const rootReducer = combineReducers({
  counter: counterReducer,
  backdrop: backdropReducer,
  applicationState: applicationStateReducer,
  crReport: crReducer, // Add your consolidatedReportReducer here
  colors: colorReducer, // this reducer is added to demonstrate use of parameterized selector
  positivityContent: contentReducer,
});

export default rootReducer;
