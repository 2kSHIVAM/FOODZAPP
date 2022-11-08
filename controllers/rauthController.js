const Rest = require('./../models/restModel');
const catchAsync = require('./../utils/catchError')
const jwt = require('jsonwebtoken');
const AppError = require('./../utils/AppError')
const { promisify } =require('util');
// const  Email= require('./../utils/email')

const crypto = require('crypto');
const jwtSignToken= id=>{
    return jwt.sign( {id:id} , process.env.JWT_SECRET_KEY ,{  //2 times id because 1st id is field name 2nd id is paramter
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}
  
  const createSendToken = (rest, statusCode, res) => {
    const token = jwtSignToken(rest._id);
    const cookieOptions = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
      ),
      httpOnly: true
    };
    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  
    res.cookie('jwt', token, cookieOptions);
  
    // Remove password from output
    rest.password = undefined;

    res.status(statusCode).json({
      status: 'success',
      token,
      data: {
        rest
      }
    });
  };


exports.signup = catchAsync(async(req,res,next)=>{
    // const newUser = await User.create(req.body);
    // initially the above code was supposed to be written but the problem with that was 
    // if we use req.body the user will get the role of the admin and we dont want that
    // so we are updating the code 
    // below is the updated code 

    const newRest = await Rest.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        phone: req.body.phone,
        menu_category:req.body.menu_category,
        confirmPassword: req.body.confirmPassword,
        passwordChangedAt: req.body.passwordChangedAt,
        location: req.body.location,
        city:req.body.city,
        country:req.body.country,
        message:req.body.message,
        greeting:req.body.greeting,
        title:req.body.title,
        menu: req.body.menu,
        ratingsAverage:req.body.ratingsAverage
        //we need to add the qr code here
    })


    // const url=`${req.protocol}://${req.get('host')}/me`;
    // // console.log(url);
    // await new Email(newUser,url).sendWelcome();
    //header will be attached itself so dont worry about it
    // {if:newUser._id} is the payload
    //expiresin is the option , see the documentation for more
    createSendToken(newRest,201,res)
});


exports.login= catchAsync(async(req,res,next)=>{
    const {email,password} = req.body;
    console.log(email);
    console.log(password);
    // if email or password is not entered
    if(!email||!password)
    return next(new AppError('Please Enter the email and password',400));
    
    const rest = await Rest.findOne({email}).select('+password');//here user original password is included becoz it is required in fu

    //if the user with given email is not there or his password does not match with the given password
    if(!rest||! (await rest.comparePassword(password,rest.password)))
    return next(new AppError('Incorrect email or password',401))
    //if everything is correct send the token to the client
    createSendToken(rest,200,res)
})

exports.logout = (req,res)=>{
    res.cookie('jwt','loggedout',{
      expires: new Date(Date.now()+10*1000),
      httpOnly: true
    })
    res.status(200).json({status: 'success'});
  };
  

  exports.protect = catchAsync(async(req,res,next)=>{
    // console.log(req.headers);

    //GETTING THE TOKEN AND CHECK IF ITS THERE OR NOT
    let token;
    // if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
    // token = req.headers.authorization.split(' ')[1];
    // // console.log(token);
    // }
    if(req.cookies.jwt){
      token = req.cookies.jwt;
    }
    if(!token)
    return next(new AppError('You are logged out!! Please log in to get the access',401));

    
    //VERIFICATION OF THE TOKEN 
    const decode = await promisify(jwt.verify)(token,process.env.JWT_SECRET_KEY);
    // console.log(decode);
    //the above command helps to find the id:of the user, iat: issued at time, exp : expiry time i guess
    //Note: 1) if there is JsonWebTokenError i.e invalid token occurs, then errorController will handle it
         // 2) if there is TokenExpiredError i.e token has expired .. a person has to login again to get the new token



    //CHECK IF THE USER STILL EXISTS 

    const currentRest = await Rest.findById(decode.id);
    if(!currentRest)
    {
        return next(new AppError("The restaurant with this token no longer exists",401));
    }

    //CHECK IF THE USER CHANGED THE PASSWORD AFTER THE TOKEN WAS ISSUED

    // if(currentUser.changedPasswordAfter(decode.iat))
    // {
    //     // console.log("hello");
    //     return next(new AppError("User recently changed Password !! Please log in again",401))
    // }

    //GRANT THE ACCESS TO THE PROTECTED ROUTE
    req.rest = currentRest;
    res.locals.rest = currentRest;
    // res.status(200).json({
    //     message:"success",
    //     user:currentUser

    // })
    next();
});




exports.isLoggedIn = async(req,res,next)=>{
  
  if(req.cookies.jwt){
  try{
  // 1) verify the token
  const decode = await promisify(jwt.verify)(req.cookies.jwt,process.env.JWT_SECRET_KEY);

  // 2) check if the user exist
  const currentRest = await Rest.findById(decode.id);
  if(!currentRest)
  {
      return next();
  }

  // 3) check if the user changed the password after the token was issued
  if(currentRest.changedPasswordAfter(decode.iat))
  {
      return next();
  }

  res.locals.rest = currentRest;
  return next();
}catch(err){
  return next();
}
}
next();
};
