const router = require('express').Router();
const adminController = require('./history.admin.controller');
const controller = require('./history.controller');
const auth = require('../../components/middleware/authMiddleware')

router.get('/admin/', auth.protect, auth.admin, adminController.index);
router.post('/admin/', auth.protect, auth.admin, adminController.create);
router.get('/admin/:id', auth.protect, auth.admin, adminController.show);
router.put('/admin/:id', auth.protect, auth.admin, adminController.update);
router.patch('/admin/:id', auth.protect, auth.admin, adminController.update);

router.get('/getall', auth.protect, controller.index);

module.exports = router;
