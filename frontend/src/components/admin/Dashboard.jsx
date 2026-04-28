import React, { useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Bell,
  BriefcaseBusiness,
  MoreVertical,
  Settings,
  UserCheck,
  UsersRound,
} from "lucide-react";
import { toast } from "sonner";
import Sidebar from "./Sidebar";
import useGetAllAdminJobs from "../../hooks/useGetAllAdminJobs";
import { JOB_API_ENDPOINT } from "../../utils/constant";
import { setAdminJobs } from "../../store/slice/jobSlice";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const JOBS_PER_PAGE = 4;

const formatJobDate = (date) => {
  if (!date) return "N/A";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
};

const getApplicantsCount = (job) => job?.applications?.length || 0;

const countAcceptedApplicants = (jobs) =>
  jobs.reduce((total, job) => {
    const acceptedCount =
      job?.applications?.filter((application) => application?.status === "accepted")
        ?.length || 0;
    return total + acceptedCount;
  }, 0);

const Dashboard = () => {
  useGetAllAdminJobs();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { allAdminJobs = [] } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);
  // const { companies, singleCompany } = useSelector((store) => store.company);
  const [currentPage, setCurrentPage] = useState(1);

  // const company = singleCompany || companies?.[0];
  const totalApplicants = allAdminJobs.reduce(
    (total, job) => total + getApplicantsCount(job),
    0
  );
  const totalPages = Math.max(1, Math.ceil(allAdminJobs.length / JOBS_PER_PAGE));
  const pageJobs = useMemo(() => {
    const start = (currentPage - 1) * JOBS_PER_PAGE;
    return allAdminJobs.slice(start, start + JOBS_PER_PAGE);
  }, [allAdminJobs, currentPage]);

  const stats = [
    {
      label: "Active Jobs",
      value: allAdminJobs.length,
      icon: BriefcaseBusiness,
      iconClass: "bg-[#eef0ff] text-[#4f46e5]",
    },
    {
      label: "Total Applicants",
      value: totalApplicants,
      icon: UsersRound,
      iconClass: "bg-[#edf5ff] text-[#2563eb]",
    },
    {
      label: "Hired",
      value: countAcceptedApplicants(allAdminJobs),
      icon: UserCheck,
      iconClass: "bg-[#eefcf4] text-[#16a34a]",
    },
  ];

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleDelete = async (jobId) => {
    try {
      const res = await axios.delete(`${JOB_API_ENDPOINT}/job/delete/${jobId}`, {
        withCredentials: true,
      });

      if (res.data.success) {
        dispatch(setAdminJobs(allAdminJobs.filter((job) => job._id !== jobId)));
        toast.success(res.data.message || "Job deleted");
        if (pageJobs.length === 1 && currentPage > 1) {
          setCurrentPage((page) => page - 1);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete job");
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f8fb] text-[#17233c]">
      <Sidebar />

      <div className="min-h-screen pl-[260px]">
        <header className="flex h-[72px] items-center justify-between border-b border-[#dfe6f0] bg-white px-8">
          <div className="flex items-center gap-6">
            <h1 className="text-[22px] font-medium tracking-[-0.01em] text-black">
              Company Overview
            </h1>
          </div>

          <div className="flex items-center gap-7">
            <div className="h-8 w-px bg-[#d8e1ee]" />
            <div className="text-right">
              <p className="text-[15px] font-medium text-[#111827]">
                {user?.fullname || user?.name || "Recruiter"}
              </p>
              <p className="text-[13px] text-[#64748b]">Lead Recruiter</p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-full border-4 border-[#e7eef8] bg-[#183345] text-sm font-bold uppercase text-white shadow-sm">
              {(user?.fullname || user?.name || "R").charAt(0)}
            </div>
          </div>
        </header>

        <main className="px-8 py-8">
          <section className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <article
                  key={stat.label}
                  className="flex min-h-[132px] items-center justify-between rounded-xl border border-[#e2e8f0] bg-white px-8 shadow-[0_3px_10px_rgba(15,23,42,0.08)]"
                >
                  <div>
                    <p className="text-[14px] font-bold uppercase tracking-[0.09em] text-[#65758f]">
                      {stat.label}
                    </p>
                    <p className="mt-2 text-[38px] font-medium leading-none text-[#080b13]">
                      {stat.value}
                    </p>
                  </div>
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-xl ${stat.iconClass}`}
                  >
                    <Icon className="h-7 w-7" />
                  </div>
                </article>
              );
            })}
          </section>

          <section className="mt-8 overflow-hidden rounded-xl border border-[#e2e8f0] bg-white shadow-[0_3px_10px_rgba(15,23,42,0.08)]">
            <div className="flex items-center justify-between border-b border-[#eef2f7] px-8 py-7">
              <h2 className="text-[22px] font-medium tracking-[-0.01em] text-black">
                My Posted Jobs
              </h2>
              <p className="text-sm text-[#64748b]">
                Showing {pageJobs.length} of {allAdminJobs.length} jobs
              </p>
            </div>

            <Table>
              <TableHeader className="bg-[#f7f9fc]">
                <TableRow className="border-[#eef2f7] hover:bg-[#f7f9fc]">
                  <TableHead className="h-14 px-8 text-[13px] font-bold uppercase tracking-[0.09em] text-[#31435d]">
                    Position
                  </TableHead>
                  <TableHead className="h-14 text-[13px] font-bold uppercase tracking-[0.09em] text-[#31435d]">
                    Total Applicants
                  </TableHead>
                  <TableHead className="h-14 text-[13px] font-bold uppercase tracking-[0.09em] text-[#31435d]">
                    Date
                  </TableHead>
                  <TableHead className="h-14 pr-8 text-right text-[13px] font-bold uppercase tracking-[0.09em] text-[#31435d]">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageJobs.length > 0 ? (
                  pageJobs.map((job) => (
                    <TableRow
                      key={job._id}
                      className="h-[76px] border-[#eef2f7] hover:bg-[#fbfcfe]"
                    >
                      <TableCell className="px-8 text-[16px] font-medium text-[#141827]">
                        {job.title}
                      </TableCell>
                      <TableCell className="text-[15px] text-[#53657f]">
                        {getApplicantsCount(job)}
                      </TableCell>
                      <TableCell className="text-[15px] text-[#53657f]">
                        {formatJobDate(job.createdAt)}
                      </TableCell>
                      <TableCell className="pr-8 text-right">
                        <Popover>
                          <PopoverTrigger asChild>
                            <button
                              type="button"
                              className="inline-flex h-9 w-9 items-center justify-center rounded-md text-[#8a9ab1] transition hover:bg-[#f1f5f9] hover:text-[#17233c]"
                              aria-label={`${job.title} actions`}
                            >
                              <MoreVertical className="h-5 w-5" />
                            </button>
                          </PopoverTrigger>
                          <PopoverContent
                            align="end"
                            className="w-36 rounded-lg border-[#e2e8f0] bg-white p-1 shadow-lg"
                          >
                            <button
                              type="button"
                              onClick={() => navigate(`/admin/job/update/${job._id}`)}
                              className="block h-9 w-full rounded-md px-3 text-left text-sm text-[#17233c] hover:bg-[#f5f7fb]"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(job._id)}
                              className="block h-9 w-full rounded-md px-3 text-left text-sm text-[#dc2626] hover:bg-[#fff1f2]"
                            >
                              Delete
                            </button>
                            <button
                              type="button"
                              onClick={() => navigate(`/description/${job._id}`)}
                              className="block h-9 w-full rounded-md px-3 text-left text-sm text-[#17233c] hover:bg-[#f5f7fb]"
                            >
                              View
                            </button>
                          </PopoverContent>
                        </Popover>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow className="hover:bg-white">
                    <TableCell
                      colSpan={4}
                      className="h-44 text-center text-[15px] text-[#64748b]"
                    >
                      No jobs posted yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {allAdminJobs.length > JOBS_PER_PAGE && (
              <div className="border-t border-[#eef2f7] px-8 py-5">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(event) => {
                          event.preventDefault();
                          handlePageChange(currentPage - 1);
                        }}
                        className={
                          currentPage === 1
                            ? "pointer-events-none opacity-45"
                            : "text-[#17233c]"
                        }
                      />
                    </PaginationItem>

                    {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                      (page) => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            href="#"
                            isActive={currentPage === page}
                            onClick={(event) => {
                              event.preventDefault();
                              handlePageChange(page);
                            }}
                            className={
                              currentPage === page
                                ? "border-[#4f46e5] text-[#4f46e5]"
                                : "text-[#53657f]"
                            }
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      )
                    )}

                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(event) => {
                          event.preventDefault();
                          handlePageChange(currentPage + 1);
                        }}
                        className={
                          currentPage === totalPages
                            ? "pointer-events-none opacity-45"
                            : "text-[#17233c]"
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </section>
        </main>

        <footer className="mx-8 mt-8 flex items-center justify-between border-t border-[#dfe6f0] py-8 text-[13px] text-[#64748b]">
          <p>© 2024 JobHunt Professional. Built for growth.</p>
          <div className="flex items-center gap-8">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Contact Support</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Dashboard;
