import React from "react";
import LatestJobCard from "./LatestJobCard";
import { useSelector } from "react-redux";

const LatestJob = () => {
  const { jobs = [] } = useSelector((store) => store.job);

  return (
    <div className="max-w-7xl mx-auto my-15">
      <h1 className="text-2xl font-semibold mb-5 flex">Trending Jobs</h1>
      <div className="grid grid-cols-3 gap-4 my-5">
        {jobs.length === 0 ? (
          <span>No Jobs available</span>
        ) : (
          jobs
            .slice(0, 3)
            .map((job) => <LatestJobCard key={job._id} job={job} />)
        )}
      </div>
    </div>
  );
};

export default LatestJob;
