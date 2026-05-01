import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: Number,
    },
    role: {
      type: String,
      enums: ["Student", "Recruiter"],
      required: true,
    },
    profile: {
      bio: { type: String },
      skills: [{ type: String }],
      resume: { type: String },
      resumeName: { type: String },
      company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
      profilePhoto: {
        type: String,
        default: "",
      },
      portfolioUrl: { type: String },
      location : { type: String },
      education: [
        {
          institution: { type: String }, // e.g. "MIT"
          degree: { type: String }, // e.g. "B.Tech"
          fieldOfStudy: { type: String }, // e.g. "Computer Science"
          startYear: { type: Number },
          endYear: { type: Number }, // leave null if currently studying
          grade: { type: String }, // CGPA or percentage, optional
        },
      ],

      workExperience: [
        {
          company: { type: String }, // e.g. "Google"
          role: { type: String }, // e.g. "Frontend Intern"
          description: { type: String }, // what they worked on
          startDate: { type: Date },
          endDate: { type: Date }, // leave null if currently working
          isCurrentlyWorking: { type: Boolean, default: false },
        },
      ],
    },
  },
  { timestamps: true },
);

export const User = mongoose.model("User", userSchema);
