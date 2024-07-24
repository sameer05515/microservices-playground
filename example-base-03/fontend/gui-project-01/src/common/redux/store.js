import { configureStore } from "@reduxjs/toolkit";

import resumeReducer from './resumeSlice';

const store = configureStore({
    reducer: {
      resumes: resumeReducer,
    },
  });
  
  export default store;