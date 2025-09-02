import { Job } from "../models/jobModel.js";

export const postJob = async (req, res) => {
  try {
    const {
      title,
      category,
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
      !category ||
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
      category,
      description,
      requirements: requirements.split(","),
      salary: { min: salary.min, max: salary.max },
      experienceLevel: {
        min: experience.min,
        max: experience.max,
      },
      location,
      jobType,
      position,
      company: companyId,
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

export const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId).populate([
      { path: "company" },
      { path: "applications" },
    ]);
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

export const updateJob = async (req, res) => {
  try {
    const {
      title,
      category,
      description,
      requirements,
      location,
      experience,
      salary,
      jobType,
      position,
      companyId,
    } = req.body;

    let updatedData = {};
    if (title !== undefined) updatedData.title = title;
    if (category !== undefined) updatedData.category = category;
    if (description !== undefined) updatedData.description = description;
    if (requirements !== undefined) updatedData.requirements = requirements;
    if (location !== undefined) updatedData.location = location;
    if (experience !== undefined) updatedData.experience = experience;
    if (salary !== undefined) updatedData.salary = salary;
    if (jobType !== undefined) updatedData.jobType = jobType;
    if (position !== undefined) updatedData.position = position;
    if (companyId !== undefined) updatedData.companyId = companyId;

    if (Object.keys(updatedData).length === 0) {
      return res.status(400).json({
        message: "No fields provided to update.",
        success: false,
      });
    }

    const job = await Job.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
    });

    if (!job) {
      return res.status(400).json({
        message: "Job Not Found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Job Updated",
      success: true,
    });
  } catch (error) {
    console.error("Error during Updating Job:", error.message);
    return res.status(500).json({
      message: "Server error during Updating Job",
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
