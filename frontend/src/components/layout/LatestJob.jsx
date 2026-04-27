import LatestJobCard from "./LatestJobCard";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const LatestJob = () => {
  const { jobs = [] } = useSelector((store) => store.job);
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto my-20 px-4">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-12">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Latest job openings</h1>
          <p className="text-gray-600 text-lg max-w-md">
            Discover your next career move with top-tier companies offering
            the best benefits and culture.
          </p>
        </div>
        <button
          onClick={() => navigate('/jobs')}
          className="flex items-center gap-2 text-blue-500 font-medium"
        >
          View All Jobs
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <span className="text-gray-500 text-lg">No Jobs available</span>
          </div>
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
