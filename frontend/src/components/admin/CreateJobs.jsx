import React, { useEffect, useState } from "react";
import Navbar from "../layout/Navbar";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../store/slice/authSlice";
import axios from "axios";
import { JOB_API_ENDPOINT } from "../../utils/constant";
import { useNavigate, useParams } from "react-router-dom";
import { Slider } from "@/components/ui/slider";
import { Loader2 } from "lucide-react";

const CreateJobs = () => {
  const { companies } = useSelector((store) => store.company);
  const { loading } = useSelector((store) => store.auth);
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [input, setInput] = useState({
    title: "",
    category: "",
    description: "",
    requirements: "",
    salary: [0, 15000],
    experience: [0, 1],
    location: "",
    jobType: "",
    position: 0,
    companyId: "",
  });

  const category = [
    "Finance",
    "Developer",
    "Marketing",
    "UI/UX",
    "Cloud",
    "Human Resource",
    "AI",
    "Business",
  ];

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleSalaryChange = (value) => {
    setInput({ ...input, salary: value });
  };

  const handleExperienceChange = (value) => {
    setInput({ ...input, experience: value });
  };

  const selectChangeHandler = (value) => {
    const selectedCompany = companies.find(
      (company) => company.name.toLowerCase() === value
    );
    setInput({ ...input, companyId: selectedCompany._id });
  };

  const changeCategoryHandler = (value) => {
    setInput({ ...input, category: value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch(setLoading(true));
      const payload = {
        ...input,
        salary: { min: input.salary[0], max: input.salary[1] },
        experience: {
          min: input.experience[0],
          max: input.experience[1],
        },
      };
      if (id) {
        const res = await axios.put(
          `${JOB_API_ENDPOINT}/job/update/${id}`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
        if (res.data.success) {
          toast.success(res.data.message);
          navigate("/admin/jobs");
        }
      } else {
        const res = await axios.post(`${JOB_API_ENDPOINT}/post`, payload, {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });
        if (res.data.success) {
          toast.success(res.data.message);
          navigate("/admin/jobs");
        }
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    const fetchJob = async () => {
      if (id) {
        try {
          const res = await axios.get(`${JOB_API_ENDPOINT}/get/${id}`, {
            withCredentials: true,
          });
          if (res.data.success) {
            const job = res.data.job;
            setInput({
              title: job.title,
              category: job.category,
              description: job.description,
              requirements: job.requirements,
              location: job.location,
              experience: [job.experienceLevel.min, job.experienceLevel.max],
              salary: [job.salary.min, job.salary.max],
              jobType: job.jobType,
              position: job.position,
              companyId: job.company?._id,
            });
          }
        } catch (error) {
          console.log("Error while updating job", error);
          toast.error("Failed to load job details");
        }
      }
    };
    fetchJob();
  }, [id]);

  return (
    <div className="overflow-y-auto overflow-x-hidden">
      <Navbar />
      <div className="flex items-center justify-center w-screen my-5 ">
        <form
          onSubmit={submitHandler}
          className="p-8 max-w-4xl border border-gray-200 shadow-lg rounded-md"
        >
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label>Title</Label>
              <Input
                type="text"
                name="title"
                value={input.title}
                onChange={changeEventHandler}
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
              />
            </div>

            {companies.length > 0 && (
              <div>
                <Label>Company</Label>
                <Select onValueChange={selectChangeHandler}>
                  <SelectTrigger className="w-full my-1">
                    <SelectValue placeholder="Select a Company" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {companies.map((company) => (
                        <SelectItem
                          key={company._id}
                          value={company?.name?.toLowerCase()}
                        >
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            )}
            <div>
              <Label>Requirements</Label>
              <Input
                type="text"
                name="requirements"
                value={input.requirements}
                onChange={changeEventHandler}
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
              />
            </div>

            <div>
              <Label>No of Position</Label>
              <Input
                type="number"
                name="position"
                value={input.position}
                onChange={changeEventHandler}
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
              />
            </div>

            <div>
              <Label>Location</Label>
              <Input
                type="text"
                name="location"
                value={input.location}
                onChange={changeEventHandler}
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
              />
            </div>
            <div>
              <Label>Job Type</Label>
              <Input
                type="text"
                name="jobType"
                value={input.jobType}
                onChange={changeEventHandler}
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
              />
            </div>

            {/* Experience Slider */}
            <div>
              <Label className="mb-4">Experience (years)</Label>
              <Slider
                value={input.experience}
                min={0}
                max={20}
                step={1}
                className="w-[300px] mb-3"
                onValueChange={handleExperienceChange}
              />
              {input.experience[0] === 0 && input.experience[1] === 0 ? (
                <p>Fresher</p>
              ) : (
                <p>
                  {input.experience[0]} - {input.experience[1]} years
                </p>
              )}
            </div>

            <div>
              <Label className="mb-4">Salary Range (₹)</Label>
              <Slider
                value={input.salary}
                min={0}
                max={250000}
                step={1000}
                className="w-[300px] mb-3"
                onValueChange={handleSalaryChange}
              />
              <p>
                ₹{input.salary[0]} - ₹{input.salary[1]}{" "}
                <span className="text-sm text-gray-400">per month</span>
              </p>
            </div>

            <div className="mb-2">
              <Label className="mb-2">Category</Label>
              <Select
                value={input.category}
                onValueChange={changeCategoryHandler}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {category.map((cat, idx) => {
                      return (
                        <SelectItem key={idx} value={cat}>
                          {cat}
                        </SelectItem>
                      );
                    })}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Description</Label>
            <Textarea
              name="description"
              value={input.description}
              onChange={changeEventHandler}
              placeholder="Enter job description"
              className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1 h-40 resize-y"
              maxLength={7000}
            />
          </div>

          {loading ? (
            <Button className="w-full my-4" disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
            </Button>
          ) : (
            <Button variant="black" type="submit" className="w-full my-4">
              {id ? "Update Job" : "Post New Job"}
            </Button>
          )}

          {companies.length === 0 && (
            <p className="text-xs text-red-600 font-bold text-center my-3">
              *Please register a company first, before posting a job
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default CreateJobs;
