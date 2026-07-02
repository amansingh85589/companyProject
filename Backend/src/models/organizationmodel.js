const mongoose = require('mongoose');

// ---------------------------------------------
// ORGANIZATION MODEL
// Created only by Super Admin. Every User and FeatureFlag references
// an Organization via orgId — this is the root of the tenant hierarchy.
// ---------------------------------------------
const organizationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Organization', organizationSchema);