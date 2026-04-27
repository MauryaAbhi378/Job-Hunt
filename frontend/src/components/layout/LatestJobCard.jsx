import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

const LatestJobCard = ({ job }) => {
  const navigate = useNavigate();
  
  // jobType is an array, grab the first value
  const jobTypeValue = Array.isArray(job?.jobType) ? job.jobType[0] : job?.jobType;

  const getJobTypeBadgeColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'remote':
        return 'bg-blue-100 text-blue-600';
      case 'full-time':
      case 'fulltime':
        return 'bg-orange-100 text-orange-600';
      case 'hybrid':
        return 'bg-blue-100 text-blue-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      {/* Job Type Badge */}
      <div className="flex justify-between items-start mb-4">
        <Badge 
          className={`${getJobTypeBadgeColor(jobTypeValue)} font-medium px-3 py-1 text-xs uppercase tracking-wide`}
          variant="ghost"
        >
          {jobTypeValue || 'FULL-TIME'}
        </Badge>
        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
          {job?.company?.logo ? (
            <img
              src={job.company.logo}
              alt="Company Logo"
              className="w-6 h-6 object-contain"
            />
          ) : (
            <div className="w-6 h-6 bg-gray-300 rounded"></div>
          )}
        </div>
      </div>

      {/* Job Title */}
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {job?.title || 'Job Title'}
      </h3>

      {/* Company Name */}
      <p className="text-gray-600 mb-4">
        {job?.company?.name || 'Company Name'}
      </p>

      {/* Skills/Requirements */}
      <div className="flex flex-wrap gap-2 mb-6">
        {job?.requirements?.slice(0, 2).map((skill, index) => (
          <span 
            key={index}
            className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
          >
            {skill}
          </span>
        )) || (
          <>
            <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
              Skill 1
            </span>
            <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
              Skill 2
            </span>
          </>
        )}
      </div>

      {/* Salary and Apply Button */}
      <div className="flex justify-between items-center">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">SALARY</p>
          <p className="font-semibold text-gray-900">
            {job?.salary ? 
              `₹${job.salary.min / 1000}k - ₹${job.salary.max / 1000}k` : 
              '₹95k - ₹130k'
            }
          </p>
        </div>
        <button 
          onClick={() => navigate(`/description/${job._id}`)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          Apply Now
        </button>
      </div>
    </div>
  );
};

export default LatestJobCard;
