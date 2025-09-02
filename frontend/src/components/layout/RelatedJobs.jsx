import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { MapPin } from "lucide-react";
import formatCreatedAt from "../../utils/formatCreatedAt.js";
import { useNavigate } from "react-router-dom";

const RelatedJobs = ({ currentJobId, title }) => {
  const [relatedJobs, setRelatedJobs] = useState([]);
  const { jobs } = useSelector((store) => store.job);
  const navigate = useNavigate();

  useEffect(() => {
    const isSimilarities = (jobTitle, searchTitle) => {
      const jobWord = jobTitle.split(" ")[0];
      const searchWord = searchTitle.split(" ")[0];
      return jobWord.toLowerCase() === searchWord.toLowerCase();
    };

    const related = jobs.filter(
      (job) => job._id !== currentJobId && isSimilarities(job.title, title)
    );

    setRelatedJobs(related.slice(0, 3));
  }, [currentJobId, title, jobs]);

  return (
    <div className="max-w-4xl bg-white rounded-2xl p-4">
      <h2 className="text-lg font-semibold">Jobs might you interested in</h2>

      {relatedJobs.length === 0 ? (
        <p>No jobs Found</p>
      ) : (
        <>
          <div className="grid">
            {relatedJobs.map((job, index) => (
              <div
                key={job._id}
                className="p-3 hover:cursor-pointer"
                onClick={() => navigate(`/description/${job._id}`)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text- text-lg">{job.title}</h3>
                    <p className="text-sm text-gray-600">{job.company.name}</p>
                  </div>
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
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="mt-2 text-sm font-medium text-gray-700">
                      ₹{job.salary.min / 1000}K - ₹{job.salary.max / 1000}K
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <MapPin size={16} />
                      {job?.location}
                    </div>
                  </div>
                  <p className="text-sm mt-8">
                    Posted {formatCreatedAt(job?.createdAt)}
                  </p>
                </div>
                {index !== relatedJobs.length - 1 && (
                  <hr className="h-[1px] bg-gray-300 border-none max-w-3xl mx-auto mt-5" />
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default RelatedJobs;
