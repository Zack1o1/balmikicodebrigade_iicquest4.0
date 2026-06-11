const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    nameNep: {
      type: String,
      trim: true,
    },

    category: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    fee: {
      type: Number,
      default: 0,
    },

    estimatedDays: {
      type: Number,
      required: true,
    },

    requiredDocuments: [
      {
        name: {
          type: String,
          required: true,
        },
        required: {
          type: Boolean,
          default: true,
        },
      },
    ],

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Service", serviceSchema);