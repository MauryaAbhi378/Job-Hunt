import React from "react";
import axios from "axios";
import { useEffect } from "react";
import { JOB_API_ENDPOINT } from "../utils/constant";
import { useDispatch } from "react-redux";
import { setAdminJobs } from "../store/slice/jobSlice";

const useGetAllAdminJobs = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchAdminJobs = async () => {
      try {
        const res = await axios.get(`${JOB_API_ENDPOINT}/getadminjobs`, {
          withCredentials: true,
        });

        // console.log(res.data)
        if (res.data.success) {
          dispatch(setAdminJobs(res.data.jobs));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchAdminJobs();
  }, [dispatch]);
};

export default useGetAllAdminJobs;
