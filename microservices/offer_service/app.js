const express = require('express');
const cors = require('cors');
const cron = require('node-cron');

const offerRoutes = require('./routes/tokenOfferRoutes');
const globalErrHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');
const app = express();
const sequelize = require('./database/connection');
const {createTokenTransactionForAuction} = require('./controllers/tokenOfferController');

// Allow Cross-Origin requests
app.use(cors());

// Body parser, reading data from body into req.body
app.use(express.json({
    limit: '15kb'
}));

// schedule the auction process to run every 3 minutes
// 
// */3 * * * * 3 minutes
// */5 * * * * * 5 seconds
cron.schedule('*/3 * * * *', async () => {
    try {
        await createTokenTransactionForAuction();
        console.log('Auction process executed successfully.');
    } catch (error) {
        console.error('Error executing auction process:', error);
    }
});

// Connect to the database
sequelize
    .authenticate()
    .then(() => {
        console.log('Database connection has been established successfully.');
    })
    .catch((err) => {
        console.error('Unable to connect to the database:', err);
    });

// Routes
app.use('/api/offers', offerRoutes);

// handle undefined Routes
app.use('*', (req, res, next) => {
    const err = new AppError(404, 'fail', 'undefined route');
    next(err, req, res, next);
});

app.use(globalErrHandler);

module.exports = app;