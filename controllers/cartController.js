const Cart =require('./../models/cartModel');
const AppError = require("../utils/AppError");
const catchAsync = require('./../utils/catchError');
const multer = require('multer');
const sharp = require('sharp');

exports.addToCart=catchAsync(async(req,res)=>{
    
    const cart = await Cart.create({
        user:req.user,
        // NOTE WE WILL ADD THE RESTAURANT BY USING THE SLUG FROM THE PARAMETER BECAUSE WE WILL ADD TO THE CART FROM THE RESTAURENT PAGE AND THERE WE WILL HAVE THE RESTAURANT NAME IN FORM OF SLUG IN THE PARAMETER
        meals:req.body.meals,
    })
    res.status(200).json({
        message:"success",
        cart:cart
    })
})
exports.getCart=catchAsync(async(req,res)=>{
    const cart = await Cart.find({user:req.user});
    res.status(200).json({
        message:"success",
        cart:cart
    })
})

exports.emptyCart=catchAsync(async(req,res)=>{
    const cart = await Cart.deleteMany();
    await Cart.findByIdAndDelete(cart.id);
    res.status(200).json({
        message:"success",
        data:null
    })
})