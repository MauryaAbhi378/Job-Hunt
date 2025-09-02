import React, { useEffect } from "react";
import Navbar from "../components/layout/Navbar";
import FilterCard from "../components/layout/FilterCard";
import JobCard from "../components/layout/JobCard";
import { useDispatch, useSelector } from "react-redux";
import JobSearch from "../components/layout/JobSearch";
import {
  clearjobByFilter,
  clearJobByText,
  clearPage,
  fetchJobs,
  setPage,
} from "../store/slice/jobSlice";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const Jobs = () => {
  const {
    loading,
    jobs = [],
    filters = {},
    jobByText,
    page = 1,
    limit = 3,
    totalJob,
    totalPage,
  } = useSelector((store) => store.job);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      fetchJobs({
        page,
        limit,
        jobByText,
        filters,
      })
    );
  }, [filters, dispatch, page, limit]);

  useEffect(() => {
    return () => {
      dispatch(clearJobByText());
      dispatch(clearjobByFilter());
      dispatch(clearPage());
    };
  }, [dispatch]);

  const handlePrevious = () => {
    if (page > 1) {
      dispatch(setPage(page - 1));
    }
  };

  const handleNext = () => {
    if (page < totalPage) {
      dispatch(setPage(page + 1));
    }
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto mt-6">
        <JobSearch />
      </div>
      <div className="max-w-7xl mx-auto mt-5">
        <div className="flex gap-25">
          <div className="w-1/5">
            <FilterCard />
          </div>
          <div className="flex-1 pb-6">
            {loading ? (
              <span>Loading jobs...</span>
            ) : totalJob === 0 ? (
              <span>No jobs found</span>
            ) : (
              <div>
                {jobs.map((job) => (
                  <JobCard key={job._id} job={job} />
                ))}
              </div>
            )}

            {limit < totalJob && (
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handlePrevious()}
                      className={`${
                        page <= 1
                          ? "hover:cursor-not-allowed"
                          : "hover:cursor-pointer"
                      }`}
                    />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink>{page}</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => handleNext()}
                      className={`${
                        page === totalPage
                          ? "hover:cursor-not-allowed"
                          : "hover:cursor-pointer"
                      }`}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobs;
