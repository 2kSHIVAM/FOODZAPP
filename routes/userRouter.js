const express = require('express');
const router= express.Router();
const userController = require('./../controllers/userController.js');
const authController = require('./../controllers/authController.js');
const cartController = require('./../controllers/cartController.js');

const historyController = require('./../controllers/historyController.js');



router.route('/').get(userController.getAllUsers);
router.post('/signup',authController.signup);
router.post('/login',authController.login);
router.get('/logout',authController.logout);
router.get('/protect',authController.protect);

// WE NEED TO MOVE CREATE CART TO THE RESTAURANT ROUTER IN FUTURE BECAUSE AT RESTAUNRANT PAGE WE WILL ADD THE DATA IN CART DOCUMENT
// router.post('/createCart',authController.protect,cartController.addToCart);

//THE BELOW TWO WILL REMAIL IN USER ROUTER BECAUSE FOR CART A SEPARATE PAGE WILL OPEN AND IT WILL HAVE THE USER IN PARAMETER
router.get('/myCart',authController.protect,cartController.getCart)
router.delete('/emptyCart',authController.protect,cartController.emptyCart)
router.post('/placeOrder',authController.protect,historyController.updateHistory,historyController.updateHistoryRest);
router.get('/myOrders',authController.protect,historyController.showOrderHistory)

router.post('/forgotPassword',authController.forgotPassword);
// router.patch('/updatePassword',authController.protect,authController.updatePassword);// we have to make sure that the user is loggedin before he is attempting to change the password
// router.patch('/resetPassword/:token',authController.resetPassword);

//need to add middleware for the photo and resizing it
router.patch('/updateMe',authController.protect,userController.uploadUserPhoto,userController.resizeUserPhoto,userController.updateMe);

router.delete('/deleteMe',authController.protect, userController.deleteMe);

router.get('/me',authController.protect,userController.getMe);



//restricted for the admin only
router.route('/:id').get(userController.getUser).delete(userController.deleteUser);

module.exports=router;