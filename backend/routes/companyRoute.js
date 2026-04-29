import express from "express";
import {
  getCompany,
  getCompanyById,
  updateCompany,
  completeOnboarding,
} from "../controllers/companyController.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/multer.js";
import { isOnboardingComplete } from "../middlewares/isOnboarded.js";

const router = express.Router();

// Fetch all companies belonging to the logged-in recruiter
router.route("/get").get(isAuthenticated, getCompany);

// Fetch a single company by ID (requires onboarding to be complete)
router.route("/get/:id").get(isAuthenticated, isOnboardingComplete, getCompanyById);

// Complete onboarding for a new company
router.route("/onboarding").post(singleUpload, isAuthenticated, completeOnboarding);

// Update an existing company by ID (also used by onboarding form when editing)
router.route("/update/:id").post(singleUpload, isAuthenticated, updateCompany);

export default router;
