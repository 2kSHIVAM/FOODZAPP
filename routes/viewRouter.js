const express = require('express');
const viewController = require('./../controllers/viewController');
const authController = require('./../controllers/authController');
const rauthController = require('./../controllers/rauthController');
// const bookingController = require('./../controllers/bookingController');

const router = express.Router();


router.get('/',authController.isLoggedIn,viewController.getOverview);


//NOTE: is logged is helping to find whether the user is logged in or not so that we can display his image in the profile and if not then we have to show login and sign up option in the navigation bar
router.get('/login', authController.isLoggedIn,viewController.getLoginForm);
router.get('/signup', authController.isLoggedIn,viewController.getSignUpForm);
router.get('/login-rest', rauthController.isLoggedIn,viewController.getLoginForm);
router.get('/signup-rest', rauthController.isLoggedIn,viewController.getSignUpForm);
router.get('/me',authController.protect, viewController.getAccount);

router.get('/my-orders',authController.protect, viewController.getMyOrders);
router.get('/cart',authController.protect, viewController.cart);
// router.get('/tour/:slug_name', authController.isLoggedIn,viewController.getTour);

// router.post('/submit-user-data',authController.protect, viewController.updateUserData)

module.exports = router