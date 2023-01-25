const Cart =require('./../models/cartModel');
const AppError = require("../utils/AppError");
const catchAsync = require('./../utils/catchError');
const multer = require('multer');
const sharp = require('sharp');
const Rest = require('./../models/restModel')
const User = require('./../models/userModel')

exports.addToCart=catchAsync(async(req,res)=>{
    const rest=await Rest.find({_id:req.body.restId})
    
    console.log(rest[0])
    const menu=rest[0].menu
    let i
    for(i=0;i<menu.length;i++)
    {
        if(menu[i]._id==req.body.menuId)
        break;
    }
    const meals=menu[i].meals
    let j
    for(j=0;j<meals.length;j++)
    {
        if(meals[j]._id==req.body.foodId)
        break;
    }
    
    const meal=meals[j]
    const m_name=meal.meal_name
    const m_price=meal.price
    const m_photo=meal.meal_photo
    const user=await User.findOne({_id:req.body.userId})
    const ans = await Cart.findOne({user:user})
    if(ans!=null)
    {
        const id = ans._id
        const food=ans.meals
        let k
        for(k=0;k<food.length;k++)
        {
            if(food[k].name==m_name)
            {
                food[k].quantity+=1
                break
            }
        }
        if(k==food.length){
        food.push({"name":m_name,"price":m_price,"quantity":1,"meal_photo":m_photo})
        }
        await Cart.findByIdAndUpdate({_id:id},{meals:food})
        res.status(200).json({
            status: 'success'
        })
    }
    else{
        const cart = await Cart.create({
        user:user,
        rest:rest[0],
        meals:{
            name:m_name,
            price:m_price,
            quantity:1,
            meal_photo:m_photo
        }
    })
    }
    res.status(200).json({
        status:"success"
    })
})
exports.getCart=catchAsync(async(req,res)=>{
    const cart = await Cart.find({user:req.user});
    res.status(200).json({
        message:"success",
        cart:cart
    })
})


// took help form the stackoverflow
exports.emptyCart=catchAsync(async(req,res)=>{
    const cart = await Cart.deleteMany();
    await Cart.findByIdAndDelete(cart.id);
    res.status(200).json({
        message:"success",
        data:null
    })
})

exports.removeItems=catchAsync(async(req,res)=>{
    const user=await User.findOne({_id:req.body.userId})
    const cart = await Cart.findOne({user:user})
    const meals=cart.meals
    const id=cart._id
    let i
    for(i=0;i<meals.length;i++)
    {
        if(meals[i]._id==req.body.mealId)
        break;
    }
    if(meals[i].quantity>1)
    {
        meals[i].quantity-=1
        await Cart.findByIdAndUpdate(id,{meals:meals})
        res.status(200).json({
        status:"success"
    })}
    else if(i==0&&meals[i].quantity==1&&meals.length==1)
    {
        await Cart.findByIdAndDelete(id);
        res.status(200).json({
            status:"success"
        })
    }
    else{
    const filteredMeals = meals.filter((item)=>item.id !== req.body.mealId)
    await Cart.findByIdAndUpdate(id,{meals:filteredMeals})
    res.status(200).json({
        status:"success"
    })
    }
    
})