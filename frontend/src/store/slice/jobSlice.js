import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { JOB_API_ENDPOINT } from "../../utils/constant";

export const fetchJobs = createAsyncThunk(
  "job/fetchJobs",
  async ({ jobByText, filters }) => {
    const params = {
      keyword: jobByText.keyword,
      location: jobByText.location,
    };

    if (filters.freshness) {
      params.freshness = filters.freshness;
    }
    if (filters.experienceLevel && filters.experienceLevel.max > 0) {
      params.experienceLevel = {
        max: filters.experienceLevel.max,
      };
    }
    if (filters.salary?.min > 0 || filters.salary?.max > 0) {
      params.salary = {
        min: filters.salary.min,
        max: filters.salary.max,
      };
    }
    if (filters.jobType?.length > 0) {
      params.jobType = filters.jobType;
    }

    const res = await axios.get(`${JOB_API_ENDPOINT}/get`, {
      params,
      withCredentials: true,
    });
    return res.data.success ? res.data.job : [];
  }
);

const jobSlice = createSlice({
  name: "job",
  initialState: {
    jobs: [],
    singleJob: null,
    jobByText: {
      keyword: "",
      location: "",
    },
    filters: {
      jobType: [],
      salary: { min: 0, max: 0 },
      experienceLevel: { min: 0, max: 0 },
      freshness: "",
    },
    allAdminJobs: [],
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
    setAppliedJobs: (state, action) => {
      state.appliedJobs = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setJobByText: (state, action) => {
      state.jobByText[action.payload.field] = action.payload.value;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearJobByText: (state) => {
      state.jobByText = {
        keyword: "",
        location: "",
      };
    },
    clearjobByFilter: (state) => {
      state.filters = {
        jobType: [],
        salary: { min: 0, max: 0 },
        experienceLevel: { min: 0, max: 0 },
        freshness: "",
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const {
  setJob,
  setSingleJob,
  setAdminJobs,
  setAppliedJobs,
  setSearchQuery,
  setJobByText,
  setFilters,
  clearJobByText,
  clearjobByFilter,
} = jobSlice.actions;
export default jobSlice.reducer;
