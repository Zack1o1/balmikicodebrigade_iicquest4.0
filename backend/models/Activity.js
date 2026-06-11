const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
    },

    activityType: {
      type: String,
      required: true,
      enum: [
        "APPLICATION_SUBMITTED",
        "DOCUMENTS_UPLOADED",
        "REQUESTED_DOCUMENTS_UPLOADED",
        "PAYMENT_COMPLETED",
        "APPLICATION_APPROVED",
        "APPLICATION_REJECTED",
        "STAFF_REQUESTED_DOCUMENTS",
        "APPLICATION_REVIEWED",
        "DOCUMENTS_REQUESTED",
        "APPLICATION_FORWARDED",
        "STAFF_CREATED",
        "APPLICATION_STATUS_UPDATED",
      ],
    },

    description: {
      type: String,
      required: true,
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

activitySchema.index({ user: 1, createdAt: -1 });
activitySchema.index({ application: 1 });

module.exports = mongoose.model("Activity", activitySchema);
