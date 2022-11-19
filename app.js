const fs = require('fs');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet')
const expressMongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const path= require('path');
const cookieParser = require('cookie-parser');
const app = express();
const globalErrorHandler=require('./controllers/errorController')
const userRouter = require('./routes/userRouter');
const viewRouter = require('./routes/viewRouter');
const bookingsRouter=require('./routes/bookingsRouter');
const AppError=require('./utils/AppError')
var cors = require('cors')
app.set('view engine','pug');
app.set('views', path.join(__dirname, 'views'));


// serving static files
app.use(express.static(path.join(__dirname, 'public')));

//SET HTTP HEADERS USING HELMET 
// app.use(helmet({
//   crossOriginEmbedderPolicy: false,
// }));


//DEVELOPMENT LOGGING
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}


//LIMIT REQUEST FROM THE SAME API
const limiter = rateLimit({
  max:100,
  WindowMs: 60*60*1000,// 1 hour
  message: 'Rate limit exceeded for the current IP!! please try after an hour.'
})

app.use('/api',limiter);




//BODY PARSER
app.use(express.json({limit:'10kb'})); //can take data upto 10kb

app.use(cookieParser());
//for the above cookieParser we can use req.cookies

app.use(express.urlencoded({extended: true,limit: '10kb'}))// it is used to take input from the form itself without involving the APIs
//try to remember we were taking input from to update data i.e name and email and the data was in req.body
//but when we displayed it the object was empty so we are using this expres.urlencoded

//DATA SANITIZATION AGAINST NOSQL QUERY INJECTION
// BECAUSE IF WE LOGIN WITH : "email" :{"$gt":""}, "password":"1234567", any correct password, the hacker will be logged in because the $gt:"" will be valid for all the emails
app.use(expressMongoSanitize());


//DATA SAMITIZATION AGAINST XSS 
app.use(xss());
// if the above code is not there then for an eg: a hacker can insert malicious HTML code in name in the sighup option
// eg : "name":"<div id=hello>Name</div>"
//after using xss() : html content changes to  "&lt;div id=hello>Name&lt;/div>" , hence our data was protected


//PREVENT PARAMETER POLLUTION
// app.use(hpp({
//   whitelist:['duration','ratingsQuantity','ratingsAverage','maxGroupSize','difficulty','price']
// }));

app.use((req, res, next) => {
    // console.log('hello from middleware 1');
    req.requestTime=new Date().toISOString();
    // console.log(req.cookies)
    next(); // if there is not next we will be stuck here for ever
  });
  
  app.use(cors())



const restRouter = require('./routes/restRouter')

app.use('/', viewRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/restaurants', restRouter);
app.use('/api/v1/booking',bookingsRouter)
app.all('*',(req,res,next)=>{
  const err = new AppError(`The ${req.originalUrl} is invalid`,404);
  next(err);
})

app.use(globalErrorHandler)


module.exports = app;