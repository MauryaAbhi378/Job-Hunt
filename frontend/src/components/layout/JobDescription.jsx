import React, { useEffect, useState } from "react";
import Navbar from "../layout/Navbar.jsx";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  APPLICATION_API_END_POINT,
  JOB_API_ENDPOINT,
} from "../../utils/constant";
import { setSingleJob } from "../../store/slice/jobSlice";
import { toast } from "sonner";
import {
  Banknote,
  Briefcase,
  Building2,
  CheckCircle2,
  Clock3,
  ExternalLink,
  Globe,
  MapPin,
  Send,
  UserRound,
} from "lucide-react";
import RelatedJobs from "./RelatedJobs.jsx";

const formatSalary = (salary) => {
  if (!salary?.min && !salary?.max) return "Not disclosed";
  const formatAmount = (amount) => `${Math.round(Number(amount || 0) / 1000)}K`;
  return `Rs ${formatAmount(salary.min)} - Rs ${formatAmount(salary.max)} / month`;
};

const formatExperience = (experienceLevel) => {
  if (!experienceLevel) return "Not specified";
  if (experienceLevel.min === 0 && experienceLevel.max === 0) return "Fresher";
  return `${experienceLevel.min} - ${experienceLevel.max} years`;
};

const hasHtml = (value) => /<\/?[a-z][\s\S]*>/i.test(value || "");

const stripHtml = (value = "") =>
  value
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const sanitizeQuillHtml = (value = "") =>
  value
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
    .replace(/\son\w+="[^"]*"/gi, "")
    .replace(/\son\w+='[^']*'/gi, "")
    .replace(/\shref=["']javascript:[^"']*["']/gi, "")
    .replace(/\ssrc=["']javascript:[^"']*["']/gi, "");

const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-start gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3.5">
    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white text-blue-600 shadow-sm">
      {React.createElement(icon, { size: 18 })}
    </div>
    <div>
      <p className="text-xs font-medium uppercase text-gray-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-gray-900">{value}</p>
    </div>
  </div>
);

const RichContent = ({ html, fallbackItems }) => {
  if (html && hasHtml(html) && stripHtml(html)) {
    return (
      <div
        className="job-rich-content"
        dangerouslySetInnerHTML={{ __html: sanitizeQuillHtml(html) }}
      />
    );
  }

  const items = Array.isArray(fallbackItems)
    ? fallbackItems.filter(Boolean)
    : [html].filter(Boolean);

  if (items.length === 0) {
    return <p className="text-sm text-gray-500">Details will be shared soon.</p>;
  }

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <p key={`${item}-${index}`} className="text-[15px] leading-7 text-gray-700">
          {item}
        </p>
      ))}
    </div>
  );
};

const CompanyDetail = ({ label, value }) => (
  <div className="flex items-start justify-between gap-4 text-sm">
    <span className="text-gray-500">{label}</span>
    <span className="max-w-[58%] text-right font-semibold text-gray-800">
      {value || "Not specified"}
    </span>
  </div>
);

const JobDescription = () => {
  const { singleJob } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);
  const isInitiallyApplied =
    singleJob?.applications?.some(
      (application) => application.applicant === user?._id
    ) || false;

  const [isApplied, setIsApplied] = useState(isInitiallyApplied);
  const params = useParams();
  const jobId = params.id;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const company = singleJob?.company;
  const companyName = singleJob?.company?.name || "Company";
  const applicationsCount = singleJob?.applications?.length || 0;
  const companyId = company?._id || company;

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
          applications: [
            ...(singleJob?.applications || []),
            { applicant: user?._id },
          ],
        };
        dispatch(setSingleJob(updatedSingleJob));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Unable to apply for job");
    }
  };

  useEffect(() => {
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
      <main className="min-h-screen bg-[#f5f7fb] py-8">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 lg:grid-cols-[minmax(0,1fr)_410px]">
          <section className="space-y-6">
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                  {singleJob?.company?.logo ? (
                    <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden">
                      <img
                        className="max-w-none w-34 h-30"
                        src={singleJob.company.logo}
                        alt={companyName}
                      />
                    </div>
                  ) : (
                    <div className="flex size-14 shrink-0 items-center justify-center rounded-lg border border-gray-100 bg-gray-50">
                      <span className="text-xl font-bold text-blue-600">
                        {companyName?.[0]?.toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div>
                    <h1 className="text-2xl font-bold leading-tight text-gray-950 md:text-[28px]">
                      {singleJob?.title || "Job title"}
                    </h1>
                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-medium text-gray-500">
                      <span className="flex items-center gap-1.5">
                        <Building2 size={15} />
                        {companyName}
                      </span>
                      <span className="flex items-center gap-2">
                        <MapPin size={15} />
                        {singleJob?.location || "Location"}
                      </span>
                      <span className="flex items-center gap-2">
                        <Clock3 size={15} />
                        {singleJob?.jobType || "Job type"}
                      </span>
                    </div>
                  </div>
                </div>

                {user?.role === "student" && (
                  <Button
                    onClick={isApplied ? undefined : applyJobHandler}
                    disabled={isApplied}
                    className={`h-11 rounded-lg px-6 ${
                      isApplied
                        ? "cursor-not-allowed bg-gray-400"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    {isApplied ? (
                      "Already Applied"
                    ) : (
                      <>
                        <Send size={17} />
                        Apply Now
                      </>
                    )}
                  </Button>
                )}
              </div>

              <div className="mt-5 grid grid-cols-1 gap-3 border-t border-gray-100 pt-5 sm:grid-cols-3">
                <InfoRow
                  icon={Banknote}
                  label="Salary"
                  value={formatSalary(singleJob?.salary)}
                />
                <InfoRow
                  icon={Briefcase}
                  label="Experience"
                  value={formatExperience(singleJob?.experienceLevel)}
                />
                <InfoRow
                  icon={UserRound}
                  label="Applicants"
                  value={`${applicationsCount} applied`}
                />
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="border-b border-gray-100 pb-4">
                <h2 className="text-xl font-bold text-gray-950">
                  Job Description
                </h2>
              </div>
              <div className="pt-5">
                <RichContent
                  html={singleJob?.description}
                  fallbackItems={singleJob?.jobDescription}
                />
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-950">Requirements</h2>
              <div className="mt-5 grid gap-3">
                {(singleJob?.requirements || []).length > 0 ? (
                  singleJob.requirements.map((skill, index) => (
                    <div
                      className="flex items-start gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3 text-[15px] text-gray-700"
                      key={`${skill}-${index}`}
                    >
                      <CheckCircle2
                        className="mt-0.5 shrink-0 text-blue-600"
                        size={18}
                      />
                      <span>{skill.trim()}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">
                    Requirements will be shared soon.
                  </p>
                )}
              </div>
            </div>

            {singleJob?.benefits?.length > 0 && (
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-950">Benefits</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {singleJob.benefits.map((benefit, index) => (
                    <Badge
                      className="rounded-lg border-blue-100 bg-blue-50 px-3 py-1.5 text-sm text-blue-700"
                      key={`${benefit}-${index}`}
                      variant="outline"
                    >
                      {benefit}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </section>

          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <div className="overflow-hidden rounded-md border border-gray-200 bg-white shadow-sm">
              <div className="relative h-44 bg-white">
                {company?.logo ? (
                  <img
                    src={company.logo}
                    alt={companyName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center border-b border-gray-100 text-5xl font-bold text-blue-600">
                    {companyName?.[0]?.toUpperCase()}
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent px-5 pb-4 pt-10">
                  <h2 className="text-xl font-bold text-white">{companyName}</h2>
                </div>
              </div>

              <div className="p-6">
                <p className="line-clamp-5 text-sm leading-6 text-gray-600">
                  {company?.description || "Company details will be shared soon."}
                </p>

                <div className="mt-5 space-y-3">
                  <CompanyDetail label="Industry" value={company?.industry} />
                  <CompanyDetail
                    label="Company size"
                    value={
                      company?.companySize
                        ? `${company.companySize} employees`
                        : undefined
                    }
                  />
                </div>

                {companyId && (
                  <button
                    type="button"
                    onClick={() => navigate(`/company/${companyId}`)}
                    className="mt-6 flex h-12 items-center justify-center gap-2 rounded-md border border-blue-200 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
                  >
                    <Globe size={16} />
                    View Company Profile
                    <ExternalLink size={14} />
                  </button>
                )}
              </div>
            </div>

            {user?.role === "student" && (
              <RelatedJobs currentJobId={jobId} title={singleJob?.title || ""} />
            )}
          </aside>
        </div>
      </main>
    </>
  );
};

export default JobDescription;
