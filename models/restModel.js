const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const slugify = require('slugify');
const restSchema= new mongoose.Schema({
    name:{
        type:String,
        required:[true,'A restaurant must have a name!']
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

        coordinates:{
            type:[Number]
        },
        address: {
            type: String
        },
        description: {
            type: String
        }
    },
    ratingsAverage:{
        type:Number
    },
    city:{
        type: String
    },
    country:{
        type: String
    },
    greeting:{
        type:String
    },
    message:{
        type:String
    },
    title:{
        type:String
    },
    active:{
        type: Boolean,
        default: true,
        select: false
    },
    choice:{
        type:String
    },
    // menu_name:[{type:String,
    //     meals:[{
    //         meal_name:{
    //             type:String,
    //             required:[true,"A meal must have a name"]
    //         },
    //         price:{
    //             type:Number,
    //             required:[true,"A meal must have a price"]
    //         },
    //         dicount:{
    //             type:Number,
    //             default:0
    //         }
    //     }]
    //     //need to add the price and discount as well as the image of thr product
    // }],
    menu:[{
        menu_heading:{
            type:String,
        },
        meals:[{
            meal_name:{
                type:String,
                required:[true,"A meal must have a name"]
            },
            price:{
                type:Number,
                required:[true,"A meal must have a price"]
            },
            discount:{
                type:Number,
                default:0
            },
            meal_photo:{
                type:String
            },
            rating:{
                type:Number
            }

        }]
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
    this.qr_code=`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=http://localhost:3000/restaurant/${this.slug}`
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