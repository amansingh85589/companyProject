const router = require('express').Router();
const orgController = require('../controllers/orgController');
const authMiddleware = require('../middleware/authMiddleware.js');
const roleMiddleware = require('../middleware/roleMiddleware.js');

// ---------------------------------------------
// ORGANIZATION ROUTES
// Mounted at /api/organizations in index.js.
// Create/list (full) are Super Admin only. The /public route is
// unauthenticated on purpose — Admin/User signup forms need to populate
// an org dropdown before the user has a token.
// ---------------------------------------------

// Public — no auth, used by signup forms
router.get('/public', orgController.listOrgsPublic);

// Protected — Super Admin only
router.post('/', authMiddleware, roleMiddleware('SuperAdmin'), orgController.createOrg);
router.get('/', authMiddleware, roleMiddleware('SuperAdmin'), orgController.listOrgs);

module.exports = router;
