const express = require('express');
const router = express.Router();
const authController = require('./../controllers/authController');

// Protect all routes after this middleware
router.use(authController.protect);

// Only admin have permission to access for the below APIs 
// router.use(authController.restrictTo('admin'));


module.exports = router;