// ---------------------------------------------
// ROLE MIDDLEWARE
// Factory function — pass one or more allowed roles when wiring routes,
// e.g. roleMiddleware('OrgAdmin') or roleMiddleware('OrgAdmin', 'EndUser').
// Must run AFTER authMiddleware, since it depends on req.user being set.
// ---------------------------------------------
const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied: insufficient role' });
    }

    next();
  };
};

module.exports = roleMiddleware;
