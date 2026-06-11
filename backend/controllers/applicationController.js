const Application = require("../models/Application");
const Notification = require("../models/Notification");
const Activity = require("../models/Activity");

function generateApplicationId() {
  const year = new Date().getFullYear();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `APP-${year}-${rand}`;
}

async function logActivity(userId, activityType, description, applicationId, metadata) {
  try {
    await Activity.create({
      user: userId,
      application: applicationId,
      activityType,
      description,
      metadata,
    });
  } catch (err) {
    console.error("Failed to log activity:", err.message);
  }
}

async function createNotification(userId, title, message, type, link) {
  try {
    await Notification.create({
      user: userId,
      title,
      message,
      type: type || "info",
      link: link || null,
    });
  } catch (err) {
    console.error("Failed to create notification:", err.message);
  }
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
      assignedWard: req.body.ward ? parseInt(req.body.ward.replace(/\D/g, "")) || 1 : 1,
    });

    // Log activity
    await logActivity(
      req.user._id,
      "APPLICATION_SUBMITTED",
      `Application ${applicationId} submitted for service`,
      application._id
    );

    // Notify admins/staff about new application
    const User = require("../models/User");
    const staffUsers = await User.find({ role: { $in: ["ward", "admin"] } });
    for (const staff of staffUsers) {
      await createNotification(
        staff._id,
        "New Application",
        `New application ${applicationId} has been submitted and is pending review.`,
        "info",
        `/staff`
      );
    }

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

    if (application) {
      await logActivity(
        req.user._id,
        "APPLICATION_STATUS_UPDATED",
        `Application ${application.applicationId} status updated to ${status}`,
        application._id
      );

      // Notify applicant
      await createNotification(
        application.applicant,
        "Application Status Updated",
        `Your application ${application.applicationId} status has been updated to ${status}.`,
        "info"
      );
    }

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

    if (application) {
      await logActivity(
        req.user._id,
        "APPLICATION_APPROVED",
        `Application ${application.applicationId} has been approved`,
        application._id
      );

      await createNotification(
        application.applicant,
        "Application Approved",
        `Congratulations! Your application ${application.applicationId} has been approved.`,
        "success"
      );
    }

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

    if (application) {
      await logActivity(
        req.user._id,
        "APPLICATION_REJECTED",
        `Application ${application.applicationId} has been rejected`,
        application._id
      );

      await createNotification(
        application.applicant,
        "Application Rejected",
        `Your application ${application.applicationId} has been rejected. ${req.body.note ? "Reason: " + req.body.note : ""}`,
        "danger"
      );
    }

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.requestDocuments = async (req, res) => {
  try {
    const { missingDocs, note } = req.body;

    if (!missingDocs || missingDocs.length === 0) {
      return res.status(400).json({ message: "At least one document must be specified" });
    }

    // Create requested documents entries
    const requestedDocs = missingDocs.map((doc) => ({
      name: doc,
      remarks: note || "",
      requestedAt: new Date(),
      status: "PENDING",
    }));

    const application = await Application.findByIdAndUpdate(
      req.params.id,
      {
        status: "DOCUMENT_REQUESTED",
        $push: {
          timeline: {
            status: "DOCUMENT_REQUESTED",
            note: note || `Additional documents requested: ${missingDocs.join(", ")}`,
            updatedBy: req.user._id,
            timestamp: new Date(),
          },
          requestedDocuments: { $each: requestedDocs },
        },
      },
      { new: true }
    );

    if (application) {
      await logActivity(
        req.user._id,
        "STAFF_REQUESTED_DOCUMENTS",
        `Additional documents requested for application ${application.applicationId}: ${missingDocs.join(", ")}`,
        application._id,
        { requestedDocs: missingDocs }
      );

      // Notify applicant immediately
      await createNotification(
        application.applicant,
        "Additional Documents Requested",
        `Additional documents have been requested for Application ${application.applicationId}. Required: ${missingDocs.join(", ")}`,
        "warning",
        "/dashboard"
      );
    }

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.uploadRequestedDocuments = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Verify the applicant owns this application
    if (application.applicant.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { documentName, fileUrl } = req.body;

    if (!documentName || !fileUrl) {
      return res.status(400).json({ message: "documentName and fileUrl are required" });
    }

    // Update the specific requested document
    const requestedDoc = application.requestedDocuments.find(
      (doc) => doc.name === documentName && doc.status === "PENDING"
    );

    if (!requestedDoc) {
      return res.status(404).json({ message: "Requested document not found or already uploaded" });
    }

    requestedDoc.fileUrl = fileUrl;
    requestedDoc.uploadedAt = new Date();
    requestedDoc.status = "UPLOADED";

    // Also add to additional documents
    application.additionalDocuments.push({
      name: documentName,
      fileUrl,
      uploadedAt: new Date(),
    });

    // Check if all requested documents are uploaded
    const allUploaded = application.requestedDocuments.every(
      (doc) => doc.status === "UPLOADED"
    );

    if (allUploaded) {
      application.status = "UNDER_REVIEW";
      application.timeline.push({
        status: "UNDER_REVIEW",
        note: "All requested documents uploaded, application is back under review",
        timestamp: new Date(),
      });
    } else {
      application.timeline.push({
        status: "DOCUMENT_REQUESTED",
        note: `Document "${documentName}" uploaded`,
        timestamp: new Date(),
      });
    }

    await application.save();

    // Log activity
    await logActivity(
      req.user._id,
      "REQUESTED_DOCUMENTS_UPLOADED",
      `Document "${documentName}" uploaded for application ${application.applicationId}`,
      application._id
    );

    // Notify staff about uploaded documents
    const User = require("../models/User");
    const staffUsers = await User.find({ role: { $in: ["ward", "admin"] } });
    for (const staff of staffUsers) {
      await createNotification(
        staff._id,
        "Documents Uploaded",
        `Customer has uploaded documents for application ${application.applicationId}.`,
        "info"
      );
    }

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.uploadAdditionalDocuments = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (application.applicant.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { documents } = req.body;

    if (!documents || !Array.isArray(documents) || documents.length === 0) {
      return res.status(400).json({ message: "Documents array is required" });
    }

    for (const doc of documents) {
      application.additionalDocuments.push({
        name: doc.name,
        fileUrl: doc.fileUrl,
        uploadedAt: new Date(),
      });
    }

    application.timeline.push({
      status: application.status,
      note: `${documents.length} additional document(s) uploaded`,
      timestamp: new Date(),
    });

    await application.save();

    await logActivity(
      req.user._id,
      "DOCUMENTS_UPLOADED",
      `${documents.length} document(s) uploaded for application ${application.applicationId}`,
      application._id
    );

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
