import React from "react";
import { Bookmark } from "lucide-react";
import { useNavigate } from "react-router-dom";
import formatCreatedAt from "../../utils/formatCreatedAt";

const JobCard = ({ job }) => {
  const navigate = useNavigate();

  return (
    <div
      className="p-6 rounded-lg bg-white border border-gray-200 hover:shadow-lg transition-shadow mb-3 hover:cursor-pointer"
      onClick={() => navigate(`/description/${job._id}`)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {job?.company?.logo ? (
            <img
              src={job.company.logo}
              alt="Company Logo"
              className="w-10 h-10 object-contain"
            />
          ) : (
            <div className="w-10 h-10 bg-blue-100 text-blue-600 flex items-center justify-center rounded font-bold text-sm">
              {job?.company?.name?.[0]}
            </div>
          )}
          <div>
            <h2 className="font-bold text-lg text-gray-900">{job?.title}</h2>
            <p className="text-sm text-gray-600">
              {job?.company?.name} • {job?.location}
            </p>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <Bookmark className="h-5 w-5" />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-4">
        <div>
          <p className="text-xs text-gray-500  tracking-wide mb-1">
            Experience
          </p>
          {job?.experienceLevel.min === 0 && job?.experienceLevel.max === 0 ? (
            <p>Fresher</p>
          ) : (
            <p className="text-sm font-medium text-gray-900">
              {job?.experienceLevel.min} to {job?.experienceLevel.max} Years
            </p>
          )}
        </div>
        <div>
          <p className="text-xs text-gray-500  tracking-wide mb-1">Job Type</p>
          <p className="text-sm font-medium text-gray-900">{job?.jobType}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500  tracking-wide mb-1">Salary</p>
          <p className="text-sm font-medium text-gray-900">
            {`₹${job.salary.min / 1000}k - ₹${job.salary.max / 1000}k`}

            <span className="text-xs text-gray-500 font-normal">
              {" "}
              per month
            </span>
          </p>
        </div>
      </div>

      <div className="text-xs text-gray-500">
        Posted {formatCreatedAt(job.createdAt)}
      </div>
    </div>
  );
};

export default JobCard;
