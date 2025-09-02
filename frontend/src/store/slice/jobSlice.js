import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { JOB_API_ENDPOINT } from "../../utils/constant";

export const fetchJobs = createAsyncThunk(
  "job/fetchJobs",
  async ({ page, limit, jobByText, filters }) => {
    const params = {
      keyword: jobByText.keyword,
      location: jobByText.location,
      page: page,
      limit: limit,
    };

    if (filters.freshness) {
      params.freshness = filters.freshness;
    }
    if (filters.experienceLevel && filters.experienceLevel.max > 0) {
      params.experienceLevel = {
        max: filters.experienceLevel.max,
      };
    }
    if (filters.salary?.min || filters.salary?.max) {
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
    if (res.data.success) {
      return {
        job: res.data.job,
        totalJob: res.data.totalJob,
        totalPage: res.data.totalPage,
      };
    } else {
      return {
        job: [],
        totalJob: 0,
        totalPage: 0,
      };
    }
  }
);

const jobSlice = createSlice({
  name: "job",
  initialState: {
    loading: false,
    jobs: [],
    page: 1,
    limit: 3,
    totalJob: 0,
    totalPage: 0,
    category: "",
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
    setPage: (state, action) => {
      state.page = action.payload;
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
    clearPage : (state) => {
      state.page = 1
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload.job;
        (state.totalJob = action.payload.totalJob),
          (state.totalPage = action.payload.totalPage);
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const {
  setJob,
  setPage,
  setSingleJob,
  setAdminJobs,
  setAppliedJobs,
  setSearchQuery,
  setJobByText,
  setFilters,
  clearJobByText,
  clearjobByFilter,
  clearPage
} = jobSlice.actions;
export default jobSlice.reducer;
