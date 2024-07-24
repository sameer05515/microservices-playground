import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    data:[],
    refreshResumeList: false,
  };

  export const resumeSlice = createSlice({
    name: 'resumes',
    initialState,
    reducers: {
      setRefreshResumeList: (state, action) => {
        state.refreshResumeList = action.payload;
      },
    },
  });
  
  export const { setRefreshResumeList } = resumeSlice.actions;
  
  export const selectRefreshResumeList = (state) => state.resumes.refreshResumeList;
  
  export default resumeSlice.reducer;