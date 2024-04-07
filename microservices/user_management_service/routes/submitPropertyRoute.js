const router = require('express').Router();
const submitPropertyController = require('../controllers/submitPropertyController');
const { protect, restrictTo } = require('../controllers/authController');

router.get('/:id', submitPropertyController.getSubmitProperty);
router.get('/', submitPropertyController.getAllSubmitProperty);

// // Protect all routes after this middleware
router.use(protect);

router.post('/', submitPropertyController.createSubmitProperty);
router.patch('/:id', submitPropertyController.updateSubmitProperty);

module.exports = router;