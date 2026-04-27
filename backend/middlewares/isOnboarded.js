import { Company } from "../models/companyModel.js";
import { User } from "../models/userModel.js";

// Middleware to check if recruiter has completed onboarding
const isOnboardingComplete = async (req, res, next) => {
  try {
    const userId = req.id;

    // Get user to check if they're a recruiter
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    // Only apply onboarding check for recruiters
    if (user.role.toLowerCase() !== "recruiter") {
      return next();
    }

    // Check if company has completed onboarding
    const company = await Company.findOne({ userId, onboarding: true });

    if (!company) {
      return res.status(403).json({
        message: "Please complete onboarding first",
        success: false,
        requiresOnboarding: true,
      });
    }

    req.company = company;
    next();
  } catch (error) {
    console.error("Error in onboarding check middleware:", error.message);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

// Middleware to fetch onboarding status (for login response)
const fetchOnboardingStatus = async (req, res, next) => {
  try {
    const userId = req.id;

    // Get user
    const user = await User.findById(userId);
    if (!user) {
      return next();
    }

    // Only check for recruiters
    if (user.role.toLowerCase() === "recruiter") {
      const company = await Company.findOne({ userId });
      req.onboardingStatus = {
        isCompleted: company?.onboarding || false,
        companyId: company?._id,
      };
    }

    next();
  } catch (error) {
    console.error("Error fetching onboarding status:", error.message);
    next();
  }
};

export { isOnboardingComplete, fetchOnboardingStatus };
