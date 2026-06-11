const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    applicationId: {
      type: String,
      unique: true,
      required: true,
    },

    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    service: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "PENDING",
        "APPROVED",
        "REJECTED",
        "DOCUMENT_REQUESTED",
        "UNDER_REVIEW",
      ],
      default: "PENDING",
    },

    assignedWard: {
      type: Number,
    },

    assignedOfficer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    remarks: {
      type: String,
    },

    expectedCompletionDate: {
      type: Date,
    },

    documents: [
      {
        name: String,
        fileUrl: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
        verified: {
          type: Boolean,
          default: false,
        },
      },
    ],

    requestedDocuments: [
      {
        name: {
          type: String,
          required: true,
        },
        remarks: String,
        requestedAt: {
          type: Date,
          default: Date.now,
        },
        fileUrl: String,
        uploadedAt: Date,
        status: {
          type: String,
          enum: ["PENDING", "UPLOADED"],
          default: "PENDING",
        },
      },
    ],

    additionalDocuments: [
      {
        name: String,
        fileUrl: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    timeline: [
      {
        status: {
          type: String,
        },

        note: {
          type: String,
        },

        updatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },

        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Application", applicationSchema);
