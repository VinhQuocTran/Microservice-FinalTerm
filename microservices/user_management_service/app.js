'use strict';
require('dotenv').config();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const express = require('express');
const globalErrorHandler = require('./controllers/errorController');
const accountRoute = require('./routes/accountRoute');
const propertyRoute = require('./routes/propertyRoute');
const submitPropertyRoute = require('./routes/submitPropertyRoute');
const serviceRoute = require('./routes/serviceRoute');
const propertyServiceTransactionRoute = require('./routes/propertyServiceTransactionRoute');
const listingPropertyRoute = require('./routes/listingPropertyRoute');
const propertyTokenOwnershipRoute = require('./routes/propertyTokenOwnershipRoute');
const monthlyPropertyValuationRoute = require('./routes/monthlyPropertyValuationRoute');
const AppError = require('./utils/appError');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./docs/swagger.json');

const app = express();

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());
app.use(cors());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api/accounts', accountRoute);
app.use('/api/properties', propertyRoute);
app.use('/api/submitProperties', submitPropertyRoute);
app.use('/api/services', serviceRoute);
app.use('/api/propertyServiceTransactions', propertyServiceTransactionRoute);
app.use('/api/listingProperties', listingPropertyRoute);
app.use('/api/propertyTokenOwnerships', propertyTokenOwnershipRoute);
app.use('/api/monthlyPropertyValuations', monthlyPropertyValuationRoute);

app.use('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.use(globalErrorHandler);

module.exports = app;