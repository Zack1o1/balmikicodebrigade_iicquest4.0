const express = require("express");
const router = express.Router();

const {
  getServices,
  getService,
  createService,
  updateService,
  deleteService,
} = require("../../controllers/serviceController");

const authMiddleware = require("../../middleware/authMiddleware");
const roleMiddleware = require("../../middleware/roleMiddleware");

// Public
router.get("/", getServices);

router.get("/:id", getService);

// Admin only
router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  createService
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  updateService
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  deleteService
);

module.exports = router;