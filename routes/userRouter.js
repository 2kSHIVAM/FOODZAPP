const express = require('express');
const router= express.Router();
const userController = require('./../controllers/userController.js');
const authController = require('./../controllers/authController.js');




router.route('/').get(userController.getAllUsers);
router.post('/signup',authController.signup);
router.post('/login',authController.login);
router.get('/logout',authController.logout);
router.get('/protect',authController.protect);


// router.post('/forgotPassword',authController.forgotPassword);
// router.patch('/updatePassword',authController.protect,authController.updatePassword);// we have to make sure that the user is loggedin before he is attempting to change the password
// router.patch('/resetPassword/:token',authController.resetPassword);

//need to add middleware for the photo and resizing it
router.post('/updateMe',authController.protect,userController.updateMe);

router.delete('/deleteMe',authController.protect, userController.deleteMe);
// router.get('/me',authController.protect,userController.getMe,userController.getUser);


//restricted for the admin only
router.route('/:id').get(userController.getUser).delete(userController.deleteUser);

module.exports=router;