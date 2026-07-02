const FeatureFlag = require('../models/featureFlagModel');

// ---------------------------------------------
// ORG SCOPE MIDDLEWARE
// The core multi-tenant guard. roleMiddleware only checks WHO you are
// (OrgAdmin), not WHICH flag you're allowed to touch. This middleware
// fetches the flag by req.params.id and confirms it belongs to the
// requesting user's orgId before letting the request through.
//
// Must run AFTER authMiddleware + roleMiddleware, since it depends on
// req.user.orgId being set.
//
// On success, attaches the fetched flag document to req.flag so the
// controller doesn't need to query for it again.
// ---------------------------------------------
const orgScopeMiddleware = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'Flag id is required' });
    }

    const flag = await FeatureFlag.findById(id);

    if (!flag) {
      return res.status(404).json({ message: 'Feature flag not found' });
    }

    if (flag.orgId.toString() !== req.user.orgId.toString()) {
      return res.status(403).json({ message: 'Access denied: this flag belongs to a different organization' });
    }

    req.flag = flag;
    next();
  } catch (error) {
    // Malformed ObjectId also lands here
    return res.status(400).json({ message: 'Invalid flag id', error: error.message });
  }
};

module.exports = orgScopeMiddleware;
