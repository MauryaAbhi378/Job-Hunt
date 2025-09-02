import React, { useEffect, useState } from "react";
import Navbar from "../layout/Navbar.jsx";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  APPLICATION_API_END_POINT,
  JOB_API_ENDPOINT,
} from "../../utils/constant";
import { setSingleJob } from "../../store/slice/jobSlice";
import { toast } from "sonner";
import { MapPin, Briefcase, PinIcon } from "lucide-react";
import RelatedJobs from "./RelatedJobs.jsx";
import formatCreatedAt from "../../utils/formatCreatedAt.js";

const JobDescription = () => {
  const { singleJob } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);
  const isIntiallyApplied =
    singleJob?.applications?.some(
      (application) => application.applicant === user?._id
    ) || false;

  const [isApplied, setIsApplied] = useState(isIntiallyApplied);
  const params = useParams();
  const jobId = params.id;
  const dispatch = useDispatch();

  const applyJobHandler = async () => {
    try {
      const res = await axios.get(
        `${APPLICATION_API_END_POINT}/apply/${jobId}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        setIsApplied(true);
        const updatedSingleJob = {
          ...singleJob,
          applications: [...singleJob.applications, { applicant: user?._id }],
        };
        dispatch(setSingleJob(updatedSingleJob));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    console.log(user.role)
    const fetchSingleJob = async () => {
      try {
        const res = await axios.get(`${JOB_API_ENDPOINT}/get/${jobId}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setSingleJob(res.data.job));
          setIsApplied(
            res.data.job.applications.some(
              (application) => application.applicant === user?._id
            )
          );
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchSingleJob();
  }, [jobId, dispatch, user?._id]);

  return (
    <>
      <Navbar />
      <div className="bg-gray-100 min-h-screen py-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10 bg-gray-100">
          <div className="lg:col-span-2">
            <div className="bg-white p-6 shadow rounded-2xl">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-xl font-bold">{singleJob?.title}</h1>
                  <p className="text-gray-700 mt-1">
                    {singleJob?.company?.name || "Company"}
                  </p>
                </div>
                <div className="w-16 h-16 rounded-sm">
                  {singleJob?.company?.logo ? (
                    <img
                      className="w-14 h-14"
                      src={singleJob.company.logo}
                      alt={singleJob.company.name}
                    />
                  ) : (
                    <div className="w-14 h-14 flex items-center justify-center bg-blue-100 text-blue-600 rounded-sm font-bold text-2xl">
                      {singleJob?.company?.name?.[0]?.toUpperCase()}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col flex-wrap gap-2 text-gray-700 text-md mt-4">
                <div className="flex justify-between w-[40%]">
                  <div className="flex items-center gap-2">
                    <Briefcase size={16} />
                    {singleJob?.experienceLevel.min} -{" "}
                    {singleJob?.experienceLevel.max} yrs
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xl">₹</span>
                    {singleJob?.salary.min / 1000}K -{" "}
                    {singleJob?.salary.max / 1000}K / month
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <PinIcon size={15} />
                  {singleJob?.jobType}
                </div>

                <div className="flex items-center gap-2">
                  <MapPin size={16} />
                  {singleJob?.location}
                </div>
              </div>

              <div className="flex items-center justify-between border-t mt-4 pt-4">
                <div className="flex flex-wrap gap-6 ite text-gray-500 text-md">
                  <p>
                    Posted:{" "}
                    <span className="text-black font-medium">
                      {formatCreatedAt(singleJob?.createdAt)}
                    </span>
                  </p>
                  <p>
                    Openings:{" "}
                    <span className="text-black font-medium">
                      {singleJob?.position}
                    </span>
                  </p>
                  <p>
                    Applicants:{" "}
                    <span className="text-black font-medium">
                      {singleJob?.applications?.length}
                    </span>
                  </p>
                </div>

                <div className="flex justify-end gap-3">
                  {user.role === "student" && (
                    <Button
                      onClick={isApplied ? null : applyJobHandler}
                      disabled={isApplied}
                      className={`rounded-full px-6 ${
                        isApplied
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700"
                      }`}
                    >
                      {isApplied ? "Already Applied" : "Apply"}
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white p-6 shadow rounded-2xl mt-6">
              <div>
                <h2 className="font-semibold text-lg mb-1">Job Description</h2>
                <p className="text-gray-700 leading-relaxed">
                  {singleJob?.description}
                </p>
              </div>
              <div className=" font-semibold text-lg mt-5">
                <p>Key Skills</p>
                {singleJob?.requirements?.map((skill, index) => (
                  <Badge
                    className="text-sm mt-2 mr-2"
                    key={index}
                    variant="white"
                  >
                    {skill.trim()}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Related Jobs */}
          <div>
            {user.role === "student" && (
              <RelatedJobs currentJobId={jobId} title={singleJob?.title} />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default JobDescription;
