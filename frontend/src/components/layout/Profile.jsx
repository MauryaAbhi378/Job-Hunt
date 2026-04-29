import { useMemo, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
  BriefcaseBusiness,
  GraduationCap,
  Loader2,
  MapPin,
  PenLine,
  Plus,
  Download,
  Eye,
} from "lucide-react";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Navbar from "../layout/Navbar.jsx";
import { setUser } from "../../store/slice/authSlice";
import { USER_API_ENDPOINT } from "../../utils/constant.js";

const emptyWork = {
  company: "",
  role: "",
  description: "",
  startDate: "",
  endDate: "",
  isCurrentlyWorking: false,
};

const emptyEducation = {
  institution: "",
  degree: "",
  fieldOfStudy: "",
  startYear: "",
  endYear: "",
  grade: "",
};

const emptyArray = [];
const emptyProfile = {};

const toDateInput = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
};

const formatDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
};

const latestExperience = (experiences = []) => {
  return [...experiences]
    .filter((item) => item?.role || item?.company)
    .sort((a, b) => {
      if (a.isCurrentlyWorking !== b.isCurrentlyWorking) {
        return a.isCurrentlyWorking ? -1 : 1;
      }

      const aTime = new Date(a.startDate || a.endDate || 0).getTime();
      const bTime = new Date(b.startDate || b.endDate || 0).getTime();
      return bTime - aTime;
    })[0];
};

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);
  const profile = user?.profile || emptyProfile;
  const workExperience = profile.workExperience || emptyArray;
  const education = profile.education || emptyArray;
  const skills = profile.skills || emptyArray;
  const currentRole = useMemo(
    () => latestExperience(workExperience),
    [workExperience]
  );

  const [saving, setSaving] = useState(false);
  const [workModal, setWorkModal] = useState({
    open: false,
    index: null,
    values: emptyWork,
  });
  const [educationModal, setEducationModal] = useState({
    open: false,
    index: null,
    values: emptyEducation,
  });
  const [bioModal, setBioModal] = useState({
    open: false,
    value: profile.bio || "",
  });
  const [skillsModal, setSkillsModal] = useState({
    open: false,
    value: skills.join(", "),
  });
  const [resumeModal, setResumeModal] = useState({
    open: false,
    file: null,
    loading: false,
  });

  const updateProfileArrays = async (payload) => {
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      formData.append(key, JSON.stringify(value));
    });

    const res = await axios.post(`${USER_API_ENDPOINT}/profile/update`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    });

    if (res.data.success) {
      dispatch(setUser(res.data.user));
      toast.success(res.data.message);
    }
  };

  const updateProfileFields = async (payload) => {
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const res = await axios.post(`${USER_API_ENDPOINT}/profile/update`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    });

    if (res.data.success) {
      dispatch(setUser(res.data.user));
      toast.success(res.data.message);
    }
  };

  const openWorkForm = (item = emptyWork, index = null) => {
    setWorkModal({
      open: true,
      index,
      values: {
        ...emptyWork,
        ...item,
        startDate: toDateInput(item.startDate),
        endDate: toDateInput(item.endDate),
        isCurrentlyWorking: Boolean(item.isCurrentlyWorking),
      },
    });
  };

  const openEducationForm = (item = emptyEducation, index = null) => {
    setEducationModal({
      open: true,
      index,
      values: { ...emptyEducation, ...item },
    });
  };

  const saveWorkExperience = async (e) => {
    e.preventDefault();
    const values = {
      ...workModal.values,
      endDate: workModal.values.isCurrentlyWorking ? "" : workModal.values.endDate,
    };
    const nextWorkExperience = [...workExperience];

    if (workModal.index === null) {
      nextWorkExperience.push(values);
    } else {
      nextWorkExperience[workModal.index] = values;
    }

    try {
      setSaving(true);
      await updateProfileArrays({ workExperience: nextWorkExperience });
      setWorkModal({ open: false, index: null, values: emptyWork });
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update experience");
    } finally {
      setSaving(false);
    }
  };

  const saveEducation = async (e) => {
    e.preventDefault();
    const values = {
      ...educationModal.values,
      startYear: educationModal.values.startYear
        ? Number(educationModal.values.startYear)
        : "",
      endYear: educationModal.values.endYear
        ? Number(educationModal.values.endYear)
        : "",
    };
    const nextEducation = [...education];

    if (educationModal.index === null) {
      nextEducation.push(values);
    } else {
      nextEducation[educationModal.index] = values;
    }

    try {
      setSaving(true);
      await updateProfileArrays({ education: nextEducation });
      setEducationModal({ open: false, index: null, values: emptyEducation });
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update education");
    } finally {
      setSaving(false);
    }
  };

  const saveBio = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      await updateProfileFields({ bio: bioModal.value });
      setBioModal((prev) => ({ ...prev, open: false }));
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update bio");
    } finally {
      setSaving(false);
    }
  };

  const saveSkills = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      await updateProfileFields({ skills: skillsModal.value });
      setSkillsModal((prev) => ({ ...prev, open: false }));
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update skills");
    } finally {
      setSaving(false);
    }
  };

  const saveResume = async (e) => {
    e.preventDefault();
    if (!resumeModal.file) {
      toast.error("Please select a resume file");
      return;
    }

    const formData = new FormData();
    formData.append("file", resumeModal.file);

    try {
      setResumeModal((prev) => ({ ...prev, loading: true }));
      const res = await axios.post(
        `${USER_API_ENDPOINT}/profile/update`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success("Resume uploaded successfully");
        setResumeModal({ open: false, file: null, loading: false });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to upload resume");
    } finally {
      setResumeModal((prev) => ({ ...prev, loading: false }));
    }
  };

  const handleResumeChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file type (PDF only for now)
      if (!file.type.includes("pdf")) {
        toast.error("Please upload a PDF file");
        return;
      }
      setResumeModal((prev) => ({ ...prev, file }));
    }
  };

  const getResumeLastUpdated = () => {
    if (!user?.updatedAt) return "Never";
    const date = new Date(user.updatedAt);
    const now = new Date();
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "1 day ago";
    return `${diffInDays} days ago`;
  };

  return (
    <div className="min-h-screen bg-[#fbf7ff] text-slate-950">
      <Navbar />

      <main className="mx-auto grid max-w-7xl gap-6 px-4 py-10 md:grid-cols-[360px_1fr] lg:px-8">
        <aside className="space-y-6">
          <section className="rounded-lg border border-slate-100 bg-white p-7 shadow-sm">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-32 w-32 border-4 border-indigo-100 shadow-sm">
                <AvatarImage
                  src={profile.profilePhoto || "https://github.com/shadcn.png"}
                  alt={user?.fullname || "Profile photo"}
                />
              </Avatar>
              <h1 className="mt-5 text-2xl font-bold">{user?.fullname}</h1>
              {currentRole ? (
                <p className="mt-2 text-base text-slate-700">
                  {currentRole.role}
                  {currentRole.company ? ` at ${currentRole.company}` : ""}
                </p>
              ) : null}
              {profile.location ? (
                <div className="mt-5 flex items-center gap-2 text-slate-700">
                  <MapPin className="h-4 w-4 text-indigo-700" />
                  <span>{profile.location}</span>
                </div>
              ) : null}
            </div>
          </section>

          <section className="rounded-lg border border-slate-100 bg-white p-7 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-bold">About</h2>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() =>
                  setBioModal({ open: true, value: profile.bio || "" })
                }
                aria-label="Edit bio"
              >
                <PenLine className="h-4 w-4" />
              </Button>
            </div>
            <p className="mt-4 leading-7 text-slate-700">
              {profile.bio || "No bio added yet."}
            </p>
          </section>

          <section className="rounded-lg border border-slate-100 bg-white p-7 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-bold">Skills</h2>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() =>
                  setSkillsModal({ open: true, value: skills.join(", ") })
                }
                aria-label="Edit skills"
              >
                <PenLine className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {skills.length ? (
                skills.map((skill, index) => (
                  <Badge
                    key={`${skill}-${index}`}
                    className="rounded-full bg-indigo-50 px-4 py-1.5 text-sm font-medium text-indigo-700 hover:bg-indigo-50"
                  >
                    {skill}
                  </Badge>
                ))
              ) : (
                <span className="text-slate-500">No skills added yet.</span>
              )}
            </div>
          </section>
        </aside>

        <div className="space-y-6">
          {/* Resume Section */}
          <section className="rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-800 p-6 shadow-sm text-white">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="text-2xl font-bold">Current Resume</h3>
                <p className="text-indigo-100 text-sm mt-1">
                  Your resume was last updated {getResumeLastUpdated()}. Ensure it
                  includes your most recent achievements.
                </p>
              </div>
              <div className="text-indigo-200 opacity-50">
                <svg
                  className="w-16 h-16"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
                  <path d="M14 2v6h6M9 13h6M9 17h6" opacity="0.5" />
                </svg>
              </div>
            </div>

            <div className="flex gap-3 flex-wrap">
              {profile.resume ? (
                <>
                  <a
                    href={profile.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-medium transition"
                  >
                    <Eye className="w-4 h-4" />
                    View Resume
                  </a>
                  <a
                    href={profile.resumeDownload || profile.resume}
                    download
                    className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-medium transition"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </a>
                  <Button
                    onClick={() => setResumeModal({ open: true, file: null, loading: false })}
                    className="bg-white text-indigo-700 hover:bg-indigo-50 font-medium"
                  >
                    Update Resume
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => setResumeModal({ open: true, file: null, loading: false })}
                  className="bg-white text-indigo-700 hover:bg-indigo-50 font-medium"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Upload Resume
                </Button>
              )}
            </div>
          </section>

          <section className="rounded-lg border border-slate-100 bg-white p-7 shadow-sm">
            <div className="mb-7 flex items-center justify-between gap-4">
              <h2 className="text-2xl font-bold">Work Experience</h2>
              <Button
                type="button"
                variant="ghost"
                className="gap-2 text-indigo-700 hover:text-indigo-800"
                onClick={() => openWorkForm()}
              >
                <Plus className="h-5 w-5" />
                Add Experience
              </Button>
            </div>

            <div className="space-y-7">
              {workExperience.length ? (
                workExperience.map((item, index) => (
                  <article
                    key={item._id || `${item.company}-${index}`}
                    className="flex gap-5 border-b border-slate-200 pb-7 last:border-b-0 last:pb-0"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700">
                      <BriefcaseBusiness className="h-6 w-6" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-bold">{item.role}</h3>
                          <p className="mt-1 text-slate-800">{item.company}</p>
                        </div>
                        <div className="flex shrink-0 items-center gap-3">
                          <p className="text-sm text-slate-700">
                            {formatDate(item.startDate)}
                            {item.startDate || item.endDate || item.isCurrentlyWorking
                              ? " - "
                              : ""}
                            {item.isCurrentlyWorking
                              ? "Present"
                              : formatDate(item.endDate)}
                          </p>
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            onClick={() => openWorkForm(item, index)}
                            aria-label="Edit work experience"
                          >
                            <PenLine className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      {item.description ? (
                        <p className="mt-3 leading-7 text-slate-700">
                          {item.description}
                        </p>
                      ) : null}
                    </div>
                  </article>
                ))
              ) : (
                <p className="text-slate-500">No work experience added yet.</p>
              )}
            </div>
          </section>

          <section className="rounded-lg border border-slate-100 bg-white p-7 shadow-sm">
            <div className="mb-7 flex items-center justify-between gap-4">
              <h2 className="text-2xl font-bold">Education</h2>
              <Button
                type="button"
                variant="ghost"
                className="gap-2 text-indigo-700 hover:text-indigo-800"
                onClick={() => openEducationForm()}
              >
                <Plus className="h-5 w-5" />
                Add Education
              </Button>
            </div>

            <div className="space-y-7">
              {education.length ? (
                education.map((item, index) => (
                  <article
                    key={item._id || `${item.institution}-${index}`}
                    className="flex gap-5 border-b border-slate-200 pb-7 last:border-b-0 last:pb-0"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700">
                      <GraduationCap className="h-6 w-6" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-bold">{item.degree}</h3>
                          <p className="mt-1 text-slate-800">
                            {item.institution}
                          </p>
                        </div>
                        <div className="flex shrink-0 items-center gap-3">
                          <p className="text-sm text-slate-700">
                            {[item.startYear, item.endYear]
                              .filter(Boolean)
                              .join(" - ")}
                          </p>
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            onClick={() => openEducationForm(item, index)}
                            aria-label="Edit education"
                          >
                            <PenLine className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="mt-3 leading-7 text-slate-700">
                        {[item.fieldOfStudy, item.grade && `Grade: ${item.grade}`]
                          .filter(Boolean)
                          .join(" - ")}
                      </p>
                    </div>
                  </article>
                ))
              ) : (
                <p className="text-slate-500">No education added yet.</p>
              )}
            </div>
          </section>
        </div>
      </main>

      <Dialog
        open={workModal.open}
        onOpenChange={(open) => setWorkModal((prev) => ({ ...prev, open }))}
      >
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {workModal.index === null ? "Add Experience" : "Edit Experience"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={saveWorkExperience} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Company" id="work-company">
                <Input
                  id="work-company"
                  value={workModal.values.company}
                  onChange={(e) =>
                    setWorkModal((prev) => ({
                      ...prev,
                      values: { ...prev.values, company: e.target.value },
                    }))
                  }
                />
              </Field>
              <Field label="Role" id="work-role">
                <Input
                  id="work-role"
                  value={workModal.values.role}
                  onChange={(e) =>
                    setWorkModal((prev) => ({
                      ...prev,
                      values: { ...prev.values, role: e.target.value },
                    }))
                  }
                />
              </Field>
            </div>

            <Field label="Description" id="work-description">
              <Textarea
                id="work-description"
                value={workModal.values.description}
                onChange={(e) =>
                  setWorkModal((prev) => ({
                    ...prev,
                    values: { ...prev.values, description: e.target.value },
                  }))
                }
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Start Date" id="work-start-date">
                <Input
                  id="work-start-date"
                  type="date"
                  value={workModal.values.startDate}
                  onChange={(e) =>
                    setWorkModal((prev) => ({
                      ...prev,
                      values: { ...prev.values, startDate: e.target.value },
                    }))
                  }
                />
              </Field>
              {!workModal.values.isCurrentlyWorking ? (
                <Field label="End Date" id="work-end-date">
                  <Input
                    id="work-end-date"
                    type="date"
                    value={workModal.values.endDate}
                    onChange={(e) =>
                      setWorkModal((prev) => ({
                        ...prev,
                        values: { ...prev.values, endDate: e.target.value },
                      }))
                    }
                  />
                </Field>
              ) : null}
            </div>

            <div className="flex items-center gap-3">
              <Checkbox
                id="is-currently-working"
                checked={workModal.values.isCurrentlyWorking}
                onCheckedChange={(checked) =>
                  setWorkModal((prev) => ({
                    ...prev,
                    values: {
                      ...prev.values,
                      isCurrentlyWorking: Boolean(checked),
                    },
                  }))
                }
              />
              <Label htmlFor="is-currently-working">
                Is Currently Working
              </Label>
            </div>

            <DialogFooter>
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={educationModal.open}
        onOpenChange={(open) => setEducationModal((prev) => ({ ...prev, open }))}
      >
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {educationModal.index === null ? "Add Education" : "Edit Education"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={saveEducation} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Institution" id="education-institution">
                <Input
                  id="education-institution"
                  value={educationModal.values.institution}
                  onChange={(e) =>
                    setEducationModal((prev) => ({
                      ...prev,
                      values: { ...prev.values, institution: e.target.value },
                    }))
                  }
                />
              </Field>
              <Field label="Degree" id="education-degree">
                <Input
                  id="education-degree"
                  value={educationModal.values.degree}
                  onChange={(e) =>
                    setEducationModal((prev) => ({
                      ...prev,
                      values: { ...prev.values, degree: e.target.value },
                    }))
                  }
                />
              </Field>
              <Field label="Field of Study" id="education-field-of-study">
                <Input
                  id="education-field-of-study"
                  value={educationModal.values.fieldOfStudy}
                  onChange={(e) =>
                    setEducationModal((prev) => ({
                      ...prev,
                      values: { ...prev.values, fieldOfStudy: e.target.value },
                    }))
                  }
                />
              </Field>
              <Field label="Grade" id="education-grade">
                <Input
                  id="education-grade"
                  value={educationModal.values.grade}
                  onChange={(e) =>
                    setEducationModal((prev) => ({
                      ...prev,
                      values: { ...prev.values, grade: e.target.value },
                    }))
                  }
                />
              </Field>
              <Field label="Start Year" id="education-start-year">
                <Input
                  id="education-start-year"
                  type="number"
                  value={educationModal.values.startYear}
                  onChange={(e) =>
                    setEducationModal((prev) => ({
                      ...prev,
                      values: { ...prev.values, startYear: e.target.value },
                    }))
                  }
                />
              </Field>
              <Field label="End Year" id="education-end-year">
                <Input
                  id="education-end-year"
                  type="number"
                  value={educationModal.values.endYear}
                  onChange={(e) =>
                    setEducationModal((prev) => ({
                      ...prev,
                      values: { ...prev.values, endYear: e.target.value },
                    }))
                  }
                />
              </Field>
            </div>

            <DialogFooter>
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={bioModal.open}
        onOpenChange={(open) => setBioModal((prev) => ({ ...prev, open }))}
      >
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Edit Bio</DialogTitle>
          </DialogHeader>
          <form onSubmit={saveBio} className="space-y-5">
            <Field label="Bio" id="profile-bio">
              <Textarea
                id="profile-bio"
                value={bioModal.value}
                onChange={(e) =>
                  setBioModal((prev) => ({ ...prev, value: e.target.value }))
                }
                className="min-h-32"
              />
            </Field>

            <DialogFooter>
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={skillsModal.open}
        onOpenChange={(open) => setSkillsModal((prev) => ({ ...prev, open }))}
      >
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Edit Skills</DialogTitle>
          </DialogHeader>
          <form onSubmit={saveSkills} className="space-y-5">
            <Field label="Skills" id="profile-skills">
              <Textarea
                id="profile-skills"
                value={skillsModal.value}
                onChange={(e) =>
                  setSkillsModal((prev) => ({ ...prev, value: e.target.value }))
                }
                className="min-h-28"
              />
            </Field>

            <DialogFooter>
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={resumeModal.open}
        onOpenChange={(open) =>
          setResumeModal((prev) => ({ ...prev, open }))
        }
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {profile.resume ? "Update Resume" : "Upload Resume"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={saveResume} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="resume-file">Select PDF File</Label>
              <Input
                id="resume-file"
                type="file"
                accept=".pdf"
                onChange={handleResumeChange}
                disabled={resumeModal.loading}
                className="cursor-pointer"
              />
              {resumeModal.file && (
                <p className="text-sm text-slate-600 mt-2">
                  Selected: {resumeModal.file.name}
                </p>
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setResumeModal({ open: false, file: null, loading: false })
                }
                disabled={resumeModal.loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={resumeModal.loading || !resumeModal.file}
              >
                {resumeModal.loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {profile.resume ? "Update" : "Upload"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const Field = ({ children, id, label }) => (
  <div className="space-y-2">
    <Label htmlFor={id}>{label}</Label>
    {children}
  </div>
);

export default Profile;
