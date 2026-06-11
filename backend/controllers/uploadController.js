const path = require("path");
const fs = require("fs");

const UPLOAD_DIR = path.join(__dirname, "..", "uploads");

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

exports.uploadFile = async (req, res) => {
  try {
    if (!req.files || !req.files.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const file = req.files.file;
    const allowedTypes = ["image/png", "image/jpg", "image/jpeg"];

    if (!allowedTypes.includes(file.mimetype)) {
      return res.status(400).json({ message: "Only PNG, JPG, JPEG files are allowed" });
    }

    if (file.size > 5 * 1024 * 1024) {
      return res.status(400).json({ message: "File size must be less than 5MB" });
    }

    // Generate unique filename
    const ext = path.extname(file.name);
    const filename = `doc_${Date.now()}_${Math.random().toString(36).slice(2, 8)}${ext}`;
    const filePath = path.join(UPLOAD_DIR, filename);

    await file.mv(filePath);

    const fileUrl = `/uploads/${filename}`;

    res.json({
      success: true,
      fileUrl,
      filename,
      originalName: file.name,
      size: file.size,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
