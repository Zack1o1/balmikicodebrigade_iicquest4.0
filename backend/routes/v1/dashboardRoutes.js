const express = require("express");
const router = express.Router();

const authMiddleware = require("../../middleware/authMiddleware");
const roleMiddleware = require("../../middleware/roleMiddleware");

const Application = require("../../models/Application");
const User = require("../../models/User");
const Service = require("../../models/Service");

/*
========================================
CITIZEN DASHBOARD
========================================
*/
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
module.exports = router;