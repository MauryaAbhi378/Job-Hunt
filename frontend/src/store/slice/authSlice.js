import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: false,
    user: null,
    onboardingStatus: null,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      // Clear onboarding status on logout so the next recruiter starts fresh
      if (action.payload === null) {
        state.onboardingStatus = null;
      }
    },
    setOnboardingStatus: (state, action) => {
      state.onboardingStatus = action.payload;
    },
  },
});

export const { setLoading, setUser, setOnboardingStatus } = authSlice.actions;
export default authSlice.reducer;
