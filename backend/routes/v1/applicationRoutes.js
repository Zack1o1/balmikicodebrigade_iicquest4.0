const express = require("express");
const router = express.Router();

const {
  createApplication,
  getMyApplications,
  getApplication,
  updateStatus,
} = require("../../controllers/applicationController");

const authMiddleware = require("../../middleware/authMiddleware");
const roleMiddleware = require("../../middleware/roleMiddleware");

// Citizen
router.post(
  "/",
  authMiddleware,
  createApplication
);

router.get(
  "/my",
  authMiddleware,
  getMyApplications
);

router.get(
  "/:id",
  authMiddleware,
  getApplication
);

// Ward + Admin
router.put(
  "/:id/status",
  authMiddleware,
  roleMiddleware("ward", "admin"),
  updateStatus
);

module.exports = router;