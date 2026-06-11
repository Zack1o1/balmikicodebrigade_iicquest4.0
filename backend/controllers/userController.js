const User = require("../models/User");

// Get all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get user by id
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password");

    if (!user)
      return res.status(404).json({
        message: "User not found",
      });

    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);

    res.json({
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};