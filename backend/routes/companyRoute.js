import express from "express";
import {
  getCompany,
  getCompanyById,
  registerCompany,
  updateCompany,
  completeOnboarding,
} from "../controllers/companyController.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/multer.js";
import { isOnboardingComplete } from "../middlewares/isOnboarded.js";

const router = express.Router();

// router.route("/register").post(isAuthenticated, registerCompany);
// router.route("/get").get(isAuthenticated, isOnboardingComplete, getCompany);
router
  .route("/get/:id")
  .get(isAuthenticated, isOnboardingComplete, getCompanyById);
//   .route("/update/:id")
//   .put(singleUpload, isAuthenticated, isOnboardingComplete, updateCompany);
router.route("/onboarding").post(singleUpload, isAuthenticated, completeOnboarding);

export default router;
