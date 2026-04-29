import React, { useState, useMemo } from "react";
import Navbar from "./Navbar";
import { useSelector } from "react-redux";
import useGetAppliedJob from "../../hooks/useGetAppliedJob";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Application = () => {
  useGetAppliedJob();
  const { appliedJobs } = useSelector((store) => store.job);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Calculate statistics
  const stats = useMemo(() => {
    if (!appliedJobs || !Array.isArray(appliedJobs)) {
      return { total: 0, interviews: 0, pending: 0 };
    }

    return {
      total: appliedJobs.length,
      interviews: appliedJobs.filter((app) => app.status === "interviewing")
        .length,
      pending: appliedJobs.filter((app) => app.status === "pending").length,
    };
  }, [appliedJobs]);

  // Pagination logic
  const totalPages = Math.ceil((appliedJobs?.length || 0) / itemsPerPage);
  const paginatedApplications = useMemo(() => {
    if (!appliedJobs || !Array.isArray(appliedJobs)) return [];
    const startIndex = (currentPage - 1) * itemsPerPage;
    return appliedJobs.slice(startIndex, startIndex + itemsPerPage);
  }, [appliedJobs, currentPage]);

  // Handle pagination
  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  // Status badge styling
  const getStatusColor = (status) => {
    const statusMap = {
      pending: "bg-yellow-100 text-yellow-800",
      interviewing: "bg-blue-100 text-blue-800",
      accepted: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    };
    return statusMap[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusLabel = (status) => {
    const labelMap = {
      pending: "Pending",
      interviewing: "Interviewing",
      accepted: "Selected",
      rejected: "Rejected",
    };
    return labelMap[status] || status;
  };

  // Get company icon or first letter
  const getCompanyIcon = (application) => {
    const companyIcon = application.job?.company?.logo;
    const companyName = application.job?.company?.name || "Company";

    if (companyIcon) {
      return (
        <img
          src={companyIcon}
          alt={companyName}
          className="w-26 h-24 rounded-lg object-cover"
        />
      );
    }

    const firstLetter = companyName.charAt(0).toUpperCase();
    return (
      <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
        {firstLetter}
      </div>
    );
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            My Applications
          </h1>
          <p className="text-gray-600">
            Track and manage your professional journey progress.
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Total Applications */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 flex items-center gap-4 shadow-sm hover:shadow-md transition">
            <div className="bg-purple-100 p-4 rounded-lg">
              <svg
                className="w-8 h-8 text-purple-600"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M3 13h2v8H3zm4-8h2v16H7zm4-2h2v18h-2zm4-2h2v20h-2zm4 4h2v16h-2zm4 2h2v14h-2z" />
              </svg>
            </div>
            <div>
              <p className="text-gray-600 text-sm font-medium">
                TOTAL APPLICATIONS
              </p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>

          {/* Interviews */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 flex items-center gap-4 shadow-sm hover:shadow-md transition">
            <div className="bg-green-100 p-4 rounded-lg">
              <svg
                className="w-8 h-8 text-green-600"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M20 0H4c-2.2 0-4 1.8-4 4v16c0 2.2 1.8 4 4 4h16c2.2 0 4-1.8 4-4V4c0-2.2-1.8-4-4-4zm-2 15h-12v-2h12v2zm0-4h-12v-2h12v2zm0-4h-12v-2h12v2z" />
              </svg>
            </div>
            <div>
              <p className="text-gray-600 text-sm font-medium">INTERVIEWS</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.interviews}
              </p>
            </div>
          </div>

          {/* Pending Responses */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 flex items-center gap-4 shadow-sm hover:shadow-md transition">
            <div className="bg-yellow-100 p-4 rounded-lg">
              <svg
                className="w-8 h-8 text-yellow-600"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
              </svg>
            </div>
            <div>
              <p className="text-gray-600 text-sm font-medium">
                PENDING RESPONSES
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.pending}
              </p>
            </div>
          </div>
        </div>

        {/* Recent Submissions */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">
              Recent Submissions
            </h2>
          </div>

          {paginatedApplications && paginatedApplications.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {paginatedApplications.map((application, index) => (
                <div
                  key={application._id || index}
                  className="px-6 py-5 hover:bg-gray-50 transition"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getCompanyIcon(application)}
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {application.job?.title || "Position Title"}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {application.job?.company?.name || "Company Name"} •{" "}
                            {application.job?.location || "Location"}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 ml-12">
                        Submitted on{" "}
                        {new Date(application.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "2-digit",
                          },
                        )}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <Badge
                        className={`${getStatusColor(application.status)} border-0 font-medium`}
                      >
                        {getStatusLabel(application.status)}
                      </Badge>
                      <Button
                        variant="link"
                        className="text-blue-600 hover:text-blue-700 font-medium"
                        onClick={() =>
                          navigate(`/description/${application.job?._id}`)
                        }
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-6 py-12 text-center">
              <p className="text-gray-600">
                No applications yet. Start applying to jobs!
              </p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className={
                        currentPage === page
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : ""
                      }
                    >
                      {page}
                    </Button>
                  ),
                )}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>

              <span className="text-sm text-gray-600 ml-4">
                Page {currentPage} of {totalPages}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Application;
