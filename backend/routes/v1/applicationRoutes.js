const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/authMiddleware");
const roleMiddleware = require("../../middleware/roleMiddleware");

const {
  createApplication,
  getMyApplications,
  getAllApplications,
  getApplication,
  trackApplication,
  updateStatus,
} = require("../../controllers/applicationController");

router.post("/", authMiddleware, createApplication);
router.get("/my", authMiddleware, getMyApplications);
router.get("/all", authMiddleware, roleMiddleware("admin", "ward"), getAllApplications);
router.get("/track/:applicationId", trackApplication);
router.get("/:id", authMiddleware, getApplication);
router.put("/:id/status", authMiddleware, updateStatus);

module.exports = router;
