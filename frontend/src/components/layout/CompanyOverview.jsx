import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Bell, Building2, CircleUserRound } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { COMPANIES_API_ENDPOINT, JOB_API_ENDPOINT } from "../../utils/constant";
import Navbar from "./Navbar";

const formatCompanySize = (size) => {
  if (!size) return "Company size not specified";
  if (size === "1000+") return "1,000+ Employees";
  return `${size.replace("-", "-")} Employees`;
};

const formatSalary = (salary) => {
  if (!salary?.min && !salary?.max) return "Salary not disclosed";
  const min = salary?.min ? `Rs ${Math.round(salary.min / 1000)}k` : "";
  const max = salary?.max ? `Rs ${Math.round(salary.max / 1000)}k` : "";
  return [min, max].filter(Boolean).join(" - ");
};

const normalizeWebsite = (website) => {
  if (!website) return "";
  return website.startsWith("http") ? website : `https://${website}`;
};

const getInitials = (name = "Company") =>
  name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const StatItem = ({ label, value }) => (
  <div>
    <p className="text-[11px] font-bold uppercase tracking-wider text-[#6b687d]">
      {label}
    </p>
    <p className="mt-2 text-sm font-semibold text-[#0d0d16]">{value}</p>
  </div>
);

const JobRow = ({ job }) => {
  const navigate = useNavigate();

  return (
    <article className="flex flex-col gap-4 rounded-xl bg-white p-6 shadow-[0_6px_18px_rgba(22,18,46,0.08)] sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h3 className="text-xl font-bold text-[#0d0d16]">{job.title}</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="rounded-full bg-[#f0edff] px-4 py-1 text-sm font-medium text-[#2516d8]">
            {job.location || "Remote"}
          </span>
          <span className="rounded-full bg-[#f0edff] px-4 py-1 text-sm font-medium text-[#2516d8]">
            {job.jobType || "Full-time"}
          </span>
          <span className="rounded-full bg-[#f0edff] px-4 py-1 text-sm font-medium text-[#2516d8]">
            {formatSalary(job.salary)}
          </span>
        </div>
      </div>
      <button
        type="button"
        onClick={() => navigate(`/description/${job._id}`)}
        className="h-10 rounded-lg bg-[#f0edff] px-8 text-sm font-semibold text-[#1100d8] transition hover:bg-[#e5dfff]"
      >
        View Job
      </button>
    </article>
  );
};

const CompanyOverview = () => {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        const [companyRes, jobsRes] = await Promise.all([
          axios.get(`${COMPANIES_API_ENDPOINT}/get/${id}`, {
            withCredentials: true,
          }),
          axios.get(`${JOB_API_ENDPOINT}/get`, {
            withCredentials: true,
          }),
        ]);

        if (companyRes.data.success) {
          setCompany(companyRes.data.company);
        }

        if (jobsRes.data.success) {
          setJobs(jobsRes.data.job || []);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPageData();
  }, [id]);

  const currentCompany = company;
  const companyName = currentCompany?.name || "Company";
  const companyWebsite = normalizeWebsite(currentCompany?.website);
  const openJobs = useMemo(
    () =>
      jobs.filter((job) => {
        const jobCompanyId = job?.company?._id || job?.company;
        return id ? jobCompanyId === id : true;
      }),
    [id, jobs],
  );
  const visibleJobs = openJobs.length > 0 ? openJobs : [];
  const descriptionBlocks = (currentCompany?.description || "")
    .split(/\n+/)
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-[#faf7ff] text-[#0d0d16]">
      <Navbar />

      <main>
        <section className="relative h-[268px] overflow-visible bg-[#8984b9]">
          <div className="mx-auto h-full max-w-[940px] bg-[linear-gradient(90deg,#272e6f_0%,#272e6f_42%,#8582b6_42%,#8582b6_60%,#245d93_60%,#245d93_100%)] opacity-95" />
          <div className="absolute inset-x-6 bottom-[-52px] mx-auto max-w-[1390px]">
            <div className="relative rounded-xl bg-white px-7 py-8 shadow-[0_8px_22px_rgba(22,18,46,0.14)]">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-7">
                  <div
                    className={`flex size-28 shrink-0 items-center justify-center p-2 ${
                      currentCompany?.logo
                        ? ""
                        : "rounded-xl bg-white shadow-[0_8px_18px_rgba(22,18,46,0.16)]"
                    }`}
                  >
                    {currentCompany?.logo ? (
                      <img
                        src={currentCompany.logo}
                        alt={companyName}
                        className="max-w-none h-36 w-36"
                      />
                    ) : (
                      <span className="flex size-full items-center justify-center rounded-xl bg-white text-4xl font-bold text-[#1300cf]">
                        {getInitials(companyName)}
                      </span>
                    )}
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                      {companyName}
                    </h1>
                    <p className="mt-2 flex items-center gap-2 text-base text-[#686579]">
                      <Building2 className="size-4" />
                      {currentCompany?.industry ||
                        "Industry not specified"}{" "}
                      &bull; {formatCompanySize(currentCompany?.companySize)}
                    </p>
                  </div>
                </div>
                {companyWebsite && (
                  <a
                    href={companyWebsite}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-11 items-center justify-center rounded-lg bg-[#2b19db] px-8 text-sm font-bold text-white transition hover:bg-[#2010bf]"
                  >
                    Visit Website
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto mt-[88px] max-w-[1390px] px-6">
          <div className="flex gap-9 border-b border-[#ddd8e7]">
            {["overview", "jobs"].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`pb-5 text-sm font-bold capitalize ${
                  activeTab === tab
                    ? "border-b-2 border-[#1300ff] text-[#1300ff]"
                    : "text-[#666477]"
                }`}
              >
                {tab === "jobs" ? `Jobs (${openJobs.length})` : "Overview"}
              </button>
            ))}
          </div>

          <div className="grid gap-9 py-9 lg:grid-cols-[minmax(0,1fr)_420px]">
            <div className="space-y-9 lg:col-span-2">
              {activeTab === "overview" && (
                <section className="rounded-xl bg-white p-7 shadow-[0_6px_18px_rgba(22,18,46,0.08)]">
                  <h2 className="text-2xl font-bold">About {companyName}</h2>
                  <div className="mt-6 max-w-[880px] space-y-6 text-[17px] leading-8 text-[#242333]">
                    {descriptionBlocks.length > 0 ? (
                      descriptionBlocks.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))
                    ) : (
                      <p>Company details will be shared soon.</p>
                    )}
                  </div>
                  <div className="mt-9 grid gap-6 rounded-lg bg-[#f0edfb] p-7 sm:grid-cols-3">
                    <StatItem
                      label="Founded"
                      value={currentCompany?.foundedYear || "Not specified"}
                    />
                    <StatItem
                      label="Headquarters"
                      value={currentCompany?.headquarters || "Not specified"}
                    />
                    <StatItem
                      label="Company Type"
                      value={currentCompany?.companyType || "Not specified"}
                    />
                  </div>
                </section>
              )}

              <section>
                <div className="mb-7 flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Open Positions</h2>
                  {openJobs.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setActiveTab("jobs")}
                      className="text-sm font-semibold text-[#1300cf]"
                    >
                      View All {openJobs.length} Jobs
                    </button>
                  )}
                </div>
                <div className="space-y-5">
                  {loading ? (
                    <div className="rounded-xl bg-white p-6 text-[#686579] shadow-[0_6px_18px_rgba(22,18,46,0.08)]">
                      Loading jobs...
                    </div>
                  ) : visibleJobs.length > 0 ? (
                    visibleJobs.map((job) => <JobRow key={job._id} job={job} />)
                  ) : (
                    <div className="rounded-xl bg-white p-6 text-[#686579] shadow-[0_6px_18px_rgba(22,18,46,0.08)]">
                      No open jobs are available right now.
                    </div>
                  )}
                </div>
              </section>
            </div>
          </div>
        </section>
      </main>

      <footer className="mt-8 border-t border-[#ddd8e7] bg-white">
        <div className="mx-auto flex max-w-[1390px] flex-col gap-6 px-6 py-14 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-lg font-bold">JobHunt</h2>
            <p className="mt-3 text-sm text-[#686579]">
              &copy; 2024 JobHunt Professional Network.
            </p>
          </div>
          <div className="flex flex-wrap gap-9 text-sm text-[#686579]">
            <span>About Us</span>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Contact Support</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CompanyOverview;
