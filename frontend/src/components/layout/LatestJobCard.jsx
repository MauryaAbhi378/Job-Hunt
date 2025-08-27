import React from "react";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

const LatestJobCard = ({ job }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/description/${job._id}`)}
      className="p-5 rounded-2xl shadow-md hover:shadow-lg cursor-pointer bg-white border border-gray-100 flex flex-col justify-between h-full hover:bg-blue-100 transition-all duration-500 ease-out"
    >
      <div className="flex flex-row items-center gap-6">
        {job?.company?.logo ? (
          <img
            src={job.company.logo}
            alt="Company Logo"
            className="w-16 h-16 object-contain rounded-md"
          />
        ) : (
          <div className="w-16 h-16 bg-blue-200 text-blue-600 flex items-center justify-center rounded-md font-bold text-2xl">
            {job?.company?.name?.[0] || "C"}{" "}
          </div>
        )}
        <div>
          <h2 className="font-bold text-xl">{job?.company?.name}</h2>
          <p className="text-sm text-gray-600">{job?.location}</p>
        </div>
      </div>

      <div className="mt-4">
        <h1 className="font-bold text-xl">{job?.title}</h1>
        <p className="text-sm text-gray-600 mt-2 line-clamp-3">
          {job?.description}
        </p>
      </div>

      <div className="flex gap-3 mt-4 flex-wrap">
        <Badge
          className="text-[#F83002] bg-[#f7c6bb] font-bold px-3 py-2 "
          variant="ghost"
        >
          {job?.position} Vacanies
        </Badge>
        <Badge
          className="text-blue-500 bg-blue-100 font-bold px-3 py-2 "
          variant="ghost"
        >
          {job?.jobType}
        </Badge>
        <Badge
          className="text-[#7209b7] bg-[#d49ef7] font-bold px-3 py-2 "
          variant="ghost"
        >
          ₹{job.salary.min / 1000}K - ₹{job.salary.max / 1000}K{" "}
          <span className="text-xs">/month</span>
        </Badge>
      </div>
    </div>
  );
};

export default LatestJobCard;
