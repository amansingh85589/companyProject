const FeatureFlag = require('../models/featureFlagModel');

// ---------------------------------------------
// CREATE FEATURE FLAG
// OrgAdmin only — flag is scoped to req.user.orgId, never trusted from body
// ---------------------------------------------
exports.createFlag = async (req, res) => {
  try {
    const { featureKey, enabled } = req.body;

    if (!featureKey) {
      return res.status(400).json({ message: 'featureKey is required' });
    }

    const existingFlag = await FeatureFlag.findOne({
      orgId: req.user.orgId,
      featureKey
    });

    if (existingFlag) {
      return res.status(409).json({ message: 'Feature flag already exists for this organization' });
    }

    const flag = await FeatureFlag.create({
      orgId: req.user.orgId,
      featureKey,
      enabled: enabled ?? false
    });

    res.status(201).json({
      message: 'Feature flag created successfully',
      flag
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ---------------------------------------------
// GET ALL FLAGS FOR THE LOGGED-IN ORG ADMIN'S ORGANIZATION
// ---------------------------------------------
exports.getMyFlags = async (req, res) => {
  try {
    const flags = await FeatureFlag.find({ orgId: req.user.orgId }).sort({ featureKey: 1 });
    res.status(200).json({ flags });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ---------------------------------------------
// UPDATE (ENABLE/DISABLE) A FEATURE FLAG
// OrgAdmin only — req.flag is attached by orgScopeMiddleware after confirming
// the flag belongs to req.user.orgId
// ---------------------------------------------
exports.updateFlag = async (req, res) => {
  try {
    const { enabled, featureKey } = req.body;

    if (typeof enabled === 'boolean') {
      req.flag.enabled = enabled;
    }
    if (featureKey) {
      req.flag.featureKey = featureKey;
    }

    await req.flag.save();

    res.status(200).json({
      message: 'Feature flag updated successfully',
      flag: req.flag
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ---------------------------------------------
// DELETE A FEATURE FLAG
// OrgAdmin only — req.flag already verified as belonging to this org
// ---------------------------------------------
exports.deleteFlag = async (req, res) => {
  try {
    await req.flag.deleteOne();
    res.status(200).json({ message: 'Feature flag deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ---------------------------------------------
// CHECK FLAG STATUS
// EndUser only — scoped to req.user.orgId, returns enabled: false if flag
// doesn't exist rather than throwing, since "flag not set" is a valid state
// ---------------------------------------------
exports.checkFlag = async (req, res) => {
  try {
    const { featureKey } = req.body;

    if (!featureKey) {
      return res.status(400).json({ message: 'featureKey is required' });
    }

    const flag = await FeatureFlag.findOne({
      orgId: req.user.orgId,
      featureKey
    });

    res.status(200).json({
      featureKey,
      enabled: flag ? flag.enabled : false
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
