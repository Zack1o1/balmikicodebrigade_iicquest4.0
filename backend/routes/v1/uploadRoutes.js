const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/authMiddleware");
const { uploadFile } = require("../../controllers/uploadController");

// File upload middleware
const fileUpload = require("express-fileupload");

router.post("/", authMiddleware, fileUpload(), uploadFile);

module.exports = router;
