const express = require("express");
const router = express.Router();

const {
  getUsers,
  getUser,
  createUser,
  deleteUser,
} = require("../../controllers/userController");

const authMiddleware = require("../../middleware/authMiddleware");
const roleMiddleware = require("../../middleware/roleMiddleware");
const User = require("../../models/User");

router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  getUsers
);

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  createUser
);

router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/profile", authMiddleware, async (req, res) => {
  try {
    const allowedFields = [
      "firstName", "lastName", "middleName", "phoneNumber",
      "gender", "dateOfBirth", "province", "district",
      "municipality", "wardNo", "locality",
      "permanentAddress", "temporaryAddress",
    ];

    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

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
