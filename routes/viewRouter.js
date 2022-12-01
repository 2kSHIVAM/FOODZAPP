const express = require('express');
const viewController = require('./../controllers/viewController');
const authController = require('./../controllers/authController');
const rauthController = require('./../controllers/rauthController');
// const bookingController = require('./../controllers/bookingController');
const cartController = require('./../controllers/cartController.js');

const historyController = require('./../controllers/historyController.js');

const router = express.Router();


router.get('/',authController.isLoggedIn,rauthController.isLoggedIn,viewController.getOverview);

//NOTE: is logged is helping to find whether the user is logged in or not so that we can display his image in the profile and if not then we have to show login and sign up option in the navigation bar
router.get('/login-user', authController.isLoggedIn,viewController.getLoginForm);
router.get('/signup-user', viewController.getSignUpForm);
router.get('/login-rest', rauthController.isLoggedIn,viewController.getLoginForm);
// router.get('/signup-rest', rauthController.isLoggedIn,viewController.getSignUpForm);
router.get('/signup2-menu',rauthController.isLoggedIn,viewController.getSignUpForm2)
router.get('/me-user',authController.protect, viewController.getAccount);
router.get('/me-rest',rauthController.protect, viewController.getAccount);

router.get('/my-orders',authController.protect, viewController.getMyOrders);
router.get('/my-orders-rest',rauthController.protect, viewController.getMyOrderRest);
router.get('/getQr',rauthController.protect, viewController.getMyQr);

router.get('/cart',authController.protect,authController.isLoggedIn, viewController.cart);
router.get('/user-placed-order',authController.protect,historyController.updateHistory,historyController.updateHistoryRest,viewController.getBillPage)
router.get('/restaurant/:restName',authController.protect,authController.isLoggedIn,viewController.getMyRest);

router.get('/my-orders-details/:id',authController.protect,authController.isLoggedIn,viewController.getOrderDetails)

router.get('/manageMenu',rauthController.protect, viewController.manageMenu)
// router.get('/tour/:slug_name', authController.isLoggedIn,viewController.getTour);
// router.post('/submit-user-data',authController.protect, viewController.updateUserData)
module.exports = router