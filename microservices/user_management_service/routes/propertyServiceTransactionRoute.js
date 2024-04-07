const router = require('express').Router();
const propertyServiceTransactionController = require('../controllers/propertyServiceTransactionController');
const { protect, restrictTo } = require('../controllers/authController');

router.get('/:id', propertyServiceTransactionController.getPropertyServiceTransaction);
router.get('/', propertyServiceTransactionController.getAllPropertyServiceTransactions);

// // Protect all routes after this middleware
router.use(protect);

router.post('/', propertyServiceTransactionController.createPropertyServiceTransaction);
router.patch('/:id', propertyServiceTransactionController.updatePropertyServiceTransaction);

module.exports = router;
