const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const catchAsync = require('./../utils/catchError')
const AppError = require('./../utils/AppError')
const Cart=require('./../models/cartModel')
const Rest=require('./../models/restModel')

exports.getCheckoutSession=catchAsync(async(req,res,next)=>{
    //currently booked items
    const data=await Cart.find({user:req.user});
    data.reverse();
    const result=data[0];
    // console.log(result)
    const rest=await Rest.find({name:result.rest.name});
    const rest_name=rest[0].name
    // const rest_image=rest.photo
    const meals=result.meals
    // console.log(result.meals)
    let descrip=` `
    let totalQuantity=0;
    let newprice=0
    for(let i=0;i<meals.length;i++)
    {
        descrip=descrip+`${meals[i].name} * ${meals[i].quantity} | `
        // totalQuantity=totalQuantity+meals[i].quantity
        newprice=newprice+meals[i].price*meals[i].quantity
    }
    newprice=newprice+30;
    // console.log(totalQuantity)
    // below code is also used to calc the price but it is tedious but a good method
    // const price = result.meals.map(el=>el.price*el.quantity)
    
    // for(let i=0;i<price.length;i++)
    // newprice=newprice+price[i]

    // const rest=result.rest;
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        success_url: `${req.protocol}://${req.get('host')}/user-placed-order`,
        cancel_url: `${req.protocol}://${req.get('host')}/`,
        customer_email: req.user.email,
        // client_reference_id: req.params.tourId,
        line_items: [
          {
            name: `${rest_name}`,
            
            //note that we cannot use the current rest image here because the image has to be uploaded on the stripe server and since we have saved the image in out local server so we will use a link of a rest as the replacement
            images: [`https://cdn.vox-cdn.com/thumbor/OheW0CNYdNihux9eVpJ958_bVCE=/0x0:5996x4003/1200x900/filters:focal(1003x1633:1961x2591)/cdn.vox-cdn.com/uploads/chorus_image/image/51830567/2021_03_23_Merois_008.30.jpg`],
            description: `Items : ${descrip}`,
            amount: newprice * 100 ,
            currency: 'usd',
            quantity: 1
          }
        ]
      });

    res.status(200).json({
        status: 'success',
        session
    })
});