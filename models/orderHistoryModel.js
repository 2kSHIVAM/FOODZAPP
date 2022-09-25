const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const historySchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User'
    },
    orders:[{
        rest:{
            type:mongoose.Schema.ObjectId,
            ref:'Rest',
            // required:[true,"A cart must belong to a restaurant"]
        },
        user:{
            type:mongoose.Schema.ObjectId,
            ref:'User',
            // required:[true,"A cart must belong to a user"]
        },
        meals:[
            {
                name:{
                    type:String,
                    required:[true,"A meal must hava a name"]
                },
    
                price:{
                    type:Number,
                    required:[true,"A meal must have a price"]
                },
                discount:{
                    type:Number,
                    default:0,
                    required:[true,"A meal must have a discount"]
                },
                quantity:{
                    type:Number,
                    default:1
                },
                ratings:{
                    type:Number
                },
                meal_photo:{
                    type:String
                }
            }
        ],
        final_price:{
            type:Number
        }
    }]

})

const OrderHistory=mongoose.model('OrderHistory',historySchema);
module.exports=OrderHistory;