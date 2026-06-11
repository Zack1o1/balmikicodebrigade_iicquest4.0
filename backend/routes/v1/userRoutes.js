const express = require("express");
const router = express.Router();

const {
  getUsers,
  getUser,
  deleteUser,
} = require("../../controllers/userController");

const authMiddleware = require("../../middleware/authMiddleware");
const roleMiddleware = require("../../middleware/roleMiddleware");

// Admin only
router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  getUsers
);

router.get(
  "/:id",
  authMiddleware,
  getUser
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  deleteUser
);

module.exports = router;