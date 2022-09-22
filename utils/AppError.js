class AppError extends Error {
    constructor(message,statusCode)
    {
        super(message);
        this.statusCode = statusCode;
        this.status= `${statusCode}`.startsWith('4')?'fail':'error';//`${statusCode}` convert the in statusCode into the string format and then we can check whether it starts with '4' or not
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
module.exports = AppError;