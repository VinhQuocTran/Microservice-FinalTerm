const express = require('express');
const tokenController = require('../controllers/tokenOfferController');

const router = express.Router();

// Define your routes here
router.get('/', tokenController.getAllActiveTokenOffers);
router.post('/', tokenController.createTokenOffer);
router.get('/cancel/:offer_id', tokenController.cancelOffer);
router.get('/:account_id', tokenController.getTokenOffersByAccountId);
module.exports = router;