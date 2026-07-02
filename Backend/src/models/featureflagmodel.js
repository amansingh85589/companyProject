const mongoose = require('mongoose');

// ---------------------------------------------
// FEATURE FLAG MODEL
// Scoped to a single organization via orgId. Managed exclusively by
// OrgAdmin (create/update/delete); read by EndUser via checkFlag.
// ---------------------------------------------
const featureFlagSchema = new mongoose.Schema(
  {
    orgId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: true
    },
    featureKey: {
      type: String,
      required: true,
      trim: true
    },
    enabled: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

// A given org can't have two flags with the same key, but two different
// orgs can each have their own "dark_mode" flag independently — this is
// the compound index that makes multi-tenancy actually work at the DB level.
featureFlagSchema.index({ orgId: 1, featureKey: 1 }, { unique: true });

module.exports = mongoose.model('FeatureFlag', featureFlagSchema);