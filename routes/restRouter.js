const express = require('express');
const router= express.Router();
const restController = require('./../controllers/restController.js');
const rauthController = require('./../controllers/rauthController.js');
const authController = require('./../controllers/authController.js');
const cartController = require('./../controllers/cartController.js');
const historyController = require('./../controllers/historyController.js');

router.route('/').get(restController.getAllRests);
router.post('/signup',rauthController.signup);
router.post('/login',rauthController.login);
router.get('/logout',rauthController.protect, rauthController.logout);
// router.get('/protect',rauthController.protect);
// router.post('/forgotPassword',rauthController.forgotPassword);
// router.patch('/updatePassword',rauthController.protect,rauthController.updatePassword);// we have to make sure that the rest is loggedin before he is attempting to change the password
// router.patch('/resetPassword/:token',rauthController.resetPassword);

//need to add middleware for the photo and resizing it


router.post('/updateMe',rauthController.protect,restController.uploadRestPhoto,restController.resizeRestPhoto,restController.updateMe);
// router.post('/signup2',rauthController.protect,restController.uploadRestPhoto,restController.resizeRestPhoto,restController.updateMenu);
router.post('/signup2',rauthController.protect,restController.updateMenu);
router.delete('/deleteMe',rauthController.protect, restController.deleteMe);
router.get('/me',rauthController.protect,restController.getMe);

router.get('/myOrders',rauthController.protect,historyController.showOrderHistoryRest)


router.route('/:slugi').get(restController.getRest)
router.route('/addToCart').post(authController.isLoggedIn,cartController.addToCart)
router.route('/addTick').post(historyController.toAddTick)

// router.post('/createCart',);



//restricted for the admin only
router.route('/:id').delete(restController.deleteRest);


module.exports=router;