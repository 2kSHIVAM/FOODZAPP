const OrderHistory=require('./../models/orderHistoryModel');
const OrderHistoryRest=require('./../models/orderHistoryModelRest');

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
exports.showOrderHistoryRest=catchAsync(async(req,res)=>{
    const orders=await OrderHistoryRest.find({rest:req.rest});
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
        orderHistory=await OrderHistory.findOneAndUpdate({user:req.user},{
            $push:{orders:cart}
        })
    }
    next();
})



exports.updateHistoryRest=catchAsync(async(req,res,next)=>{

    const cart= await Cart.findOne({user:req.user});
    console.log(cart.rest)
    const order=await OrderHistoryRest.findOne({rest:cart.rest})
    let orderHistoryRest
    //if no prior history
    if(!order){
        orderHistoryRest=await OrderHistoryRest.create({
        rest:cart.rest,
        orders:cart
    })}
    else{
        orderHistoryRest=await OrderHistoryRest.findOneAndUpdate({rest:cart.rest},{
            $push:{orders:cart}
        })
    }
    next()
})

exports.toAddTick=catchAsync(async(req,res,next)=>{
    const order=await OrderHistoryRest.findOne({rest:req.body.restId})
    let ans=order.orders

    let i;
    for(i=0;i<ans.length;i++)
    {
        if(ans[i]._id==req.body.foodId)
        break;
    }
    ans[i].delivered=true;
    // console.log(ans[i])
    await OrderHistoryRest.findOneAndUpdate({rest:req.body.restId},{orders:ans})
    res.status(200).json({
        status: 'success'
    })
    // console.log(order)
})
