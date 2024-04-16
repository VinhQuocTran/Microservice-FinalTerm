const router = require('express').Router();
const propertyTokenOwnershipController = require('../controllers/propertyTokenOwnershipController');
const { protect, restrictTo } = require('../controllers/authController');

router.get('/:id', propertyTokenOwnershipController.getPropertyTokenOwnership);
router.get('/', propertyTokenOwnershipController.getAllPropertyTokenOwnerShips);

// // Protect all routes after this middleware
router.use(protect);

router.post('/', propertyTokenOwnershipController.createPropertyTokenOwnership);
router.patch('/:id', propertyTokenOwnershipController.updatePropertyTokenOwnership);

module.exports = router;
