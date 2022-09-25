const OrderHistory=require('./../models/orderHistoryModel');
const Cart=require('./../models/cartModel')
const AppError = require("../utils/AppError");
const catchAsync = require('./../utils/catchError');
const mongoose=require('mongoose');

exports.showOrderHistory=catchAsync(async(req,res)=>{
    const orders=await OrderHistory.find({user:req.user});
    res.status(200).json({
        status:"success",
        data:orders
    })
})

exports.updateHistory=catchAsync(async(req,res,next)=>{
    const cart= await Cart.findOne({user:req.user});
    const order=await OrderHistory.findOne({user:req.user})
    let orderHistory

    //if no prior history
    if(!order){
    orderHistory=await OrderHistory.create({
        user:req.user,
        orders:cart

    })}
    else{
        const orderHistory=await OrderHistory.findOneAndUpdate({user:req.user},{
            $push:{orders:cart}
        })
    }
    res.status(200).json({
        status: 'success',
    })
})