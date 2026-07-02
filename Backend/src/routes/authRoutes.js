const router = require('express').Router();
const authController = require('../controllers/authController');


router.post('/superadmin/login', authController.superAdminLogin);


router.post('/admin/signup', authController.orgAdminSignup);


router.post('/user/signup', authController.endUserSignup);


router.post('/login', authController.login);

module.exports = router;
