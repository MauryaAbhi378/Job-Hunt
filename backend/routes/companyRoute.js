import express from "express";
import {
  getCompanyById,
  completeOnboarding,
} from "../controllers/companyController.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/multer.js";
import { isOnboardingComplete } from "../middlewares/isOnboarded.js";

const router = express.Router();

router
  .route("/get/:id")
  .get(isAuthenticated, isOnboardingComplete, getCompanyById);
router.route("/onboarding").post(singleUpload, isAuthenticated, completeOnboarding);

export default router;
