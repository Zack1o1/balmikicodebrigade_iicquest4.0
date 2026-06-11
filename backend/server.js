require("dotenv").config({
  path: require("path").join(__dirname, ".env"),
});

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 5000;

// =======================
// IMPORT ROUTES
// =======================
const authRoutes = require("./routes/v1/authRoutes");
const userRoutes = require("./routes/v1/userRoutes");
const serviceRoutes = require("./routes/v1/serviceRoutes");
const applicationRoutes = require("./routes/v1/applicationRoutes");
const dashboardRoutes = require("./routes/v1/dashboardRoutes");
const notificationRoutes = require("./routes/v1/notificationRoutes");
const aiRoutes = require("./routes/v1/aiRoutes");

// =======================
// MIDDLEWARE
// =======================
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

// =======================
// ROUTES
// =======================
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/services", serviceRoutes);
app.use("/api/v1/applications", applicationRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/ai", aiRoutes);

// =======================
// HEALTH CHECK
// =======================
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

// =======================
// DATABASE + SERVER
// =======================
async function start() {
  try {
    const mongoURI =
      process.env.MONGO_URI ||
      "mongodb://localhost:27017/smartpalika";

    await mongoose.connect(mongoURI);

    console.log("Connected to MongoDB");

    // Create default admin if not exists
    const User = require("./models/User");
    const bcrypt = require("bcryptjs");
    const adminExists = await User.findOne({ role: "admin" });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      await User.create({
        firstName: "System",
        lastName: "Admin",
        email: "admin@smartpalika.com",
        password: hashedPassword,
        phoneNumber: "9800000000",
        role: "admin",
      });
      console.log("Default admin created: admin@smartpalika.com / admin123");
    }

    app.listen(PORT, () => {
      console.log(
        `Server running on http://localhost:${PORT}`
      );
    });
  } catch (err) {
    console.error("MongoDB error:", err.message);
    process.exit(1);
  }
}
start();