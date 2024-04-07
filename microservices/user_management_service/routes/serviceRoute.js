const router = require('express').Router();
const serviceController = require('../controllers/serviceController');
const { protect, restrictTo } = require('../controllers/authController');

router.get('/:id', serviceController.getService);
router.get('/', serviceController.getAllServices);

// Protect all routes after this middleware
router.use(protect);
router.use(restrictTo('admin'));

router.post('/', serviceController.createService);
router.patch('/:id', serviceController.updateService);

module.exports = router;
