const Application = require("../models/Application");

function generateApplicationId() {
  const year = new Date().getFullYear();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `APP-${year}-${rand}`;
}

exports.createApplication = async (req, res) => {
  try {
    const applicationId = generateApplicationId();
    const application = await Application.create({
      ...req.body,
      applicationId,
      applicant: req.user._id,
      status: "PENDING",
      timeline: [{ status: "PENDING", note: "Application submitted", timestamp: new Date() }],
    });

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user._id })
      .sort("-createdAt");

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("applicant")
      .sort("-createdAt");

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate("applicant")
      .populate("service");

    if (!application)
      return res.status(404).json({ message: "Application not found" });

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.trackApplication = async (req, res) => {
  try {
    const application = await Application.findOne({
      applicationId: req.params.applicationId,
    }).populate("service");

    if (!application)
      return res.status(404).json({ message: "Application not found" });

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status, note } = req.body;
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      {
        status,
        $push: {
          timeline: {
            status,
            note: note || `Status changed to ${status}`,
            updatedBy: req.user._id,
            timestamp: new Date(),
          },
        },
      },
      { new: true }
    );

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.approveApplication = async (req, res) => {
  try {
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      {
        status: "APPROVED",
        $push: {
          timeline: {
            status: "APPROVED",
            note: req.body.note || "Application approved",
            updatedBy: req.user._id,
            timestamp: new Date(),
          },
        },
      },
      { new: true }
    );

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.rejectApplication = async (req, res) => {
  try {
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      {
        status: "REJECTED",
        $push: {
          timeline: {
            status: "REJECTED",
            note: req.body.note || "Application rejected",
            updatedBy: req.user._id,
            timestamp: new Date(),
          },
        },
      },
      { new: true }
    );

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.requestDocuments = async (req, res) => {
  try {
    const { missingDocs, note } = req.body;
    const update = {
      status: "DOCUMENT_REQUESTED",
      $push: {
        timeline: {
          status: "DOCUMENT_REQUESTED",
          note: note || `Additional documents requested: ${(missingDocs || []).join(", ")}`,
          updatedBy: req.user._id,
          timestamp: new Date(),
        },
      },
    };

    const application = await Application.findByIdAndUpdate(req.params.id, update, { new: true });

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
