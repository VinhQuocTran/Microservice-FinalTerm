const router = require('express').Router();
const listingPropertyController = require('../controllers/listingPropertyController');
const { protect, restrictTo } = require('../controllers/authController');

router.get('/:id', listingPropertyController.getListingProperty);
router.get('/', listingPropertyController.getAllListingProperties);

// Protect all routes after this middleware
router.use(protect);

router.post('/', listingPropertyController.createListingProperty);
router.patch('/:id', listingPropertyController.updateListingProperty);

module.exports = router;
