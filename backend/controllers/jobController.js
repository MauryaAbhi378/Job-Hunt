import { Job } from "../models/jobModel.js";
import {User} from "../models/userModel.js"

export const postJob = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      location,
      experience,
      salary,
      jobType,
      position,
      companyId,
    } = req.body;

    if (
      !title ||
      !description ||
      !requirements ||
      !salary ||
      !experience ||
      !location ||
      !jobType ||
      !position ||
      !companyId
    ) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }

    const job = await Job.create({
      title,
      description,
      requirements: requirements.split(","),
      salary: Number(salary),
      experienceLevel: experience,
      location,
      jobType,
      position,
      company: companyId,
      created_by: req.id,
    });

    return res.status(201).json({
      message: "Job Created Successfully",
      job,
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
    const query = {
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    };

    const job = await Job.find(query)
      .populate({ path: "company" })
      .sort({ createdAt: -1 });

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
    console.error("Error during finding All jobs:", error.message);
    return res.status(500).json({
      message: "Server error during finding All jobs",
      success: false,
    });
  }
};

export const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId);
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
    console.error("Error during finding job by Id:", error.message);
    return res.status(500).json({
      message: "Server error during finding job by Id",
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
