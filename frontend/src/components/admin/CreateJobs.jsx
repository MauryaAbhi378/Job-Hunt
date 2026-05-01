import React, { useEffect, useMemo, useRef, useState } from "react";
import Sidebar from "./Sidebar";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { setLoading } from "../../store/slice/authSlice";
import { JOB_API_ENDPOINT } from "../../utils/constant";
import useGetAllCompanies from "../../hooks/useGetAllCompanies";
import {
  ChevronDown,
  Loader2,
  MapPin,
  MapPinCheckIcon,
  MapPinIcon,
  Sparkles,
} from "lucide-react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

const benefitOptions = [
  "Health Insurance",
  "Paid Time Off",
  "Learning Budget",
  "Home Office Setup",
  "Remote Work Option",
  "Parental Leave",
];

const jobTypes = ["Full-time", "Part-time", "Contract", "Internship", "Remote"];

const CreateJobs = () => {
  useGetAllCompanies();
  const { companies } = useSelector((store) => store.company);
  const { loading, onboardingStatus } = useSelector((store) => store.auth);
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const descriptionRef = useRef(null);
  const requirementsRef = useRef(null);
  const descriptionQuillRef = useRef(null);
  const requirementsQuillRef = useRef(null);
  // Tracks whether editors have been seeded with fetched job data
  const editorsSeededRef = useRef(false);

  // Use the onboarded company if available, otherwise fall back to the most recently
  // created company that has completed onboarding (onboarding: true)
  const defaultCompanyId = useMemo(() => {
    if (!companies?.length) return "";
    // First priority: match the company from onboardingStatus
    if (onboardingStatus?.companyId) {
      const match = companies.find((c) => c._id === onboardingStatus.companyId);
      if (match) return match._id;
    }
    // Second priority: find any company with onboarding: true (most recent first)
    const onboarded = [...companies]
      .reverse()
      .find((c) => c.onboarding === true);
    if (onboarded) return onboarded._id;
    // Last resort: most recently created company
    return companies[companies.length - 1]?._id || "";
  }, [companies, onboardingStatus]);

  const [input, setInput] = useState({
    title: "",
    jobType: "Full-time",
    location: "",
    experienceMin: "",
    experienceMax: "",
    salaryMin: "",
    salaryMax: "",
    benefits: [],
    jobDescription: "",
    candidateRequirements: "",
    companyId: "",
  });

  useEffect(() => {
    if (defaultCompanyId) {
      setInput((prev) => ({ ...prev, companyId: defaultCompanyId }));
    }
  }, [defaultCompanyId]);

  const handleInputChange = (e) => {
    setInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const toggleBenefit = (benefit) => {
    setInput((prev) => ({
      ...prev,
      benefits: prev.benefits.includes(benefit)
        ? prev.benefits.filter((item) => item !== benefit)
        : [...prev.benefits, benefit],
    }));
  };

  const createEditor = (node, placeholder, toolbarOptions, onChange) => {
    const editor = new Quill(node, {
      theme: "snow",
      placeholder,
      modules: {
        toolbar: toolbarOptions,
      },
    });

    editor.on("text-change", () => {
      onChange(editor.getText().trim().length > 0 ? editor.root.innerHTML : "");
    });

    return editor;
  };

  useEffect(() => {
    if (descriptionRef.current && !descriptionQuillRef.current) {
      descriptionQuillRef.current = createEditor(
        descriptionRef.current,
        "Describe the role and responsibilities...",
        [["bold", "italic"], [{ list: "bullet" }, { list: "ordered" }], ["link"]],
        (value) =>
          setInput((prev) => ({
            ...prev,
            jobDescription: value,
          }))
      );
    }

    if (requirementsRef.current && !requirementsQuillRef.current) {
      requirementsQuillRef.current = createEditor(
        requirementsRef.current,
        "List key skills, experience, and certifications...",
        [[{ list: "bullet" }]],
        (value) =>
          setInput((prev) => ({
            ...prev,
            candidateRequirements: value,
          }))
      );
    }
  }, []);

  const syncEditorHtml = (editor, html) => {
    if (!editor || editor.hasFocus()) return;
    // Always coerce to a plain string — arrays from the DB must not reach Quill
    const nextHtml = Array.isArray(html)
      ? html.map((line) => `<p>${line}</p>`).join("")
      : (html || "");
    if (editor.root.innerHTML !== nextHtml) {
      editor.clipboard.dangerouslyPasteHTML(nextHtml);
    }
  };

  // Seed editors once they are ready AND job data has been fetched
  useEffect(() => {
    if (
      !id ||
      editorsSeededRef.current ||
      !descriptionQuillRef.current ||
      !requirementsQuillRef.current
    ) return;
    if (input.jobDescription || input.candidateRequirements) {
      syncEditorHtml(descriptionQuillRef.current, input.jobDescription);
      syncEditorHtml(requirementsQuillRef.current, input.candidateRequirements);
      editorsSeededRef.current = true;
    }
  }, [input.jobDescription, input.candidateRequirements, id]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!input.companyId) {
      toast.error("Please complete onboarding before publishing a job");
      return;
    }

    const getEditorTextList = (editor, fallbackHtml) => {
      const text = editor?.getText() || fallbackHtml?.replace(/<[^>]*>/g, "\n") || "";
      return text
        .split(/\n+/)
        .map((item) => item.trim())
        .filter(Boolean);
    };

    const jobDescriptionList = getEditorTextList(
      descriptionQuillRef.current,
      input.jobDescription
    );
    const requirementsList = getEditorTextList(
      requirementsQuillRef.current,
      input.candidateRequirements
    );
    const salary = {
      min: Number(input.salaryMin),
      max: Number(input.salaryMax),
    };
    const experienceLevel = {
      min: Number(input.experienceMin),
      max: Number(input.experienceMax),
    };

    const payload = {
      title: input.title,
      jobType: input.jobType,
      location: input.location,
      description: input.jobDescription,
      jobDescription: jobDescriptionList,
      candidateRequirements: input.candidateRequirements,
      requirements: requirementsList,
      benefits: input.benefits,
      salary,
      experienceLevel,
      experience: experienceLevel,
      companyId: input.companyId,
    };

    try {
      dispatch(setLoading(true));
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };

      const res = id
        ? await axios.put(`${JOB_API_ENDPOINT}/job/update/${id}`, payload, config)
        : await axios.post(`${JOB_API_ENDPOINT}/post`, payload, config);

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/admin/dashboard");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    const fetchJob = async () => {
      if (!id) return;
      editorsSeededRef.current = false;

      try {
        const res = await axios.get(`${JOB_API_ENDPOINT}/get/${id}`, {
          withCredentials: true,
        });

        if (res.data.success) {
          const job = res.data.job;

          // jobDescription is stored as string[] in the DB — convert to HTML for Quill
          const descHtml = Array.isArray(job.jobDescription)
            ? job.jobDescription.map((line) => `<p>${line}</p>`).join("")
            : (job.jobDescription || job.description || "");

          // candidateRequirements may be a plain string or array
          const reqHtml = Array.isArray(job.candidateRequirements)
            ? job.candidateRequirements.map((line) => `<p>${line}</p>`).join("")
            : Array.isArray(job.requirements)
            ? job.requirements.map((line) => `<p>${line}</p>`).join("")
            : (job.candidateRequirements || job.requirements?.join("\n") || "");

          setInput({
            title: job.title || "",
            jobType: job.jobType || "Full-time",
            location: job.location || "",
            experienceMin: job.experienceLevel?.min ?? "",
            experienceMax: job.experienceLevel?.max ?? "",
            salaryMin: job.salary?.min ?? "",
            salaryMax: job.salary?.max ?? "",
            benefits: job.benefits || [],
            jobDescription: descHtml,
            candidateRequirements: reqHtml,
            companyId: job.company?._id || defaultCompanyId,
          });
        }
      } catch (error) {
        console.log("Error while updating job", error);
        toast.error("Failed to load job details");
      }
    };

    fetchJob();
  }, [defaultCompanyId, id]);

  return (
    <div className="min-h-screen bg-[#fbf7ff] text-[#17233c]">
      <Sidebar />
      <div className="min-h-screen pl-[260px]">
        <header className="sticky top-0 z-20 flex h-[72px] items-center justify-between border-b border-[#e3e8f2] bg-white px-6">
          <div className="flex items-center gap-4">
            <h1 className="text-[26px] font-semibold tracking-[-0.01em] text-black">
              {id ? "Update Job" : "Post a New Job"}
            </h1>
            <span className="rounded-full bg-[#eee9ff] px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#4f46e5]">
              Draft
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              className="h-11 rounded-md border-[#cbd6e6] bg-white px-7 text-[15px] font-medium text-[#0c1831] shadow-none hover:bg-white"
            >
              Preview
            </Button>
            <Button
              type="submit"
              form="create-job-form"
              disabled={loading}
              className="h-11 rounded-md bg-[#4f46e5] px-7 text-[15px] font-medium text-white hover:bg-[#4338ca]"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {id ? "Updating..." : "Publishing..."}
                </>
              ) : (
                id ? "Update Job" : "Publish Job"
              )}
            </Button>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[760px] py-16">
          <form id="create-job-form" onSubmit={submitHandler} className="space-y-7">
            <section className="overflow-hidden rounded-xl border border-[#dbe3ef] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
              <div className="border-b border-[#eef2f7] px-6 py-5">
                <h2 className="text-xl font-semibold text-black">Job Basics</h2>
                <p className="mt-1 text-[15px] text-[#566987]">
                  Core information about the role and location.
                </p>
              </div>

              <div className="space-y-5 px-6 py-7">
                <label className="block">
                  <span className="text-[15px] font-medium text-black">Job Title</span>
                  <input
                    name="title"
                    value={input.title}
                    onChange={handleInputChange}
                    placeholder="e.g. Senior Product Designer"
                    className="mt-2 h-[50px] w-full rounded-md border border-[#cbd6e6] bg-white px-4 text-[16px] text-[#18243a] outline-none transition placeholder:text-[#6b778d] focus:border-[#4f46e5] focus:ring-2 focus:ring-[#4f46e5]/15"
                  />
                </label>

                <div className="grid grid-cols-2 gap-4">
                  <label className="block">
                    <span className="text-[15px] font-medium text-black">Job Type</span>
                    <div className="relative mt-2">
                      <select
                        name="jobType"
                        value={input.jobType}
                        onChange={handleInputChange}
                        className="h-[50px] w-full appearance-none rounded-md border border-[#cbd6e6] bg-white px-4 pr-10 text-[16px] text-[#17233c] outline-none focus:border-[#4f46e5] focus:ring-2 focus:ring-[#4f46e5]/15"
                      >
                        {jobTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#1b365d]" />
                    </div>
                  </label>

                  <label className="block">
                    <span className="text-[15px] font-medium text-black">Location</span>
                    <div className="relative mt-2">
                      <MapPinIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 fill-[#91a0b8] text-[#91a0b8]" />
                      <input
                        name="location"
                        value={input.location}
                        onChange={handleInputChange}
                        placeholder="London, UK or Remote"
                        className="h-[50px] w-full rounded-md border border-[#cbd6e6] bg-white px-11 text-[16px] text-[#18243a] outline-none placeholder:text-[#6b778d] focus:border-[#4f46e5] focus:ring-2 focus:ring-[#4f46e5]/15"
                      />
                    </div>
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <label className="block">
                    <span className="text-[15px] font-medium text-black">
                      Min Experience
                    </span>
                    <div className="mt-2">
                      <input
                        name="experienceMin"
                        value={input.experienceMin}
                        onChange={handleInputChange}
                        type="number"
                        min="0"
                        placeholder="0 years"
                        className="h-[50px] w-full rounded-md border border-[#cbd6e6] bg-white px-4 text-[16px] text-[#18243a] outline-none placeholder:text-[#6b778d] focus:border-[#4f46e5] focus:ring-2 focus:ring-[#4f46e5]/15"
                      />
                    </div>
                  </label>

                  <label className="block">
                    <span className="text-[15px] font-medium text-black">
                      Max Experience
                    </span>
                    <div className="mt-2">
                      <input
                        name="experienceMax"
                        value={input.experienceMax}
                        onChange={handleInputChange}
                        type="number"
                        min="0"
                        placeholder="5 years"
                        className="h-[50px] w-full rounded-md border border-[#cbd6e6] bg-white px-4 text-[16px] text-[#18243a] outline-none placeholder:text-[#6b778d] focus:border-[#4f46e5] focus:ring-2 focus:ring-[#4f46e5]/15"
                      />
                    </div>
                  </label>
                </div>
              </div>
            </section>

            <section className="overflow-hidden rounded-xl border border-[#dbe3ef] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
              <div className="border-b border-[#eef2f7] px-6 py-5">
                <h2 className="text-xl font-semibold text-black">
                  Compensation & Benefits
                </h2>
                <p className="mt-1 text-[15px] text-[#566987]">
                  Be transparent to attract the best candidates.
                </p>
              </div>

              <div className="space-y-5 px-6 py-7">
                <div className="grid grid-cols-2 gap-4">
                  <label className="block">
                    <span className="text-[15px] font-medium text-black">
                      Salary Range (Min)
                    </span>
                    <div className="relative mt-2">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[16px] text-[#6b778d]">
                        ₹
                      </span>
                      <input
                        name="salaryMin"
                        value={input.salaryMin}
                        onChange={handleInputChange}
                        type="number"
                        placeholder="50,000"
                        className="h-[50px] w-full rounded-md border border-[#cbd6e6] bg-white px-8 text-[16px] text-[#18243a] outline-none placeholder:text-[#6b778d] focus:border-[#4f46e5] focus:ring-2 focus:ring-[#4f46e5]/15"
                      />
                    </div>
                  </label>

                  <label className="block">
                    <span className="text-[15px] font-medium text-black">
                      Salary Range (Max)
                    </span>
                    <div className="relative mt-2">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[16px] text-[#6b778d]">
                        ₹
                      </span>
                      <input
                        name="salaryMax"
                        value={input.salaryMax}
                        onChange={handleInputChange}
                        type="number"
                        placeholder="80,000"
                        className="h-[50px] w-full rounded-md border border-[#cbd6e6] bg-white px-8 text-[16px] text-[#18243a] outline-none placeholder:text-[#6b778d] focus:border-[#4f46e5] focus:ring-2 focus:ring-[#4f46e5]/15"
                      />
                    </div>
                  </label>
                </div>

                <div>
                  <p className="text-[15px] font-medium text-black">Benefits</p>
                  <div className="mt-3 grid grid-cols-3 gap-3">
                    {benefitOptions.map((benefit) => (
                      <label
                        key={benefit}
                        className="flex h-[46px] items-center gap-3 rounded-md border border-[#d9e2ef] bg-white px-3 text-[14px] text-[#17233c]"
                      >
                        <input
                          type="checkbox"
                          checked={input.benefits.includes(benefit)}
                          onChange={() => toggleBenefit(benefit)}
                          className="h-4 w-4 appearance-none rounded border border-[#c3d1e4] bg-white checked:border-[#4f46e5] checked:bg-[#4f46e5]"
                        />
                        {benefit}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="overflow-hidden rounded-xl border border-[#dbe3ef] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
              <div className="border-b border-[#eef2f7] px-6 py-5">
                <h2 className="text-xl font-semibold text-black">Role Details</h2>
                <p className="mt-1 text-[15px] text-[#566987]">
                  Describe the daily impact and expectations.
                </p>
              </div>

              <div className="space-y-5 px-6 py-7">
                <label className="block">
                  <span className="text-[15px] font-medium text-black">
                    Job Description
                  </span>
                  <div className="job-description-editor mt-2 overflow-hidden rounded-md border border-[#cbd6e6] bg-white">
                    <div ref={descriptionRef} className="min-h-[184px]" />
                  </div>
                </label>

                <label className="block">
                  <span className="text-[15px] font-medium text-black">
                    Candidate Requirements
                  </span>
                  <div className="job-requirements-editor mt-2 overflow-hidden rounded-md border border-[#cbd6e6] bg-white">
                    <div ref={requirementsRef} className="min-h-[140px]" />
                  </div>
                </label>
              </div>
            </section>

            <div className="flex gap-5 rounded-xl border border-[#d6e2ff] bg-[#eef3ff] px-6 py-6 text-[#06159b]">
              <Sparkles className="mt-1 h-5 w-5 fill-[#4f46e5] text-[#4f46e5]" />
              <div>
                <p className="text-[15px] font-semibold">JobHunt Insight</p>
                <p className="mt-1 text-[15px] leading-6">
                  Jobs with transparent salary ranges receive up to{" "}
                  <span className="font-bold">40% more applications</span> from
                  qualified candidates in your industry.
                </p>
              </div>
            </div>
          </form>
        </main>

        <footer className="mt-8 border-t border-[#edf0f5] bg-white px-6 py-12">
          <div className="mx-auto flex max-w-[1000px] items-center justify-between text-[12px] text-[#566987]">
            <p>© 2024 JobHunt Professional. Built for growth.</p>
            <div className="flex items-center gap-8">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
              <span>Cookie Settings</span>
              <span>Contact Support</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default CreateJobs;
