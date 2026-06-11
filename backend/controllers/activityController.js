const Activity = require("../models/Activity");

exports.getMyActivities = async (req, res) => {
  try {
    const activities = await Activity.find({ user: req.user._id })
      .populate("application", "applicationId status service")
      .sort({ createdAt: -1 })
      .limit(20);

    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllActivities = async (req, res) => {
  try {
    const { userId } = req.query;
    const filter = userId ? { user: userId } : {};
    const activities = await Activity.find(filter)
      .populate("user", "firstName lastName email")
      .populate("application", "applicationId status service")
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.logActivity = async (req, res) => {
  try {
    const { user, application, activityType, description, metadata } = req.body;

    const activity = await Activity.create({
      user: user || req.user._id,
      application,
      activityType,
      description,
      metadata,
    });

    res.status(201).json(activity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
