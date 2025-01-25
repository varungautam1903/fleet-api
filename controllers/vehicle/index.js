const router = require('express').Router();
const controller = require('./vehicle.controller');
const adminController = require('./vehicle.admin.controller');
const auth = require('../../components/middleware/authMiddleware');

router.get('/admin/', auth.protect, auth.admin, adminController.index);
router.post('/admin/', auth.protect, auth.admin, adminController.create);
router.get('/admin/:id', auth.protect, auth.admin, adminController.show);
router.put('/admin/:id', auth.protect, auth.admin, adminController.update);
router.patch('/admin/:id', auth.protect, auth.admin, adminController.update);

router.get("/", auth.protect, controller.index);

module.exports = router;
