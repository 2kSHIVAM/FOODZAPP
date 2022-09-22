const express = require('express');
const router= express.Router();
const restController = require('./../controllers/restController.js');
const rauthController = require('./../controllers/rauthController.js');




router.route('/').get(restController.getAllRests);
router.post('/signup',rauthController.signup);
router.post('/login',rauthController.login);
router.get('/logout',rauthController.logout);
router.get('/protect',rauthController.protect);


// router.post('/forgotPassword',rauthController.forgotPassword);
// router.patch('/updatePassword',rauthController.protect,rauthController.updatePassword);// we have to make sure that the rest is loggedin before he is attempting to change the password
// router.patch('/resetPassword/:token',rauthController.resetPassword);

//need to add middleware for the photo and resizing it
router.post('/updateMe',rauthController.protect,restController.updateMe);

router.delete('/deleteMe',rauthController.protect, restController.deleteMe);
// router.get('/me',rauthController.protect,restController.getMe,restController.getrest);


//restricted for the admin only
router.route('/:id').get(restController.getRest).delete(restController.deleteRest);

module.exports=router;