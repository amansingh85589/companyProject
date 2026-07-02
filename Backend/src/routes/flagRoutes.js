const router = require('express').Router();
const flagController = require('../controllers/flagController');
const authMiddleware = require('../middleware/authMiddleware.js');
const roleMiddleware = require('../middleware/roleMiddleware.js');
const orgScopeMiddleware = require('../middleware/orgScopeMiddleware.js');

// ---------------------------------------------
// FEATURE FLAG ROUTES
// Mounted at /api/flags in index.js.
//
// Middleware order is deliberate and required:
// authMiddleware (sets req.user) -> roleMiddleware (checks req.user.role)
// -> orgScopeMiddleware (checks req.user.orgId against the flag, sets req.flag)
// ---------------------------------------------

// OrgAdmin — create & list flags for their own org (scoped inside controller
// via req.user.orgId, no orgScopeMiddleware needed since there's no :id yet)
router.post('/', authMiddleware, roleMiddleware('OrgAdmin'), flagController.createFlag);
router.get('/', authMiddleware, roleMiddleware('OrgAdmin'), flagController.getMyFlags);

// OrgAdmin — update & delete a specific flag, guarded by orgScopeMiddleware
router.put(
  '/:id',
  authMiddleware,
  roleMiddleware('OrgAdmin'),
  orgScopeMiddleware,
  flagController.updateFlag
);
router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware('OrgAdmin'),
  orgScopeMiddleware,
  flagController.deleteFlag
);

// EndUser — check whether a feature is enabled for their org
router.post('/check', authMiddleware, roleMiddleware('EndUser'), flagController.checkFlag);

module.exports = router;
