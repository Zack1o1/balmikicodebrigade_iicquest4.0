const Application = require("../models/Application");

// Create application
exports.createApplication = async (req, res) => {
  try {
    const application = await Application.create({
      ...req.body,
      applicant: req.user.id,
    });

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// My applications
exports.getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({
      applicant: req.user.id,
    })
      .populate("service")
      .sort("-createdAt");

    res.json(applications);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get all applications (for staff/admin)
exports.getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("applicant")
      .populate("service")
      .sort("-createdAt");
    
    res.json(applications);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Application details
exports.getApplication = async (req, res) => {
  try {
    const application = await Application.findById(
      req.params.id
    )
      .populate("applicant")
      .populate("service");

    if (!application)
      return res.status(404).json({
        message: "Application not found",
      });

    res.json(application);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Track application publicly
exports.trackApplication = async (req, res) => {
  try {
    const application = await Application.findOne({
      applicationId: req.params.applicationId
    }).populate("service");

    if (!application)
      return res.status(404).json({
        message: "Application not found",
      });

    res.json(application);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update status
exports.updateStatus = async (req, res) => {
  try {
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      {
        status: req.body.status,
      },
      {
        new: true,
      }
    );

    res.json(application);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};