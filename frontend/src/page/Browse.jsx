import React, { useEffect } from "react";
import Navbar from "../components/layout/Navbar.jsx";
import JobCard from "../components/layout/JobCard.jsx";
import { useDispatch, useSelector } from "react-redux";
import { setSearchQuery } from "../store/slice/jobSlice.js";
import useGetAllJobs from "../hooks/useGetAllJobs.jsx";

const Browse = () => {
  useGetAllJobs()
  const { jobs } = useSelector((store) => store.job);
  const dispatch = useDispatch();
  useEffect(() => {
    return () => {
      dispatch(setSearchQuery(""));
    };
  });
  
  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto my-10">
        <h1 className="font-bold text-xl my-10">
          Search Results ({jobs.length})
        </h1>
        <div className="grid grid-cols-3 gap-4 ">
          {jobs.map((job) => {
            return <JobCard key={job._id} job={job} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default Browse;
