// Import TokenOffer model
const TokenOffer = require('../models/tokenOffer');
const TokenTransaction = require('../models/tokenTransaction');
// Create a new token offer
const createTokenOffer = async (req, res) => {
    try {
        const {account_id, token_id, quantity, at_price, is_buy } = req.body;
        // Validate request body
        if (!account_id || !quantity || !at_price || is_buy === undefined) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        // Create new token offer instance
        const newTokenOffer = await TokenOffer.create({
            id: account_id+"_OFFER_" + new Date().getTime(),
            account_id,
            token_id,
            quantity,
            at_price,
            is_buy,
            is_active:true,
            is_finished:false,
        });
        // Send success response
        res.status(201).json(newTokenOffer);
    } catch (error) {
        // Handle errors
        console.error('Error creating token offer:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
const cancelOffer = async (req, res) => {
    try {
        const { offer_id } = req.params;
        if (!offer_id) {
            return res.status(400).json({ error: 'Offer ID is required' });
        }
        const tokenOffer = await TokenOffer.findByPk(offer_id);

        if (!tokenOffer) {
            return res.status(404).json({ error: 'Token offer not found' });
        }
        await tokenOffer.update({
            is_active: false
        });

        res.status(200).json({ message: 'Token offer canceled successfully' });
    } catch (error) {
        // Handle errors
        console.error('Error canceling token offer:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


const getAllActiveTokenOffers = async (req, res) => {
    try {
        const activeTokenOffers = await TokenOffer.findAll({
            where: {
                is_active: true,
                is_finished: false
            }
        });

        res.json({
            data:activeTokenOffers
        });
    } catch (error) {
        // Handle errors
        console.error('Error fetching active token offers:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getTokenOffersByAccountId = async (req, res) => {
    try {
        const { account_id } = req.params;
        const tokenOffers = await TokenOffer.findAll({
            where: {
                account_id: account_id
            }
        });
        if (tokenOffers.length === 0) {
            return res.status(404).json({ error: 'Token offers not found for the provided account ID' });
        }
        res.json({
            data:tokenOffers
        });
    } catch (error) {
        // Handle errors
        console.error('Error fetching token offers by account ID:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
const createTokenTransactionForAuction = async (req, res) => {
    let buyOffers = await TokenOffer.findAll({
        where: {
            is_active: true,
            is_finished: false,
            is_buy: true
        }
    });

    let sellOffers = await TokenOffer.findAll({
        where: {
            is_active: true,
            is_finished: false,
            is_buy: false
        }
    });
    for (let buyOffer of buyOffers) {
        for (let sellOffer of sellOffers) {
            if (buyOffer.at_price >= sellOffer.at_price && buyOffer.quantity === sellOffer.quantity) {
                try{
                    await fetch(`http://127.0.0.1:3002/api/rental_income_wallet`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(
                            {
                            "seller_id": sellOffer.account_id,
                            "buyer_id": buyOffer.account_id,
                            "amount": sellOffer.at_price * sellOffer.quantity
                        }),
                    })
                    let transaction = {
                        id: sellOffer.id + "_"+buyOffer.id+"_OFFER_TRANS_"+new Date().getTime(),
                        seller_token_offer_id: sellOffer.id,
                        buyer_token_offer_id: buyOffer.id,
                        created_at: new Date()
                    };
                    await TokenTransaction.create(transaction);
                    sellOffer.is_finished = true;
                    sellOffer.is_active = false;
                    buyOffer.is_finished = true;
                    buyOffer.is_active = false;
                    await sellOffer.save();
                    await buyOffer.save();
                }catch (error) {
                    console.log(error)
                }
                
            }
        }
    }
    console.log('Auction process executed successfully.');
};


module.exports = {
    createTokenOffer,
    getAllActiveTokenOffers,
    getTokenOffersByAccountId,
    cancelOffer,
    createTokenTransactionForAuction
};
