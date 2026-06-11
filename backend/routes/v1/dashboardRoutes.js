const express = require("express");
const router = express.Router();

const authMiddleware = require("../../middleware/authMiddleware");
const roleMiddleware = require("../../middleware/roleMiddleware");

const Application = require("../../models/Application");
const User = require("../../models/User");
const Service = require("../../models/Service");

router.get(
  "/citizen",
  authMiddleware,
  async (req, res) => {
    try {
      const userId = req.user._id;

      const total = await Application.countDocuments({
        applicant: userId,
      });

      const approved = await Application.countDocuments({
        applicant: userId,
        status: "approved",
      });

      const pending = await Application.countDocuments({
        applicant: userId,
        status: {
          $in: ["submitted", "received", "under_review"],
        },
      });

      const recent = await Application.find({
        applicant: userId,
      })
        .populate("service")
        .sort({ createdAt: -1 })
        .limit(5);

      res.json({
        totalApplications: total,
        approvedApplications: approved,
        pendingApplications: pending,
        recentApplications: recent,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

router.get(
  "/ward",
  authMiddleware,
  roleMiddleware("ward"),
  async (req, res) => {
    try {
      const wardNo = req.user.assignedWard;

      const filter = wardNo ? { assignedWard: wardNo } : {};

      const totalApplications = await Application.countDocuments(filter);
      const approvedApplications = await Application.countDocuments({ ...filter, status: "approved" });
      const pendingApplications = await Application.countDocuments({
        ...filter,
        status: { $in: ["submitted", "received", "under_review"] }
      });
      const totalStaff = await User.countDocuments({ role: "ward", assignedWard: wardNo });

      res.json({
        totalApplications,
        approvedApplications,
        pendingApplications,
        totalStaff
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

router.get(
  "/admin",
  authMiddleware,
  roleMiddleware("admin"),
  async (req, res) => {
    try {
      const totalApplications = await Application.countDocuments();
      const approvedApplications = await Application.countDocuments({ status: "approved" });
      const pendingApplications = await Application.countDocuments({
        status: { $in: ["submitted", "received", "under_review"] }
      });

      const totalWards = 32;
      const totalStaff = await User.countDocuments({ role: "ward" });

      res.json({
        totalApplications,
        approvedApplications,
        pendingApplications,
        totalWards,
        totalStaff
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

module.exports = router;
