const express = require('express');
const router= express.Router();
const restController = require('./../controllers/restController.js');
const rauthController = require('./../controllers/rauthController.js');
const authController = require('./../controllers/authController.js');
const cartController = require('./../controllers/cartController.js');
const historyController = require('./../controllers/historyController.js');
const bookingsController = require('./../controllers/bookingsController.js');

router.use(authController.protect);

router.get('/checkout-session/:foodId',bookingsController.getCheckoutSession)

module.exports=router;
