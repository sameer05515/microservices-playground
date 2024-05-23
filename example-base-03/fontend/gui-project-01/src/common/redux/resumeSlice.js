import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: [],
  refreshResumeList: false,
  selectedResumeId: null,
};

export const resumeSlice = createSlice({
  name: 'resumes',
  initialState,
  reducers: {
    setRefreshResumeList: (state, action) => {
      state.refreshResumeList = action.payload;
    },
    setSelectedResumeId: (state, action) => {
      state.selectedResumeId = action.payload;
    }
  },
});

export const { setRefreshResumeList, setSelectedResumeId } = resumeSlice.actions;

export const selectRefreshResumeList = (state) => state.resumes.refreshResumeList;
export const selectSelectedResumeId = (state) => state.resumes.selectedResumeId;

export default resumeSlice.reducer;