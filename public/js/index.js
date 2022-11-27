import { login,logout } from './login_logout'
import { signup2 } from './signupform2'
import {addToCart} from './addToMyCart'
import {addTicky} from './addTick'

import '@babel/polyfill'
import {signup,signupRest} from './signup'
// import { displayMap } from './mapbox'
import { updateSettings } from './updateSettings'
import { bookFood } from './stripe'
// import { bookTour } from './stripe';
const User = require('../../models/userModel');
const Rest = require('../../models/restModel');
const catchAsync = require('../../utils/catchError');

// async function check(email){
//   const user = await User.find({email:email})
//   if(user)
//   return 'User'
//   const rest = await Rest.findOne({email:email})
//   if(rest) 
//   return 'Rest'
// }
// DOM ELEMENTS
// const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');// until some one click on submit it will not activate 
const logOutBtn = document.querySelector('.nav__el--logout');
const signupForm = document.querySelector('.form--signup');// until some one click on submit it will not activate 
const signupForm2 = document.querySelector('.signup-form2');
const userDataForm = document.querySelector('.form-user-data')
const userPasswordForm = document.querySelector('.form-user-password')
const bookBtn = document.getElementById('book-food')
const addCart = document.getElementById('addCarty')
const addTickk = document.getElementById('addTick')


//VALUES



//DELEGATION
// if(mapBox){
//     const locations = JSON.parse(document.getElementById('map').dataset.locations);
//     displayMap(locations);
// }


const data='Rest' // we will make a page to choose from login for user or rest 
// depending on that we will change the data value

if(signupForm2)
    addEventListener('submit',e=>{
      e.preventDefault();
      const c_name=document.getElementById('category_name').value
      const m_name=document.getElementById('meal_name').value
      const m_price=document.getElementById('meal_price').value
      const m_photo=document.getElementById('meal_photo').value
      // console.log(hno)
      // console.log(m_name)
      // console.log(m_price)
      signup2(c_name,m_name,m_price,m_photo)
})


if(loginForm)
    addEventListener('submit',e=>{
    e.preventDefault();
    const email = document.getElementById('email').value;
    
    const password = document.getElementById('password').value;
    const choice = document.getElementById('choice');
    const choice2 = document.getElementById('choice2')
    if(choice.checked==true && choice2.checked==true)
    {
      login(email,password,'hola')
    }
    else if(choice.checked==true)
    login(email,password,'Rest')
    else if(choice2.checked==true)
    login(email,password,'User')
    // const data=check(email)
    // console.log(choice)
    // login(email,password,choice)
})

if(signupForm)
    addEventListener('submit',e=>{
    e.preventDefault();
    if(data=='User')
    {
    const name=document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone =document.getElementById('phone').value;
    const role = document.getElementById('role').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    signup(name,email,phone,role,password,confirmPassword);
    }
    else if(data=='Rest')
    {
      const name=document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const phone =document.getElementById('phone').value;
      const role = document.getElementById('role').value;
      const greeting = document.getElementById('greeting').value;
      const title = document.getElementById('title').value;
      const message = document.getElementById('message').value;
      const city = document.getElementById('city').value;
      const country = document.getElementById('country').value;

      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirmPassword').value;

      const choice1 = document.getElementById('choice1');
      const choice2 = document.getElementById('choice2');
      if(choice1.checked==true)
      {
        signupRest(name,email,phone,role,greeting,title,message,city,country,password,confirmPassword,"template1");
      }
      else if(choice2.checked==true){
        signupRest(name,email,phone,role,greeting,title,message,city,country,password,confirmPassword,"template2");
      }
      // signup(name,email,phone,role,password,confirmPassword,data);
  
    }
})

if(logOutBtn) logOutBtn.addEventListener('click',logout);

if (userDataForm)
  userDataForm.addEventListener('submit', e => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);
    // console.log(form);

    updateSettings(form, 'data');
  });



  // note we need the add the event listener for when the user clicks on place order and will make the payment then the place order of the user has to be called 

// if(userPasswordForm)
// {
//     userPasswordForm.addEventListener('submit',async e=>{
//         e.preventDefault();

//         document.querySelector('.btn--save-password').textContent='Updating...';

//         const passwordCurrent = document.getElementById('password-current').value;
//         const password = document.getElementById('password').value;
//         const passwordConfirm = document.getElementById('password-confirm').value;
    
//         await updateSettings({passwordCurrent,password,passwordConfirm},'password');
//         document.querySelector('.btn--save-password').textContent='Save password';
//         document.getElementById('password-current').value='';
//         document.getElementById('password').value='';
//         document.getElementById('password-confirm').value='';
//     })
// }

if (bookBtn){
  // console.log('hello')
  bookBtn.addEventListener('click', e => {
    e.target.textContent = 'Processing...';
    const foodId = e.target.dataset.foodId;
    bookFood(foodId);
  });
}


if(addCart)
  addEventListener('click',e=>{
    // e.preventDefault();
    // const restName=document.getElementById('restName').value

    // const photo = document.getElementById('photo').value;
    // const name = document.getElementById('name').value;
    // const price = document.getElementById('price').value;
    // const quantity = document.getElementById('quantity').value;
    // console.log(restName)
    const ids=e.target.dataset.foodId;
    const myarray=ids.split(",")
    console.log(myarray)

    addToCart(myarray[0],myarray[1],myarray[2],myarray[3])
    // console.log(e.target.dataset.foodId)
  })

  if(addTickk)
  addEventListener('click',e=>{
    // e.preventDefault();
    // const restName=document.getElementById('restName').value

    // const photo = document.getElementById('photo').value;
    // const name = document.getElementById('name').value;
    // const price = document.getElementById('price').value;
    // const quantity = document.getElementById('quantity').value;
    // console.log(restName)
    const id=e.target.dataset.foodId;
    const myarray=id.split(",")
    // console.log(myarray)

    addTicky(myarray[0],myarray[1])

    // addTicky(id)
    // console.log(e.target.dataset.foodId)
  })
