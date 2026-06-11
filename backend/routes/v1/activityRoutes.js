const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/authMiddleware");
const roleMiddleware = require("../../middleware/roleMiddleware");
const {
  getMyActivities,
  getAllActivities,
  logActivity,
} = require("../../controllers/activityController");

router.get("/my", authMiddleware, getMyActivities);
router.get("/all", authMiddleware, roleMiddleware("admin", "ward"), getAllActivities);
router.post("/", authMiddleware, logActivity);

module.exports = router;
