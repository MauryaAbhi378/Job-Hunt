import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    description: {
      type: String,
      required: true
    },
    website: {
      type: String,
    },
    headquarters: {
      type: String,
    },
    logo: {
      type: String,
    },
    foundedYear: {
      type: Number,
    },
    companyType: {
      type: String,
      enum: ["Private", "Public", "Non-Profit", "Government", "Startup"],
      required: true
    },
    industry: {
      type: String,
      enum: ["Technology", "Finance", "Healthcare", "Education", "Retail", "Other"],
      required: true
    },
    companySize: {
      type: String,
      enum: ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"]
    },
    onboarding: {
      type: Boolean,
      default: false
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export const Company = mongoose.model("Company", companySchema);