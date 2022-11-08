const AppError = require("./../utils/AppError")

const castErrorHanderDB = (err)=>{
    return new AppError(`Invalid ${err.path}:${err.value}`,400);
}

const duplicateFieldHandler=(err)=>{
    return new AppError(`Duplicate field "${err.keyValue.name}"`,400);
}
const validationErrorHandler = (err)=>{
    let message = Object.values(err.errors).map(el=> el.message).join(". ");
    // message = message.split(". ").join("\r\n");
    return new AppError(`Invalid input data :\r\n${message}`,400);
}
const JsonWebTokenErrorHandler = ()=>{
    return new AppError('Invalid token !! Please log in again...',401);
}
const TokenExpiredErrorHandler = ()=>{
    return new AppError("Your session has expired!! Please log in again.",401);
}
const errSendDev = (err,req,res)=>{
    // A) //API
    if(req.originalUrl.startsWith('/api')){
    return res.status(err.statusCode).json({
        status:err.status,
        message:err.message,
        stack:err.stack,
        err:err
      })
    }

        // B) //RENDERED WEBSITE
        res.status(err.statusCode).render('error',{
            title: 'Something went wrong!!',
            msg: err.message
        });

};
const errSendprod = (err,req,res)=>{
    // A) //API
    if(req.originalUrl.startsWith('/api')){
    if(err.isOperational)
    {
        return res.status(err.statusCode).json({
            status:err.status,
            message:err.message
          })
    }
    //programming other unknown error dont leak out detail
        console.error('Error💥💥')
        return res.status(500).json({
            status:'error',
            message:'Something went very wrong'
        })
    
}
    // B) //RENDERED WEBSITE
    if(err.isOperational)
    {
        return res.status(err.statusCode).render('error',{
            title: 'Something went wrong!!',
            msg: err.message
        });
    }
    //programming other unknown error dont leak out detail

        console.error('Error💥💥')
        return res.status(err.statusCode).render('error',{
            title: 'Something went wrong!!',
            msg: 'Please try again later.'
        });

}


module.exports = (err,req,res,next)=>{
    err.status=err.status||"error";
    err.statusCode=err.statusCode||500;
    if(process.env.NODE_ENV=="development")
    {
        errSendDev(err,req,res);
    }
    else if(process.env.NODE_ENV=="production")
    {
        let error = Object.assign(err);// we could have used the ...(destructor) but we did not get the desired outcome
        if(error.name==="CastError")
        {
            // console.log('hello');
            // cast error is the error that is created by the mongoose and not created by our class Apperror
            // since we know that cast error may happen so we are making it an operational error by creating a new error of class AppError
            // as all the error created of the class have is opertation set to true
            error = castErrorHanderDB(error);
            
        }

        if(error.code===11000)
        {
            error = duplicateFieldHandler(error);
        }

        if(error.name==="ValidationError")
        {
            error = validationErrorHandler(error);
        }
        if(error.name==="JsonWebTokenError")
        {
            error = JsonWebTokenErrorHandler();
        }
        if(error.name==="TokenExpiredError")
        {
            error = TokenExpiredErrorHandler();
        }
        errSendprod(error,req,res);
    }
    
    next();
  }