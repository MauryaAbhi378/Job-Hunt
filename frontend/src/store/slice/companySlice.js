import { createSlice } from "@reduxjs/toolkit";

const companySlice = createSlice({
  name: "company",
  initialState: {
    singleCompany: null,
    companies: [],
    searchCompanyByText: "",
  },
  reducers: {
    setSingleCompany: (state, action) => {
      state.singleCompany = action.payload;
    },
    setCompanies: (state, action) => {
      state.companies = action.payload;
      // When fresh company data loads, clear stale singleCompany so the
      // sidebar always reflects the current recruiter's actual company.
      state.singleCompany = null;
    },
    setSearchCompanyByText: (state, action) => {
      state.searchCompanyByText = action.payload;
    },
    clearCompanyState: (state) => {
      state.singleCompany = null;
      state.companies = [];
      state.searchCompanyByText = "";
    },
  },
});
export const { setSingleCompany, setCompanies, setSearchCompanyByText, clearCompanyState } =
  companySlice.actions;
export default companySlice.reducer;
