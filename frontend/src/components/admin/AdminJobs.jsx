import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import useGetAllAdminJobs from "../../hooks/useGetAllAdminJobs";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { setSearchQuery } from "../../store/slice/jobSlice";
import Navbar from "../layout/Navbar";
import AdminJobsTable from "./AdminJobsTable";

const AdminJobs = () => {
  useGetAllAdminJobs()
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch()

  useEffect(() => {
    // console.log(useGetAllAdminJobs)
    dispatch(setSearchQuery(input))
  }, [input, dispatch])
  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto my-10">
        <div className="flex items-center justify-between my-5">
          <Input
            className="w-fit"
            placeholder="Filter by name, role"
            onChange={(e) => setInput(e.target.value)}
          />
          <Button onClick={() => navigate("/admin/jobs/create")}>
            New Jobs
          </Button>
        </div>
        <AdminJobsTable />
      </div>
    </div>
  );
};

export default AdminJobs;
