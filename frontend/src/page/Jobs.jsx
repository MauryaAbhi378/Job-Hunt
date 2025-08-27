import React, { useEffect } from "react";
import Navbar from "../components/layout/Navbar";
import FilterCard from "../components/layout/FilterCard";
import JobCard from "../components/layout/JobCard";
import { useDispatch, useSelector } from "react-redux";
import JobSearch from "../components/layout/JobSearch";
import {
  clearjobByFilter,
  clearJobByText,
  fetchJobs,
} from "../store/slice/jobSlice";

const Jobs = () => {
  const { jobs = [], jobByText, loading } = useSelector((store) => store.job);
  const dispatch = useDispatch();

  useEffect(() => {
    // console.log(jobs)
    if (jobByText.keyword === "" || jobByText.location === "") {
      dispatch(fetchJobs());
    }
  }, [dispatch, jobByText, jobs]);

  useEffect(() => {
    return () => {
      dispatch(clearJobByText());
      dispatch(clearjobByFilter());
    };
  }, [dispatch]);

  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto mt-6">
        <JobSearch />
      </div>
      <div className="max-w-7xl mx-auto mt-5">
        <div className="flex gap-25">
          <div className="w-1/5">
            <FilterCard />
          </div>
          <div className="flex-1 h-[80vh] overflow-y-auto pb-6">
            {loading ? (
              <span>Loading jobs...</span>
            ) : jobs.length === 0 ? (
              <span>No jobs found</span>
            ) : (
              <div className="">
                {jobs.map((job) => (
                  <JobCard key={job._id} job={job} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobs;
