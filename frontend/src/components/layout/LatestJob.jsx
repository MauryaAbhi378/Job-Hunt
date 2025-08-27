import React from "react";
import LatestJobCard from "./LatestJobCard";
import { useSelector } from "react-redux";

const LatestJob = () => {
  const { jobs = [] } = useSelector((store) => store.job);
  
  return (
    <div className="max-w-7xl mx-auto my-20">
      <h1 className="text-4xl font-bold mb-3">
        <span className="text-blue-500">Latest & Top</span> Job Openings
      </h1>
      <p className="text-gray-500 mb-2">
        Discover the fresh job openings from the giant firms in which you you
        want to apply <br />
        and take a chance to get hire from top fortune companies
      </p>
      <div className="grid grid-cols-3 gap-4 my-5">
        {jobs.length === 0 ? (
          <span>No Jobs available</span>
        ) : (
          jobs
            .slice(0, 6)
            .map((job) => <LatestJobCard key={job._id} job={job} />)
        )}
      </div>
    </div>
  );
};

export default LatestJob;
