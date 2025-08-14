import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
  appylJob,
  getApplicants,
  getAppliedJobs,
  updateStatus,
} from "../controllers/applicationController.js";

const router = express.Router();

router.route("/apply/:id").get(isAuthenticated, appylJob);
router.route("/appliedjobs").get(isAuthenticated, getAppliedJobs);
router.route("/:id/applicants").get(isAuthenticated, getApplicants);
router.route("/status/:id/update").post(isAuthenticated, updateStatus);

export default router;
