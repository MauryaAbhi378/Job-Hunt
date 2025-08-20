import axios from "axios";
import { useEffect } from "react";
import { toast } from "sonner";
import { JOB_API_ENDPOINT } from "../utils/constant";
import { useDispatch, useSelector } from "react-redux";
import { setJob } from "../store/slice/jobSlice";

const useGetAllJobs = () => {
  const dispatch = useDispatch();
  const { searchQuery } = useSelector((store) => store.job);

  useEffect(() => {
    const fetchAllJobs = async () => {
      try {
        const res = await axios.get(
          `${JOB_API_ENDPOINT}/get?keyword=${searchQuery}`,
          {
            withCredentials: true,
          }
        );
        if (res.data.success) {
          dispatch(setJob(res.data.job || []));
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch jobs");
        console.error("Error during getting all jobs", error);
      }
    };

    fetchAllJobs(); // call once on mount
  }, [dispatch]);
};

export default useGetAllJobs;
