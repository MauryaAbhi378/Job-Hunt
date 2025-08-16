import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slice/authSlice.js";

const store = configureStore({
  reducer: {
    auth: authSlice,
  },
});

export default store;
