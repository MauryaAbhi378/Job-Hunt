import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { isOnboardingComplete } from "../middlewares/isOnboarded.js";
import {
  deleteJob,
  getAdminJobs,
  getAllJobs,
  getJobById,
  postJob,
  updateJob,
} from "../controllers/jobController.js";

const router = express.Router();

router.route("/post").post(isAuthenticated, isOnboardingComplete, postJob);
router.route("/get").get(isAuthenticated, getAllJobs);
router
  .route("/getadminjobs")
  .get(isAuthenticated, isOnboardingComplete, getAdminJobs);

router.route("/get/:id").get(isAuthenticated, getJobById);

router
  .route("/job/update/:id")
  .put(isAuthenticated, isOnboardingComplete, updateJob);

router
  .route("/job/delete/:id")
  .delete(isAuthenticated, isOnboardingComplete, deleteJob);

export default router
