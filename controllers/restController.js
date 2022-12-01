const AppError = require("../utils/AppError");
const { findByIdAndUpdate } = require("../models/restModel");
const Rest = require('../models/restModel');
const APIFeatures = require('../utils/apifeatures');
const slugify=require('slugify')
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

exports.updateMenu=catchAsync(async(req,res,next)=>{
        const rest=await Rest.findOne({_id:req.rest._id},{});
        const menu=rest.menu;
        let i;
        for(i=0;i<menu.length;i++)
        {
            if(menu[i].menu_heading==req.body.c_name)
            break;
        }
        if(i==menu.length)
        {
        menu.push({"menu_heading":req.body.c_name})
        }
        menu[i].meals.push({"meal_name":req.body.m_name,"price":req.body.m_price,"meal_photo":req.body.m_photo})
        await Rest.findByIdAndUpdate({_id:req.rest._id},{menu:menu})
        res.status(200).json({
            status: 'success'
        })

})


exports.manageMenu=catchAsync(async(req,res,next)=>{
    const rest=await Rest.findOne({_id:req.body.restId});
    const menu=rest.menu;
    let i;
    for(i=0;i<menu.length;i++)
    {
        if(menu[i]._id==req.body.menuId)
        break;
    }
    const meals =menu[i].meals;
    // console.log(meals)
    const filteredMeals = meals.filter((item)=>item.id !== req.body.mealId)
    // console.log(filteredMeals)
    menu[i].meals=filteredMeals
    console.log(menu[i].meals)
    await Rest.findByIdAndUpdate(req.body.restId,{menu:menu})
    res.status(200).json({
        status:"success"
    })
})



exports.getRest=catchAsync(async(req,res,next)=>{
    const rest=await Rest.find({slug:req.params.slugi});
    if(!rest) 
    return next(new AppError("No rest exists with the given slug", 404));
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
  if(filteredBody.name)
  filteredBody.slug=slugify(filteredBody.name,{lower:true});
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

exports.getMe=catchAsync(async(req,res)=>{
    const rest=await Rest.findById(req.rest.id);
    res.status(200).json({
        massage:"status",
        data:{
            rest
        }
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
    req.file.filename = `meal-${req.rest.id}-${Date.now()}.jpeg`
    //note: here we are using the await because the resizing and all these process happen in the background becoz they take a lot of time
    // and since we are calling next in this middleware it is not good practice, it might be possible that next is called first before the file is uploaded
    await sharp(req.file.buffer).resize(500,500)
    .toFormat('jpeg').jpeg({quality:100})
    .toFile(`public/img/meals_photo/${req.file.filename}`);
    next();
});