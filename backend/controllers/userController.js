import { User } from "../models/userModel.js";
import { Company } from "../models/companyModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import path from "path";

export const register = async (req, res) => {
  try {
    const { fullname, email, password, phoneNumber, role } = req.body;
    if (!fullname || !email || !password || !phoneNumber || !role) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }

    let profilePhotoUrl = null;
    if (req.file) {
      const fileUri = getDataUri(file);
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
      profilePhotoUrl = cloudResponse.secure_url;
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(409).json({
        message: "User is already registered",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      fullname,
      email,
      password: hashedPassword,
      phoneNumber,
      role,
      profile: {
        profilePhoto: profilePhotoUrl,
      },
    });

    return res.status(201).json({
      message: "User Registered Successfully",
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

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "User is not registered",
        success: false,
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(404).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    if (role !== user.role) {
      return res.status(404).json({
        message: "Account doesn't exists with current role",
        success: false,
      });
    }

    // 🛡️ Create JWT payload with user ID
    const tokenData = {
      userId: user._id,
    };

    const token = await jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    // Check onboarding status for recruiters
    let onboardingStatus = null;
    if (user.role.toLowerCase() === "recruiter") {
      const company = await Company.findOne({ userId: user._id, onboarding: true });
      onboardingStatus = {
        isCompleted: !!company,
        companyId: company?._id || null,
      };
    }

    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };
    // 🍪 Set token in HTTP-only cookie for client storage
    return res
      .status(201)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day in ms
        httpOnly: true, // 🚫 Not accessible via JavaScript (XSS protection)
        sameSite: "strict", // 🛡️ Prevent CSRF
      })
      .json({
        message: `Welcome back ${user.fullname}`,
        user,
        onboardingStatus,
        success: true,
      });
  } catch (error) {
    console.error("Login error:", error.message);
    return res.status(500).json({
      message: "Server error during Login",
      success: false,
    });
  }
};

export const logout = async (req, res) => {
  try {
    return res
      .status(200)
      .cookie("token", "", {
        maxAge: 0,
      })
      .json({
        message: "Logged out Successully",
        success: true,
      });
  } catch (error) {
    console.error("Logout error:", error.message);
    return res.status(500).json({
      message: "Server error during Logout",
      success: false,
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const {
      fullname,
      email,
      phoneNumber,
      bio,
      skills,
      location,
      education,
      workExperience,
    } = req.body;

    const file = req.file;
    let cloudResponse;

    if (file) {
      const fileUri = getDataUri(file);
      console.log("DataURI Preview:", fileUri.content.substring(0, 50));

      const ext = path.extname(file.originalname); // preserve .pdf
      const baseName = path.basename(file.originalname, ext);

      cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
        resource_type: "auto",
        folder: "user_profiles",
        public_id: `${Date.now()}-${baseName}`,
        use_filename: true,
        unique_filename: false,
        format: "pdf",
      });
    }

    const parseArrayField = (value, fieldName) => {
      if (value === undefined) return undefined;
      if (Array.isArray(value)) return value;

      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [];
      } catch (error) {
        throw new Error(`${fieldName} must be a valid array`);
      }
    };

    let skillsArray;
    if (skills !== undefined) {
      skillsArray = skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }

    const educationArray = parseArrayField(education, "education")?.map(
      (item) => ({
        institution: item.institution || "",
        degree: item.degree || "",
        fieldOfStudy: item.fieldOfStudy || "",
        startYear: item.startYear || undefined,
        endYear: item.endYear || undefined,
        grade: item.grade || "",
      })
    );
    const workExperienceArray = parseArrayField(
      workExperience,
      "workExperience"
    )?.map((item) => ({
      company: item.company || "",
      role: item.role || "",
      description: item.description || "",
      startDate: item.startDate || undefined,
      endDate: item.isCurrentlyWorking ? undefined : item.endDate || undefined,
      isCurrentlyWorking: Boolean(item.isCurrentlyWorking),
    }));

    const userId = req.id;
    let user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    // update fields
    if (fullname !== undefined) user.fullname = fullname;
    if (email !== undefined) user.email = email;
    if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
    if (bio !== undefined) user.profile.bio = bio;
    if (location !== undefined) user.profile.location = location;
    if (skillsArray !== undefined) user.profile.skills = skillsArray;
    if (educationArray !== undefined) user.profile.education = educationArray;
    if (workExperienceArray !== undefined) {
      user.profile.workExperience = workExperienceArray;
    }

    if (cloudResponse) {
      // resource_type "auto" with format "pdf" stores under /image/ delivery
      // secure_url will have correct Content-Type: application/pdf
      user.profile.resume = cloudResponse.secure_url;
      user.profile.resumeDownload = cloudResponse.secure_url;
      user.profile.resumeName = file.originalname;
    }

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      user: {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        profile: user.profile,
      },
      success: true,
    });
  } catch (error) {
    console.error("Error while Updating:", error.message);
    return res.status(500).json({ message: "Server error", success: false });
  }
};
