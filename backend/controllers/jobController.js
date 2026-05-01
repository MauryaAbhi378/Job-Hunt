import { Job } from "../models/jobModel.js";
import { Company } from "../models/companyModel.js";
import { parseQuillHtml } from "../utils/quillParser.js";

export const postJob = async (req, res) => {
  try {
    const {
      title,
      category,
      description,
      jobDescription,
      requirements,
      candidateRequirements,
      benefits = [],
      location,
      experience,
      salary,
      jobType,
      position,
      companyId,
    } = req.body;
    const finalDescription = description || "";
    const jobDescriptionList = Array.isArray(jobDescription)
      ? jobDescription
      : parseQuillHtml(jobDescription || finalDescription);
    const finalRequirements = candidateRequirements || requirements;
    const requirementList = Array.isArray(requirements)
      ? requirements
      : parseQuillHtml(finalRequirements || "");

    if (
      !title ||
      jobDescriptionList.length === 0 ||
      !finalRequirements ||
      !salary ||
      !location ||
      !jobType ||
      !companyId
    ) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }

    const company = await Company.findOne({
      _id: companyId,
      userId: req.id,
      onboarding: true,
    });

    if (!company) {
      return res.status(403).json({
        message: "Please complete onboarding for this company first",
        success: false,
        requiresOnboarding: true,
      });
    }

    const job = await Job.create({
      title,
      category: category || "General",
      description: finalDescription,
      jobDescription: jobDescriptionList,
      requirements: requirementList,
      candidateRequirements: finalRequirements,
      benefits,
      salary: { min: salary.min, max: salary.max },
      experienceLevel: {
        min: experience?.min ?? 0,
        max: experience?.max ?? 0,
      },
      location,
      jobType,
      position: position || 1,
      company: company._id,
      created_by: req.id,
    });

    const formatedData = {
      ...job.toObject(),
      experienceLevel: job.getExperienceLevel(),
      salary: job.getSalary(),
    };

    return res.status(201).json({
      message: "Job Created Successfully",
      job: formatedData,
      success: true,
    });
  } catch (error) {
    console.error("Job Creation error:", error.message);
    return res.status(500).json({
      message: "Server error during job creation",
      success: false,
    });
  }
};

export const getAllJobs = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";
    const location = req.query.location || "";
    let jobType = req.query.jobType || [];
    let salary = req.query.salary || {};
    const freshness = req.query.freshness || "";
    const experienceLevel = req.query.experienceLevel || {};
    const page = Number(req.query.page) || 0;
    const limit = Number(req.query.limit) || 0;

    const query = {};

    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { requirements: { $elemMatch: { $regex: keyword, $options: "i" } } },
      ];
    }

    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    if (jobType && jobType.length > 0) {
      query.jobType = { $in: jobType };
    }

    if (salary.min || salary.max) {
      query["salary.max"] = { $lte: salary.max };
    }

    if (freshness) {
      const days = parseInt(freshness.match(/\d+/)?.[0] || "0", 10);
      if (days > 0) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        query.createdAt = { $gte: cutoffDate };
      }
    }

    if (experienceLevel.min || experienceLevel.max) {
      query["experienceLevel.max"] = { $lte: experienceLevel.max };
    }

    const jobs = await Job.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate({ path: "company" })
      .sort({ createdAt: -1 });

    const totalJob = await Job.countDocuments(query);

    if (jobs.length === 0) {
      return res.status(200).json({
        message: "Job Not Found",
        success: true,
        job: [],
      });
    }

    return res.status(200).json({
      job: jobs,
      totalJob,
      totalPage: Math.ceil(totalJob / limit),
      success: true,
    });
  } catch (error) {
    console.error("Error during finding All jobs:", error.message);
    return res.status(500).json({
      message: "Server error during finding All jobs",
      success: false,
    });
  }
};

export const getAdminJobs = async (req, res) => {
  try {
    const userId = req.id;
    const jobs = await Job.find({ created_by: userId })
      .populate({
        path: "company",
      })
      .populate({
        path: "applications",
        select: "status",
      })
      .sort({ createdAt: -1 });

    if (!jobs) {
      return res.status(404).json({
        message: "Jobs not found.",
        success: false,
      });
    }
    return res.status(200).json({
      jobs,
      success: true,
    });
  } catch (error) {
    console.error("Error during finding Admin job:", error.message);
    return res.status(500).json({
      message: "Server error during finding Admin job",
      success: false,
    });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findOneAndDelete({
      _id: req.params.id,
      created_by: req.id,
    });

    if (!job) {
      return res.status(404).json({
        message: "Job Not Found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Job deleted",
      success: true,
    });
  } catch (error) {
    console.error("Error during deleting job:", error.message);
    return res.status(500).json({
      message: "Server error during deleting job",
      success: false,
    });
  }
};

export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate("company");

    if (!job) {
      return res.status(404).json({
        message: "Job Not Found",
        success: false,
      });
    }

    return res.status(200).json({
      job,
      success: true,
    });
  } catch (error) {
    console.error("Error during fetching job by id:", error.message);
    return res.status(500).json({
      message: "Server error during fetching job",
      success: false,
    });
  }
};

export const updateJob = async (req, res) => {
  try {
    const {
      title,
      description,
      jobDescription,
      candidateRequirements,
      requirements,
      benefits,
      location,
      salary,
      experienceLevel,
      experience,
      jobType,
    } = req.body;

    // Only the recruiter who created the job can update it
    const job = await Job.findOne({ _id: req.params.id, created_by: req.id });

    if (!job) {
      return res.status(404).json({
        message: "Job not found or you are not authorized to update it",
        success: false,
      });
    }

    const finalDescription = description || "";
    const jobDescriptionList = Array.isArray(jobDescription)
      ? jobDescription
      : parseQuillHtml(jobDescription || finalDescription);

    const finalRequirements = candidateRequirements || requirements;
    const requirementList = Array.isArray(requirements)
      ? requirements
      : parseQuillHtml(finalRequirements || "");

    const finalSalary = salary || {};
    const finalExperience = experienceLevel || experience || {};

    if (title !== undefined) job.title = title;
    if (jobType !== undefined) job.jobType = jobType;
    if (location !== undefined) job.location = location;
    if (finalDescription !== undefined) job.description = finalDescription;
    if (jobDescriptionList.length > 0) job.jobDescription = jobDescriptionList;
    if (requirementList.length > 0) job.requirements = requirementList;
    if (finalRequirements !== undefined) job.candidateRequirements = finalRequirements;
    if (benefits !== undefined) job.benefits = benefits;
    if (finalSalary.min !== undefined && finalSalary.max !== undefined) {
      job.salary = { min: finalSalary.min, max: finalSalary.max };
    }
    if (finalExperience.min !== undefined && finalExperience.max !== undefined) {
      job.experienceLevel = { min: finalExperience.min, max: finalExperience.max };
    }

    await job.save();

    return res.status(200).json({
      message: "Job updated successfully",
      job,
      success: true,
    });
  } catch (error) {
    console.error("Error during updating job:", error.message);
    return res.status(500).json({
      message: "Server error during updating job",
      success: false,
    });
  }
};
