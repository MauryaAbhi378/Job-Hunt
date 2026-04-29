import React, { useEffect, useState, useMemo, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import {
  FileText,
  Search,
  ChevronDown,
  Check,
  X,
} from "lucide-react";
import Sidebar from "./Sidebar";
import { setAllApplicants } from "../../store/slice/applicationSlice";
import { APPLICATION_API_END_POINT } from "../../utils/constant";

// Enums from applicationModel.js
const STATUS_ENUM = ["pending", "accepted", "interviewing", "rejected"];

const STATUS_STYLES = {
  pending: {
    badge: "bg-yellow-100 text-yellow-700 border border-yellow-200",
    label: "Pending",
  },
  accepted: {
    badge: "bg-green-100 text-green-700 border border-green-200",
    label: "Accepted",
  },
  interviewing: {
    badge: "bg-blue-100 text-blue-700 border border-blue-200",
    label: "Interviewing",
  },
  rejected: {
    badge: "bg-red-100 text-red-700 border border-red-200",
    label: "Rejected",
  },
};

// Per-card status dropdown
const StatusDropdown = ({ currentStatus, onSelect, loading }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        disabled={loading}
        onClick={() => setOpen((o) => !o)}
        className="flex h-9 items-center gap-2 rounded-md border border-[#dce4ef] bg-white px-3 text-[13px] font-semibold text-[#17233c] shadow-sm hover:border-[#4f46e5] transition disabled:opacity-60"
      >
        <span
          className={`h-2 w-2 rounded-full ${
            currentStatus === "accepted"
              ? "bg-green-500"
              : currentStatus === "interviewing"
              ? "bg-blue-500"
              : currentStatus === "rejected"
              ? "bg-red-500"
              : "bg-yellow-500"
          }`}
        />
        <span className="capitalize">
          {STATUS_STYLES[currentStatus]?.label || currentStatus}
        </span>
        <ChevronDown className="h-3.5 w-3.5 text-[#64748b]" />
      </button>

      {open && (
        <div className="absolute right-0 z-30 mt-1 w-44 rounded-lg border border-[#e2e8f0] bg-white py-1 shadow-lg">
          {STATUS_ENUM.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                if (s !== currentStatus) onSelect(s);
                setOpen(false);
              }}
              className={`flex w-full items-center gap-2.5 px-4 py-2 text-[13px] capitalize hover:bg-[#f5f7fb] ${
                s === currentStatus
                  ? "font-semibold text-[#4f46e5]"
                  : "text-[#374151]"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full flex-shrink-0 ${
                  s === "accepted"
                    ? "bg-green-500"
                    : s === "interviewing"
                    ? "bg-blue-500"
                    : s === "rejected"
                    ? "bg-red-500"
                    : "bg-yellow-500"
                }`}
              />
              {STATUS_STYLES[s]?.label || s}
              {s === currentStatus && (
                <Check className="ml-auto h-3.5 w-3.5" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const ApplicantCard = ({ application, onStatusChange }) => {
  const [loading, setLoading] = useState(false);
  const applicant = application.applicant;
  const status = application.status;

  const latestExp =
    applicant?.profile?.workExperience?.find((w) => w.isCurrentlyWorking) ||
    applicant?.profile?.workExperience?.[
      applicant.profile.workExperience.length - 1
    ];

  const expLabel = latestExp
    ? `${latestExp.role} at ${latestExp.company}`
    : applicant?.profile?.bio || "";

  const handleSelect = async (nextStatus) => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${APPLICATION_API_END_POINT}/status/${application._id}/update`,
        { status: nextStatus },
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success(`Status updated to ${nextStatus}`);
        onStatusChange(application._id, nextStatus);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  const isHighlighted = status === "accepted" || status === "interviewing";

  return (
    <div
      className={`relative rounded-xl border bg-white p-5 shadow-sm transition ${
        isHighlighted
          ? "border-l-4 border-l-[#4f46e5] border-t-[#e2e8f0] border-r-[#e2e8f0] border-b-[#e2e8f0]"
          : "border-[#e2e8f0]"
      }`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        {/* Left: Avatar + Info */}
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            {applicant?.profile?.profilePhoto ? (
              <img
                src={applicant.profile.profilePhoto}
                alt={applicant.fullname}
                className="h-14 w-14 rounded-full object-cover border-2 border-[#e2e8f0]"
              />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#1e293b] text-xl font-bold text-white">
                {applicant?.fullname?.charAt(0)?.toUpperCase() || "?"}
              </div>
            )}
          </div>

          <div>
            <h3 className="text-[17px] font-bold text-[#111827]">
              {applicant?.fullname || "Unknown"}
            </h3>
            {expLabel && (
              <p className="mt-0.5 text-[13px] text-[#64748b]">{expLabel}</p>
            )}

            {/* Badges row */}
            <div className="mt-2 flex flex-wrap gap-2">
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[12px] font-semibold capitalize ${
                  STATUS_STYLES[status]?.badge || "bg-gray-100 text-gray-600"
                }`}
              >
                {STATUS_STYLES[status]?.label || status}
              </span>
              {applicant?.profile?.skills?.slice(0, 3).map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center rounded-full bg-[#f1f5f9] px-2.5 py-0.5 text-[12px] font-medium text-[#475569]"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Resume + Status dropdown */}
        <div className="flex flex-wrap items-center gap-3 sm:flex-nowrap">
          {/* Resume link */}
          {applicant?.profile?.resume ? (
            <a
              href={applicant.profile.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#4f46e5] hover:underline"
            >
              <FileText className="h-4 w-4" />
              Resume
            </a>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-[13px] text-[#94a3b8]">
              <FileText className="h-4 w-4" />
              No Resume
            </span>
          )}

          {/* Divider */}
          <div className="h-6 w-px bg-[#e2e8f0]" />

          {/* Status dropdown */}
          <StatusDropdown
            currentStatus={status}
            onSelect={handleSelect}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

const Applicants = () => {
  const { id: jobId } = useParams();
  const dispatch = useDispatch();
  const { applicants } = useSelector((store) => store.application);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [localApplicants, setLocalApplicants] = useState([]);

  // Fetch applicants for this job
  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const res = await axios.get(
          `${APPLICATION_API_END_POINT}/${jobId}/applicants`,
          { withCredentials: true }
        );
        if (res.data.succees || res.data.success) {
          const apps = res.data.job?.applications || [];
          dispatch(setAllApplicants(apps));
          setLocalApplicants(apps);
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load applicants");
      }
    };

    if (jobId) fetchApplicants();
  }, [jobId, dispatch]);

  // Sync from redux when it changes externally
  useEffect(() => {
    if (applicants) setLocalApplicants(applicants);
  }, [applicants]);

  // Optimistic local status update
  const handleStatusChange = (applicationId, newStatus) => {
    setLocalApplicants((prev) =>
      prev.map((app) =>
        app._id === applicationId ? { ...app, status: newStatus } : app
      )
    );
  };

  // Filtered list
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return localApplicants.filter((app) => {
      const name = app.applicant?.fullname?.toLowerCase() || "";
      const jobTitle = app.job?.title?.toLowerCase() || "";

      const matchesSearch = !q || name.includes(q) || jobTitle.includes(q);
      const matchesStatus =
        statusFilter === "all" || app.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [localApplicants, search, statusFilter]);

  const jobTitle =
    localApplicants[0]?.job?.title || "Job";

  return (
    <div className="min-h-screen bg-[#f6f8fb] text-[#17233c]">
      <Sidebar />

      <div className="min-h-screen pl-[260px]">
        {/* Header */}
        <header className="flex h-[72px] items-center justify-between border-b border-[#dfe6f0] bg-white px-8">
          <h1 className="text-[22px] font-medium tracking-[-0.01em] text-black">
            Applicants —{" "}
            <span className="text-[#4f46e5]">{jobTitle}</span>
          </h1>
          <p className="text-[14px] text-[#64748b]">
            {localApplicants.length} total applicant
            {localApplicants.length !== 1 ? "s" : ""}
          </p>
        </header>

        <main className="px-8 py-8">
          {/* Search + Filter bar */}
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or job title..."
                className="h-11 w-full rounded-lg border border-[#dce4ef] bg-white pl-10 pr-4 text-[14px] text-[#17233c] placeholder-[#94a3b8] shadow-sm outline-none focus:border-[#4f46e5] focus:ring-2 focus:ring-[#4f46e5]/20 transition"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#475569]"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Status filter dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setStatusDropdownOpen((o) => !o)}
                className="flex h-11 items-center gap-2 rounded-lg border border-[#dce4ef] bg-white px-4 text-[14px] font-medium text-[#17233c] shadow-sm hover:border-[#4f46e5] transition"
              >
                <span>
                  {statusFilter === "all"
                    ? "All Statuses"
                    : STATUS_STYLES[statusFilter]?.label || statusFilter}
                </span>
                <ChevronDown className="h-4 w-4 text-[#64748b]" />
              </button>

              {statusDropdownOpen && (
                <div className="absolute right-0 z-20 mt-1 w-44 rounded-lg border border-[#e2e8f0] bg-white py-1 shadow-lg">
                  <button
                    type="button"
                    onClick={() => {
                      setStatusFilter("all");
                      setStatusDropdownOpen(false);
                    }}
                    className={`flex w-full items-center gap-2 px-4 py-2 text-[13px] hover:bg-[#f5f7fb] ${
                      statusFilter === "all"
                        ? "font-semibold text-[#4f46e5]"
                        : "text-[#374151]"
                    }`}
                  >
                    {statusFilter === "all" && (
                      <Check className="h-3.5 w-3.5" />
                    )}
                    <span className={statusFilter === "all" ? "" : "ml-5"}>
                      All Statuses
                    </span>
                  </button>

                  {STATUS_ENUM.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => {
                        setStatusFilter(s);
                        setStatusDropdownOpen(false);
                      }}
                      className={`flex w-full items-center gap-2 px-4 py-2 text-[13px] capitalize hover:bg-[#f5f7fb] ${
                        statusFilter === s
                          ? "font-semibold text-[#4f46e5]"
                          : "text-[#374151]"
                      }`}
                    >
                      {statusFilter === s && (
                        <Check className="h-3.5 w-3.5" />
                      )}
                      <span className={statusFilter === s ? "" : "ml-5"}>
                        {STATUS_STYLES[s]?.label || s}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Applicant cards */}
          {filtered.length > 0 ? (
            <div className="flex flex-col gap-4">
              {filtered.map((application) => (
                <ApplicantCard
                  key={application._id}
                  application={application}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-[#e2e8f0] bg-white py-20 text-center shadow-sm">
              <p className="text-[16px] font-medium text-[#374151]">
                No applicants found
              </p>
              <p className="mt-1 text-[14px] text-[#94a3b8]">
                {search || statusFilter !== "all"
                  ? "Try adjusting your search or filter."
                  : "No one has applied to this job yet."}
              </p>
            </div>
          )}
        </main>
      </div>

      {/* Close dropdown on outside click — handled per-card */}
    </div>
  );
};

export default Applicants;