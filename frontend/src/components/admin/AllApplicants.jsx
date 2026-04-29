import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { BriefcaseBusiness, ChevronRight, Search, Users } from "lucide-react";
import Sidebar from "./Sidebar";
import useGetAllAdminJobs from "../../hooks/useGetAllAdminJobs";

const formatDate = (date) => {
  if (!date) return "—";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
};

const AllApplicants = () => {
  useGetAllAdminJobs();
  const navigate = useNavigate();
  const { allAdminJobs = [] } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return allAdminJobs;
    return allAdminJobs.filter((job) =>
      job.title?.toLowerCase().includes(q)
    );
  }, [allAdminJobs, search]);

  const totalApplicants = allAdminJobs.reduce(
    (sum, job) => sum + (job.applications?.length || 0),
    0
  );

  return (
    <div className="min-h-screen bg-[#f6f8fb] text-[#17233c]">
      <Sidebar />

      <div className="min-h-screen pl-[260px]">
        {/* Header */}
        <header className="flex h-[72px] items-center justify-between border-b border-[#dfe6f0] bg-white px-8">
          <h1 className="text-[22px] font-medium tracking-[-0.01em] text-black">
            Applicants
          </h1>
          <div className="flex items-center gap-7">
            <div className="h-8 w-px bg-[#d8e1ee]" />
            <div className="text-right">
              <p className="text-[15px] font-medium text-[#111827]">
                {user?.fullname || "Recruiter"}
              </p>
              <p className="text-[13px] text-[#64748b]">Lead Recruiter</p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-full border-4 border-[#e7eef8] bg-[#183345] text-sm font-bold uppercase text-white shadow-sm">
              {(user?.fullname || "R").charAt(0)}
            </div>
          </div>
        </header>

        <main className="px-8 py-8">
          {/* Stats */}
          <div className="mb-6 grid grid-cols-2 gap-5 lg:grid-cols-2 max-w-lg">
            <article className="flex items-center gap-4 rounded-xl border border-[#e2e8f0] bg-white px-6 py-5 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#eef0ff] text-[#4f46e5]">
                <BriefcaseBusiness className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[12px] font-bold uppercase tracking-widest text-[#65758f]">
                  Jobs
                </p>
                <p className="text-[28px] font-semibold leading-none text-[#080b13]">
                  {allAdminJobs.length}
                </p>
              </div>
            </article>

            <article className="flex items-center gap-4 rounded-xl border border-[#e2e8f0] bg-white px-6 py-5 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#edf5ff] text-[#2563eb]">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[12px] font-bold uppercase tracking-widest text-[#65758f]">
                  Total Applicants
                </p>
                <p className="text-[28px] font-semibold leading-none text-[#080b13]">
                  {totalApplicants}
                </p>
              </div>
            </article>
          </div>

          {/* Search */}
          <div className="relative mb-5 max-w-md">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by job title..."
              className="h-11 w-full rounded-lg border border-[#dce4ef] bg-white pl-10 pr-4 text-[14px] text-[#17233c] placeholder-[#94a3b8] shadow-sm outline-none focus:border-[#4f46e5] focus:ring-2 focus:ring-[#4f46e5]/20 transition"
            />
          </div>

          {/* Job list */}
          <div className="overflow-hidden rounded-xl border border-[#e2e8f0] bg-white shadow-sm">
            <div className="border-b border-[#eef2f7] px-6 py-4">
              <h2 className="text-[16px] font-semibold text-[#111827]">
                Select a job to view its applicants
              </h2>
            </div>

            {filtered.length > 0 ? (
              <ul className="divide-y divide-[#eef2f7]">
                {filtered.map((job) => {
                  const count = job.applications?.length || 0;
                  return (
                    <li key={job._id}>
                      <button
                        type="button"
                        onClick={() =>
                          navigate(`/admin/jobs/${job._id}/applicants`)
                        }
                        className="flex w-full items-center justify-between px-6 py-5 text-left transition hover:bg-[#f7f9fc]"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#eef0ff] text-[#4f46e5]">
                            <BriefcaseBusiness className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-[15px] font-semibold text-[#111827]">
                              {job.title}
                            </p>
                            <p className="mt-0.5 text-[13px] text-[#64748b]">
                              Posted {formatDate(job.createdAt)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#edf5ff] px-3 py-1 text-[13px] font-semibold text-[#2563eb]">
                            <Users className="h-3.5 w-3.5" />
                            {count} applicant{count !== 1 ? "s" : ""}
                          </span>
                          <ChevronRight className="h-5 w-5 text-[#94a3b8]" />
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className="text-[15px] font-medium text-[#374151]">
                  {search ? "No jobs match your search." : "No jobs posted yet."}
                </p>
                <p className="mt-1 text-[13px] text-[#94a3b8]">
                  {!search && "Create a job to start receiving applicants."}
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AllApplicants;
