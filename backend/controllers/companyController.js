import { Company } from "../models/companyModel.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

export const registerCompany = async (req, res) => {
  try {
    const { companyName } = req.body;

    if (!companyName) {
      return res.status(400).json({
        message: "Company name is missing",
        success: false,
      });
    }

    let company = await Company.findOne({ name: companyName });
    if (company) {
      return res.status(409).json({
        message: "Company already Registered",
        success: false,
      });
    }

    company = await Company.create({
      name: companyName,
      userId: req.id,
    });

    return res.status(201).json({
      message: "Company Registered Successfully",
      company,
      success: true,
    });
  } catch (error) {
    console.error("Registration error:", error.message);
    return res.status(500).json({
      message: "Server error during registration",
      success: false,
    });
  }
};

export const getCompany = async (req, res) => {
  try {
    const userId = req.id; // From middleware isAuthenticated
    const companies = await Company.find({ userId });

    if (!companies) {
      return res.status(404).json({
        message: "Companies Not Found",
        success: false,
      });
    }

    return res.status(200).json({
      companies,
      success: true,
    });
  } catch (error) {
    console.error("Error while fetching companies:", error.message);
    return res.status(500).json({
      message: "Server error during fetching companies",
      success: false,
    });
  }
};

export const getCompanyById = async (req, res) => {
  try {
    const companyId = req.params.id;
    const company = await Company.findById(companyId);

    if (!company) {
      return res.status(404).json({
        message: "Company Not Found",
        success: false,
      });
    }

    return res.status(200).json({
      company,
      success: true,
    });
  } catch (error) {
    console.error("Error while fetching companyById:", error.message);
    return res.status(500).json({
      message: "Server error during fetching companyById",
      success: false,
    });
  }
};

export const updateCompany = async (req, res) => {
  try {
    const {
      name,
      description,
      website,
      location,
      headquarters,
      foundedYear,
      companyType,
      industry,
      companySize,
      onboarding,
    } = req.body;

    let logo = null;
    if (req.file) {
      const fileUri = getDataUri(req.file);
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
      logo = cloudResponse.secure_url;
    }

    let updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (website !== undefined) updateData.website = website;
    if (location !== undefined) updateData.location = location;
    if (headquarters !== undefined) updateData.headquarters = headquarters;
    if (foundedYear !== undefined) updateData.foundedYear = foundedYear;
    if (companyType !== undefined) updateData.companyType = companyType;
    if (industry !== undefined) updateData.industry = industry;
    if (companySize !== undefined) updateData.companySize = companySize;
    // If the onboarding form is calling this, mark onboarding as complete
    if (onboarding === "true" || onboarding === true) updateData.onboarding = true;
    if (logo) updateData.logo = logo;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        message: "No fields provided to update.",
        success: false,
      });
    }

    const company = await Company.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!company) {
      return res.status(404).json({
        message: "Company Not Found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Company information updated.",
      company,
      success: true,
    });
  } catch (error) {
    console.error("Error while upating companyById:", error.message);
    return res.status(500).json({
      message: "Server error during updating companyById",
      success: false,
    });
  }
};

export const completeOnboarding = async (req, res) => {
  try {
    const {
      name,
      description,
      website,
      headquarters,
      location,
      foundedYear,
      companyType,
      industry,
      companySize,
      onboarding,
    } = req.body;
    const userId = req.id;
    const companyHeadquarters = headquarters || location;

    // Validate required fields
    if (
      !name ||
      !description ||
      !companyType ||
      !industry ||
      !companyHeadquarters
    ) {
      return res.status(400).json({
        message: "Missing required fields",
        success: false,
      });
    }

    let logo = null;
    if (req.file) {
      const fileUri = getDataUri(req.file);
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
      logo = cloudResponse.secure_url;
    }

    // Check if company exists or create new one
    // Find the company that belongs to this user AND has onboarding: true,
    // or fall back to the most recently created one for this user.
    let company = await Company.findOne({ userId, onboarding: true }).sort({ createdAt: -1 });
    if (!company) {
      company = await Company.findOne({ userId }).sort({ createdAt: -1 });
    }

    if (company) {
      // Update existing company
      company.name = name;
      company.description = description;
      company.website = website || company.website;
      company.headquarters = companyHeadquarters;
      company.foundedYear = foundedYear || company.foundedYear;
      company.companyType = companyType;
      company.industry = industry;
      company.companySize = companySize || company.companySize;
      company.onboarding = true;
      if (logo) company.logo = logo;
      await company.save();
    } else {
      // Create new company with onboarding data
      company = await Company.create({
        name,
        description,
        website,
        headquarters: companyHeadquarters,
        foundedYear,
        companyType,
        industry,
        companySize,
        logo,
        userId,
        onboarding: true,
      });
    }

    return res.status(200).json({
      message: "Onboarding completed successfully!",
      company,
      success: true,
    });
  } catch (error) {
    console.error("Onboarding error:", error.message);
    return res.status(500).json({
      message: "Server error during onboarding",
      success: false,
    });
  }
};
