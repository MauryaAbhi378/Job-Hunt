import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    category : {
      type : String,
      required : true
    },
    description: {
      type: String,
      required: true,
    },
    requirements: [
      {
        type: String,
      },
    ],
    salary: {
      min: { type: Number, required: true },
      max: { type: Number, required: true },
    },
    experienceLevel: {
      min: { type: Number, required: true },
      max: { type: Number, required: true },
    },
    location: {
      type: String,
      required: true,
    },
    jobType: {
      type: [String],
      required: true,
    },
    position: {
      type: Number,
      required: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    applications: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Application",
      },
    ],
  },
  { timestamps: true }
);

jobSchema.methods.getExperienceLevel = function () {
  if (this.experienceLevel.min === 0 && this.experienceLevel.max === 0) {
    return "Fresher";
  }
  return `${this.experienceLevel.min} - ${this.experienceLevel.max}`;
};

jobSchema.methods.getSalary = function () {
  return `₹${this.salary.min / 1000}K - ₹${this.salary.max / 1000}K`;
};

export const Job = mongoose.model("Job", jobSchema);
