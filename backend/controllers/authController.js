const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

function validateNepaliPhone(phone) {
  const cleaned = String(phone).replace(/[\s-]/g, "");
  return /^(?:98|97|96)\d{8}$/.test(cleaned) || /^(?:985|986)\d{7}$/.test(cleaned) || /^0[1-9]\d{7,8}$/.test(cleaned);
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phoneNumber, role } = req.body;

    // Validation
    const errors = {};

    if (!firstName || firstName.trim().length < 2) errors.firstName = "First name must be at least 2 characters";
    if (!lastName || lastName.trim().length < 2) errors.lastName = "Last name must be at least 2 characters";
    if (!email || !validateEmail(email)) errors.email = "Valid email is required";
    if (!password || password.length < 6) errors.password = "Password must be at least 6 characters";
    if (!phoneNumber || !validateNepaliPhone(phoneNumber)) errors.phoneNumber = "Valid Nepal phone number is required";

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { phoneNumber }],
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ success: false, errors: { email: "Email already registered" } });
      }
      return res.status(400).json({ success: false, errors: { phoneNumber: "Phone number already registered" } });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phoneNumber,
      role: role || "citizen",
    });

    // Generate token immediately for auto-login
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      token,
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, errors: { email: "Email and password are required" } });
    }

    const user = await User.findOne({ email });

    if (!user)
      return res.status(401).json({ success: false, message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);

    if (!match)
      return res.status(401).json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
