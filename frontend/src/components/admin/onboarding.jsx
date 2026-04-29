import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Upload } from "lucide-react";
import { COMPANIES_API_ENDPOINT } from "../../utils/constant";
import Navbar from "../layout/Navbar";
import { setOnboardingStatus } from "../../store/slice/authSlice";
import { setSingleCompany } from "../../store/slice/companySlice";

const Onboarding = ({ companyId }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);

  const normalizeWebsiteUrl = (url) => {
    const trimmedUrl = url.trim();
    if (!trimmedUrl) return "";

    return /^https?:\/\//i.test(trimmedUrl)
      ? trimmedUrl
      : `https://${trimmedUrl}`;
  };

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    website: "",
    headquarters: "",
    foundedYear: "",
    companyType: "",
    industry: "",
    companySize: "",
    logo: null,
  });

  const [logoPreview, setLogoPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // Redirect if not recruiter
  if (user?.role?.toLowerCase() !== "recruiter") {
    navigate("/");
    return null;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleWebsiteBlur = () => {
    setFormData((prev) => ({
      ...prev,
      website: normalizeWebsiteUrl(prev.website),
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        logo: file,
      }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error("Company name is required");
      return false;
    }
    if (!formData.description.trim()) {
      toast.error("Company description is required");
      return false;
    }
    if (!formData.companyType) {
      toast.error("Company type is required");
      return false;
    }
    if (!formData.industry) {
      toast.error("Industry is required");
      return false;
    }
    if (!formData.headquarters.trim()) {
      toast.error("Headquarters is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const websiteUrl = normalizeWebsiteUrl(formData.website);

      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("website", websiteUrl);
      formDataToSend.append("headquarters", formData.headquarters);
      formDataToSend.append("foundedYear", formData.foundedYear);
      formDataToSend.append("companyType", formData.companyType);
      formDataToSend.append("industry", formData.industry);
      formDataToSend.append("companySize", formData.companySize);
      if (formData.logo) {
        formDataToSend.append("file", formData.logo);
      }
      formDataToSend.append("onboarding", "true");

      const endpoint = companyId
        ? `${COMPANIES_API_ENDPOINT}/update/${companyId}`
        : `${COMPANIES_API_ENDPOINT}/onboarding`;

      const res = await axios.post(endpoint, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      if (res.data.success) {
        dispatch(
          setOnboardingStatus({
            isCompleted: true,
            companyId: res.data.company?._id || null,
          })
        );
        // Store the newly onboarded company as the active company
        if (res.data.company) {
          dispatch(setSingleCompany(res.data.company));
        }
        toast.success(res.data.message || "Onboarding completed successfully!");
        navigate("/admin/dashboard");
      }
    } catch (error) {
      console.error("Onboarding error:", error);
      toast.error(error.response?.data?.message || "Failed to complete onboarding");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen" style={{ backgroundColor: "#fcf8ff" }}>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex gap-12">
            {/* Left Sidebar - Steps */}
            <div className="w-48 flex-shrink-0">
              <div className="sticky top-8">
                {/* Step 1 - Active */}
                <div className="mb-8">
                  <div className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                      style={{ backgroundColor: "#3525cd" }}
                    >
                      1
                    </div>
                    <div>
                      <h3
                        style={{
                          color: "#1b1b24",
                          fontFamily: "Inter",
                          fontSize: "16px",
                          fontWeight: "600",
                        }}
                      >
                        Basic Info
                      </h3>
                      <p
                        style={{
                          color: "#777587",
                          fontFamily: "Inter",
                          fontSize: "14px",
                        }}
                      >
                        Company details
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content - Form */}
            <div className="flex-1" style={{ maxWidth: "600px" }}>
              <div
                className="p-8 rounded-lg"
                style={{
                  backgroundColor: "#ffffff",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              >
                {/* Header */}
                <div className="mb-8">
                  <h1
                    className="text-3xl font-bold mb-2"
                    style={{ color: "#1b1b24", fontFamily: "Inter" }}
                  >
                    Company Profile
                  </h1>
                  <p style={{ color: "#464555", fontFamily: "Inter", fontSize: "16px" }}>
                    Tell us a bit about your organization to get started with JobHunt.
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Company Name and Founded Year - Row */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <Label
                        htmlFor="name"
                        style={{
                          color: "#1b1b24",
                          fontFamily: "Inter",
                          fontSize: "14px",
                          fontWeight: "600",
                        }}
                      >
                        Company Name
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="e.g. Acme Corporation"
                        className="mt-2 w-full"
                        style={{
                          borderColor: "#d1d5db",
                          borderRadius: "8px",
                        }}
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor="foundedYear"
                        style={{
                          color: "#1b1b24",
                          fontFamily: "Inter",
                          fontSize: "14px",
                          fontWeight: "600",
                        }}
                      >
                        Founded Year
                      </Label>
                      <Input
                        id="foundedYear"
                        name="foundedYear"
                        value={formData.foundedYear}
                        onChange={handleInputChange}
                        type="number"
                        placeholder="e.g. 2015"
                        className="mt-2 w-full"
                        style={{ borderRadius: "8px", borderColor: "#d1d5db" }}
                      />
                    </div>
                  </div>

                  {/* Industry and Company Type - Row */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <Label
                        htmlFor="industry"
                        style={{
                          color: "#1b1b24",
                          fontFamily: "Inter",
                          fontSize: "14px",
                          fontWeight: "600",
                        }}
                      >
                        Industry
                      </Label>
                      <Select
                        value={formData.industry}
                        onValueChange={(value) =>
                          handleSelectChange("industry", value)
                        }
                      >
                        <SelectTrigger
                          className="mt-2 w-full"
                          style={{ borderRadius: "8px", borderColor: "#d1d5db" }}
                        >
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Technology">Technology</SelectItem>
                          <SelectItem value="Finance">Finance</SelectItem>
                          <SelectItem value="Healthcare">Healthcare</SelectItem>
                          <SelectItem value="Education">Education</SelectItem>
                          <SelectItem value="Retail">Retail</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label
                        htmlFor="companyType"
                        style={{
                          color: "#1b1b24",
                          fontFamily: "Inter",
                          fontSize: "14px",
                          fontWeight: "600",
                        }}
                      >
                        Company Type
                      </Label>
                      <Select
                        value={formData.companyType}
                        onValueChange={(value) =>
                          handleSelectChange("companyType", value)
                        }
                      >
                        <SelectTrigger
                          className="mt-2 w-full"
                          style={{ borderRadius: "8px", borderColor: "#d1d5db" }}
                        >
                          <SelectValue placeholder="Select company type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Private">Private</SelectItem>
                          <SelectItem value="Public">Public</SelectItem>
                          <SelectItem value="Non-Profit">Non-Profit</SelectItem>
                          <SelectItem value="Government">Government</SelectItem>
                          <SelectItem value="Startup">Startup</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Headquarters and Company Size - Row */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <Label
                        htmlFor="headquarters"
                        style={{
                          color: "#1b1b24",
                          fontFamily: "Inter",
                          fontSize: "14px",
                          fontWeight: "600",
                        }}
                      >
                        Headquarters
                      </Label>
                      <Input
                        id="headquarters"
                        name="headquarters"
                        value={formData.headquarters}
                        onChange={handleInputChange}
                        placeholder="e.g. San Francisco, CA"
                        className="mt-2 w-full"
                        style={{ borderRadius: "8px", borderColor: "#d1d5db" }}
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor="companySize"
                        style={{
                          color: "#1b1b24",
                          fontFamily: "Inter",
                          fontSize: "14px",
                          fontWeight: "600",
                        }}
                      >
                        Company Size
                      </Label>
                      <Select
                        value={formData.companySize}
                        onValueChange={(value) =>
                          handleSelectChange("companySize", value)
                        }
                      >
                        <SelectTrigger
                          className="mt-2 w-full"
                          style={{ borderRadius: "8px", borderColor: "#d1d5db" }}
                        >
                          <SelectValue placeholder="Employees" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-10">1-10 Employees</SelectItem>
                          <SelectItem value="11-50">11-50 Employees</SelectItem>
                          <SelectItem value="51-200">51-200 Employees</SelectItem>
                          <SelectItem value="201-500">201-500 Employees</SelectItem>
                          <SelectItem value="501-1000">501-1000 Employees</SelectItem>
                          <SelectItem value="1000+">1000+ Employees</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Website URL */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <Label
                        htmlFor="website"
                        style={{
                          color: "#1b1b24",
                          fontFamily: "Inter",
                          fontSize: "14px",
                          fontWeight: "600",
                        }}
                      >
                        Website URL
                      </Label>
                      <Input
                        id="website"
                        name="website"
                        value={formData.website}
                        onChange={handleInputChange}
                        onBlur={handleWebsiteBlur}
                        type="text"
                        inputMode="url"
                        placeholder="www.yourcompany.com"
                        className="mt-2 w-full"
                        style={{ borderRadius: "8px", borderColor: "#d1d5db" }}
                      />
                    </div>
                  </div>

                  {/* Company Logo */}
                  <div>
                    <Label
                      htmlFor="logo"
                      style={{
                        color: "#1b1b24",
                        fontFamily: "Inter",
                        fontSize: "14px",
                        fontWeight: "600",
                      }}
                    >
                      Company Logo
                    </Label>
                    <div
                      className="mt-2 border-2 border-dashed p-8 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
                      style={{
                        borderColor: "#c7c4d8",
                        backgroundColor: "#fcf8ff",
                      }}
                      onClick={() => document.getElementById("logoInput").click()}
                    >
                      {logoPreview ? (
                        <div className="text-center">
                          <img
                            src={logoPreview}
                            alt="Logo preview"
                            className="h-24 w-24 object-contain mx-auto mb-2"
                          />
                          <p style={{ color: "#4f46e5", fontSize: "14px" }}>
                            Change logo
                          </p>
                        </div>
                      ) : (
                        <div className="text-center">
                          <Upload
                            className="mx-auto h-8 w-8 mb-2"
                            style={{ color: "#4f46e5" }}
                          />
                          <p
                            style={{
                              color: "#1b1b24",
                              fontSize: "14px",
                              fontWeight: "500",
                            }}
                          >
                            Click to upload or drag and drop
                          </p>
                          <p style={{ color: "#777587", fontSize: "12px" }}>
                            SVG, PNG, JPG or GIF (max. 5MB)
                          </p>
                        </div>
                      )}
                      <input
                        id="logoInput"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </div>
                  </div>

                  {/* Company Description */}
                  <div>
                    <Label
                      htmlFor="description"
                      style={{
                        color: "#1b1b24",
                        fontFamily: "Inter",
                        fontSize: "14px",
                        fontWeight: "600",
                      }}
                    >
                      Company Description
                    </Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Tell candidates about your mission, culture, and values..."
                      rows="5"
                      className="mt-2 w-full h-30"
                      style={{
                        borderRadius: "8px",
                        borderColor: "#d1d5db",
                        fontFamily: "Inter",
                      }}
                    />
                    <p
                      style={{ color: "#777587", fontSize: "12px" }}
                      className="mt-2"
                    >
                      Max 500 characters
                    </p>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-4 pt-6">
                    <Button
                      type="submit"
                      disabled={loading}
                      style={{
                        backgroundColor: "#4f46e5",
                        color: "#ffffff",
                        borderRadius: "8px",
                        flex: 1,
                      }}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Completing...
                        </>
                      ) : (
                        "Save and Continue →"
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
