const router = require('express').Router();
const propertyController = require('../controllers/propertyController');
const { protect, restrictTo } = require('../controllers/authController');

router.get('/:id', propertyController.getProperty);
router.get('/', propertyController.getAllProperties);

router.get('/:id/getRequestListingProperty', propertyController.getRequestListingProperty);

// Protect all routes after this middleware
router.use(protect);

router.post('/:id/verifyProperty', restrictTo('admin'), propertyController.verifyProperty);
router.post('/:id/requestListingProperty', restrictTo('user'), propertyController.requestListingProperty);
router.post('/:id/listProperty', restrictTo('admin'), propertyController.listProperty);

router.post('/', propertyController.assignAccountId, propertyController.createProperty);
router.patch('/:id', propertyController.updateProperty);

module.exports = router;
