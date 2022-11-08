const Cart =require('./../models/cartModel');
const AppError = require("../utils/AppError");
const catchAsync = require('./../utils/catchError');
const multer = require('multer');
const sharp = require('sharp');
const Rest = require('./../models/restModel')

exports.addToCart=catchAsync(async(req,res)=>{
    const rest=await Rest.find({slug:req.params.slugi})
    console.log(rest[0]);
    const cart = await Cart.create({
        user:req.user,
        rest:rest[0],
        // NOTE WE WILL ADD THE RESTAURANT BY USING THE SLUG FROM THE PARAMETER BECAUSE WE WILL ADD TO THE CART FROM THE RESTAURENT PAGE AND THERE WE WILL HAVE THE RESTAURANT NAME IN FORM OF SLUG IN THE PARAMETER
        meals:req.body.meals
        
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


// took help form the stackoverflow
exports.emptyCart=catchAsync(async(req,res)=>{
    const cart = await Cart.deleteMany();
    await Cart.findByIdAndDelete(cart.id);
    res.status(200).json({
        message:"success",
        data:null
    })
})