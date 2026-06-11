const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
{
  // Authentication
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },

  password: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    enum: ["citizen", "ward", "admin"],
    default: "citizen",
  },

  // Personal Information
  firstName: {
    type: String,
    required: true,
  },

  middleName: String,

  lastName: {
    type: String,
    required: true,
  },

  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
  },

  dateOfBirth: Date,

  phoneNumber: {
    type: String,
    required: true,
    unique: true,
  },

  // Citizen Information
  citizenshipNumber: {
    type: String,
    unique: true,
    sparse: true,
  },

  fatherName: String,

  motherName: String,

  grandfatherName: String,

  spouseName: String,

  // Address
  province: String,

  district: String,

  municipality: String,

  wardNo: Number,

  locality: String,

  permanentAddress: String,

  temporaryAddress: String,

  // Documents
  profileImage: String,

  citizenshipFront: String,

  citizenshipBack: String,

  signatureImage: String,

  // Ward/Admin Information
  employeeId: String,

  designation: String,

  assignedWard: Number,

  // Account Status
  status: {
    type: String,
    enum: ["active", "inactive", "blocked"],
    default: "active",
  },

  isEmailVerified: {
    type: Boolean,
    default: false,
  },

  isPhoneVerified: {
    type: Boolean,
    default: false,
  },

  lastLogin: Date,
},
{
  timestamps: true,
});

module.exports = mongoose.model("User", userSchema);