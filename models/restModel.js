const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const restSchema= new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Arestaurant must have a name!']
    },
    slug:{
        type:String
    },
    email:{
        type:String,
        required:[true,'Please provide us the retaurant email'],
        unique:true,
        lowercase:true,
        validate:[validator.isEmail,'Please enter a valid email']
    },
    photo:{
        type:String,
        default:'default.jpg'
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
        type:[Number]
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
    ratingsAverage:{
        type:Number
    },

    active:{
        type: Boolean,
        default: true,
        select: false
    },
    menu_category:[{type:String, 
        meals:[{type:String}]
        //need to add the price and discount as well as the image of thr product
    }],
    qr_code:{
        type: String
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetTokenExpiry: Date,
    
})
restSchema.pre('save',async function(next){
    this.slug=slugify(this.name,{lower:true});
    next();
})
restSchema.pre('save', async function(next){
    // if the password was not modified then we will return from the funtion
    if(!this.isModified('password'))// this.isModified() checks for the entire document whether there is any modification in the document 
    return next();

    this.password = await bcrypt.hash(this.password,12);
    this.confirmPassword=undefined;
    next();
})
restSchema.pre('save', function(next){
    if(!this.isModified('password')||this.isNew)
    {
        next();
    }
    this.passwordChangedAt = Date.now() - 1000;
    next()
})

restSchema.pre(/^find/,function(next){
    this.find({active:{$ne:false}});
    next();
})

restSchema.methods.comparePassword = async function(candidatePassword,restPassword) {
    return await bcrypt.compare(candidatePassword,restPassword);
}
restSchema.methods.changedPasswordAfter=function(JWTtimestamp) {
    if(this.passwordChangedAt)
    {
        passwordChangedAtTimeStamp = parseInt(this.passwordChangedAt.getTime()/1000,10);
        return JWTtimestamp<passwordChangedAtTimeStamp;
    }
    return false;
}
restSchema.methods.createdPasswordResetToken=function(){
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');//encryption : encrypted token will be stored n DB
    // console.log({resetToken},this.passwordResetToken);
    this.passwordResetTokenExpiry = Date.now() + 10*60*1000;
    return resetToken;
}
const Rest = mongoose.model('Rest',restSchema);
module.exports = Rest;