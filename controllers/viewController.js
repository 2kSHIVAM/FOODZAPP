const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchError');
const AppError = require('./../utils/AppError');
const Rest = require('./../models/restModel')
const Cart = require('./../models/cartModel')
const OrderHistory = require('./../models/orderHistoryModel')


exports.getOverview = catchAsync(async(req,res)=>{
    // 1) get tour data from the collection
    // const tours = await Tour.find();

    // 2) Build the template

    // 3) Render the template using the data obtained from step 1


    res.status(200).render('overview',{
      title: 'All RESTS'//,
    //   tours
    });
  });

// exports.getTour = catchAsync(async (req,res,next)=>{
//     // 1) get the data for the requested tour including reviews and guides

//     const tour = await Tour.findOne({slug: req.params.slug_name}).populate({
//         path: 'reviews',
//         fields: 'review rating user'
//     })

//     if(!tour){
//       return next(new AppError('There is no tour with that name',404));
//     }

//     // 2) Build the template

//     // 3) Render the template with data from 1)
//     res.status(200)
//     // .set(
//     //   'Content-Security-Policy',
//     //   "default-src 'self' https://*.mapbox.com https://js.stripe.com/v3/;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://js.stripe.com/v3/ https://cdnjs.cloudflare.com https://api.mapbox.com 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;"
//     // )
//     .render('tour',{
//       title: `${tour.name} Tour`,
//       tour
//     });
//   });

  exports.getLoginForm = (req,res)=>{
    res.status(200)
    // .set(
    //   'Content-Security-Policy',
    //   "default-src 'self' https://*.mapbox.com ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;"
    // )
  .render('login',
    {
        title: 'Log into your account'
    })
  }


  exports.getSignUpForm = (req,res)=>{
    res.status(200)
    // .set(
    //   'Content-Security-Policy',
    //   "default-src 'self' https://*.mapbox.com ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;"
    // )
  .render('signup',
    {
        title: 'Create new account'
    })
  }


  exports.getAccount = (req,res)=>{
    res.status(200).render('account',
    {
        title: 'Your accounts'
    })
  }

  // exports.updateUserData = async (req,res,next)=>{
  //   console.log('updating data...',req.body);
  //   const updatedUser = await User.findByIdAndUpdate(req.user.id,{
  //     name: req.body.name,
  //     email: req.body.email
  //   },
  //   {
  //     new: true,
  //     runValidators: true
  //   }
  //   );
  //   res.status(200).render('account',
  //   {
  //       title: 'Your accounts',
  //       user: updatedUser
  //   })
  // }

  exports.getMyOrders = catchAsync(async (req, res, next) => {
    // 1) Find all bookings
    // const bookings = await Booking.find({ user: req.user.id });
  
    // // 2) Find tours with the returned IDs
    // const tourIDs = bookings.map(el => el.tour);
    // const tours = await Tour.find({ _id: { $in: tourIDs } });
    const data=await OrderHistory.find({user:req.user});
    const restIDs = data[0].orders.map(el => el.rest);
    const rests = await Rest.find({ _id: { $in: restIDs } });
    const restName=rests.map(el=>el.name);
    console.log(restIDs);

  
    res.status(200).render('user_order', {
      title: 'My Orders',
      data:rests
    });
  });
  
  exports.cart=catchAsync(async(req,res) => {
    const data=await Cart.findOne({user:req.user})
    // console.log(data.meals)
    const price = data.meals.map(el=>el.price*el.quantity)
    let newprice=0
    for(let i=0;i<price.length;i++)
    newprice=newprice+price[i]
    
    res.status(200).render('cart',{
      title:"My cart",
      data:data.meals,
      finalPrice:newprice
    })
  })