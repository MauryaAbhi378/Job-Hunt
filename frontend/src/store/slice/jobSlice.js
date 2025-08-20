import { createSlice } from "@reduxjs/toolkit";

const jobSlice = createSlice({
  name: "job",
  initialState: {
    jobs: [],
    singleJob: null,
    allAdminJobs: [],
    searchJobByText: "",
    appliedJobs: [],
    searchQuery: "",
  },
  reducers: {
    setJob: (state, action) => {
      state.jobs = action.payload;
    },
    setSingleJob: (state, action) => {
      state.singleJob = action.payload;
    },
    setAdminJobs: (state, action) => {
      state.allAdminJobs = action.payload;
    },
    setSearchJobByText: (state, action) => {
      state.searchJobByText = action.payload;
    },
    setAppliedJobs: (state, action) => {
      state.appliedJobs = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
  },
});

export const {
  setJob,
  setSingleJob,
  setAdminJobs,
  setSearchJobByText,
  setAppliedJobs,
  setSearchQuery,
} = jobSlice.actions;
export default jobSlice.reducer;
