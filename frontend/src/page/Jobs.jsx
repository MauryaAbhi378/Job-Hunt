import React, { useEffect, useState } from "react";
import Navbar from "../components/layout/Navbar";
import FilterCard from "../components/layout/FilterCard";
import JobCard from "../components/layout/JobCard";
import { useSelector } from "react-redux";

const Jobs = () => {
  const { jobs = [], searchQuery } = useSelector((store) => store.job);
  const [filteredJobs, setFilteredJobs] = useState(jobs);

  useEffect(() => {
    if (searchQuery) {
      const search = searchQuery.toLowerCase();

      const filtered = jobs.filter((job) => {
        const title = job?.title ? job.title.toString().toLowerCase() : "";
        const description = job?.description
          ? job.description.toString().toLowerCase()
          : "";
        const location = job?.location
          ? job.location.toString().toLowerCase()
          : "";

        return (
          title.includes(search) ||
          description.includes(search) ||
          location.includes(search)
        );
      });

      setFilteredJobs(filtered);
    } else {
      setFilteredJobs(jobs);
    }
  }, [jobs, searchQuery]);

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto mt-5">
        <div className="flex gap-5">
          <div className="w-20%">
            <FilterCard />
          </div>
          {filteredJobs.length === 0 ? (
            <span>Job Not Found</span>
          ) : (
            <div className="flex-1 h-[80vh] overflow-y-auto pb-6">
              <div className="grid grid-cols-3 gap-4">
                {filteredJobs.map((job) => (
                  <div>
                    <JobCard key={job._id} job={job} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Jobs;
