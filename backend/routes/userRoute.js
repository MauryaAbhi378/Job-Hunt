import express from "express";
import {
  login,
  register,
  logout,
  updateProfile,
} from "../controllers/userController.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.route("/login").post(login);
router.route("/register").post(register);
router.route("/logout").get(logout);
router.route("/profile/update").post(isAuthenticated, updateProfile);

export default router