import { login,logout } from './login_logout'
import '@babel/polyfill'
import {signup} from './signup'
// import { displayMap } from './mapbox'
import { updateSettings } from './updateSettings'
// import { bookTour } from './stripe';
const User = require('../../models/userModel');
const Rest = require('../../models/restModel');


// DOM ELEMENTS
// const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');// until some one click on submit it will not activate 
const logOutBtn = document.querySelector('.nav__el--logout');
const signupForm = document.querySelector('.form--signup');// until some one click on submit it will not activate 

const userDataForm = document.querySelector('.form-user-data')
const userPasswordForm = document.querySelector('.form-user-password')
// const bookBtn = document.querySelector('#book-tour');

//VALUES



//DELEGATION
// if(mapBox){
//     const locations = JSON.parse(document.getElementById('map').dataset.locations);
//     displayMap(locations);
// }

if(loginForm)
    addEventListener('submit',e=>{
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    // let data;
    // catchAsync(async(req,res,next)=>{
    //   const user = await User.findOne({email:email})
    //   if(user)
    //   data='User'
    //   const rest = await Rest.findOne({email:email})
    //   if(rest) 
    //   data='Rest'
    // })
    // console.log(data)
    login(email,password);
})

if(signupForm)
    addEventListener('submit',e=>{
    e.preventDefault();
    const name=document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    signup(name,email,password,confirmPassword);
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


// if (bookBtn){
//   // console.log("hello from btn")
//   bookBtn.addEventListener('click', e => {
//     e.target.textContent = 'Processing...';
//     const tourId = e.target.dataset.tourId;
//     bookTour(tourId);
//   });

// }