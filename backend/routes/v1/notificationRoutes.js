const express = require("express");
const router = express.Router();

const authMiddleware = require("../../middleware/authMiddleware");
const Notification = require("../../models/Notification");

// GET user notifications
router.get("/", authMiddleware, async (req, res) => {
  try {
    const notifications = await Notification.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// MARK AS READ
router.put("/:id/read", authMiddleware, async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );

    res.json(notification);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE NOTIFICATION (ADMIN/WARD USE)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const notification = await Notification.create({
      user: req.body.user,
      title: req.body.title,
      message: req.body.message,
      type: req.body.type || "info",
    });

    res.status(201).json(notification);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;