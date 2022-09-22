const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema= new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Please tell us your name!']
    },
    email:{
        type:String,
        required:[true,'Please provide us your email'],
        unique:true,
        lowercase:true,
        validate:[validator.isEmail,'Please enter a valid email']
    },
    photo:{
        type:String,
        default:'default.jpg'
    },
    role:{
        type:String,
        enum:['admin','sub-admin','user'],
        default:'user'
    },
    password:{
        type:String,
        required:[true,'Please provide us your password'],
        minlength:8,
        select:false
    },
    confirmPassword:{
        type:String,
        required:[true,'Please confirm your password'],
        // this only works on save/create
        // this only does not work on update
        validate:{
            validator: function(el){
                return el===this.password;
            },
            message:'Please enter the same password'
        }
    },
    phone:{
        type:Number,
        // required:[true,'A user must contain a phone number']
    },
    location:{
        type:{
            type: String,
            default:'Point',
            enum:['Point']
        },
        coordinates:[Number],
        address: String,
        description: String

    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetTokenExpiry: Date,
    active:{
        type: Boolean,
        default: true,
        select: false
    }
    
})
userSchema.pre('save', async function(next){
    // if the password was not modified then we will return from the funtion
    if(!this.isModified('password'))// this.isModified() checks for the entire document whether there is any modification in the document 
    return next();

    this.password = await bcrypt.hash(this.password,12);
    this.confirmPassword=undefined;
    next();
})
userSchema.pre('save', function(next){
    if(!this.isModified('password')||this.isNew)
    {
        next();
    }
    this.passwordChangedAt = Date.now() - 1000;
    next()
})

userSchema.pre(/^find/,function(next){
    this.find({active:{$ne:false}});
    next();
})

userSchema.methods.comparePassword = async function(candidatePassword,userPassword) {
    return await bcrypt.compare(candidatePassword,userPassword);
}
userSchema.methods.changedPasswordAfter=function(JWTtimestamp) {
    if(this.passwordChangedAt)
    {
        passwordChangedAtTimeStamp = parseInt(this.passwordChangedAt.getTime()/1000,10);
        return JWTtimestamp<passwordChangedAtTimeStamp;
    }
    return false;
}
userSchema.methods.createdPasswordResetToken=function(){
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');//encryption : encrypted token will be stored n DB
    // console.log({resetToken},this.passwordResetToken);
    this.passwordResetTokenExpiry = Date.now() + 10*60*1000;
    return resetToken;
}
const User = mongoose.model('User',userSchema);
module.exports = User;