const AppError = require("../utils/AppError");
const { findByIdAndUpdate } = require("../models/restModel");
const Rest = require('../models/restModel');
const APIFeatures = require('../utils/apifeatures');
const catchAsync = require('../utils/catchError');
// const factory = require('./handlerFactory');
const multer = require('multer');
const sharp = require('sharp');

const filterObj =  (obj, ...allowedFields)=>{
    const newObj={};
    Object.keys(obj).forEach(el=>{
        if(allowedFields.includes(el))
        newObj[el]=obj[el];
    });
    return newObj;
};


exports.getAllRests = catchAsync(async(req, res) =>{
    const feature = new APIFeatures(Rest.find(),req.query).filter().sorting().fields().paginate();
    const rests = await feature.query;
    res.status(200).json({
        "status":"sucess",
        "result":rests.length,
        // "requested at":req.requestTime,
        data:{
            rests
        }
    })

})

exports.getRest=catchAsync(async(req,res,next)=>{
    const rest=await Rest.findById(req.params.id);
    if(!rest) 
    return next(new AppError("No rest exists with the given Id", 404));
    res.status(200).json({
        message:"success",
        rest:rest
    })
})

//only the admin can do this task
exports.deleteRest=catchAsync(async(req,res,next)=>{
    const doc=await Rest.findByIdAndDelete(req.params.id);
    if(!doc)
    return next(new AppError("No rest exists with the given Id", 404));
    res.status(200).json({
        message:"success"
    })
})

exports.updateMe=catchAsync(async(req,res,next)=>{
  if(req.body.password||req.body.confirmPassword)
  {
    return next(new AppError('This route is not for password updates',400));
  }
  const filteredBody=filterObj(req.body,'name','email','phone');
  if(req.file)
  {
    filteredBody.photo=req.file.filename;// we got the req.file.filename from the resiezeRestPhoto
  }
  const updatedRest = await Rest.findByIdAndUpdate(req.rest.id,filteredBody,{
    new:true,
    runValidators:true
  })
  res.status(200).json({
    message:"success",
    rest:updatedRest
  })
// console.log("yos")
// res.status(200).json({
//     message:"helloo"
// })
})

exports.deleteMe=catchAsync(async(req,res,next)=>{
    await Rest.findByIdAndUpdate(req.rest.id,{active:false});
    res.status(204).json({
        message:"success",
        data:null
    })
})

//need to add the updated photo middleware

//creating storage for multer
const multerStorage = multer.memoryStorage();

//to only allow the image type to enter
const multerFilter = (req,file,cb)=>{
    if(file.mimetype.startsWith('image')){
        cb(null,true)
    }
    else{
        cb(new AppError('Not an image!! Please upload the images only.',400),false);
    }
};

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
})

exports.uploadRestPhoto = upload.single('photo');



exports.resizeRestPhoto =catchAsync( async (req,res,next)=>{
    if(!req.file) return next();
    req.file.filename = `rest-${req.rest.id}-${Date.now()}.jpeg`
    //note: here we are using the await because the resizing and all these process happen in the background becoz they take a lot of time
    // and since we are calling next in this middleware it is not good practice, it might be possible that next is called first before the file is uploaded
    await sharp(req.file.buffer).resize(500,500)
    .toFormat('jpeg').jpeg({quality:90})
    .toFile(`public/img/to-rest/${req.file.filename}`);
    next();
});