import axios from 'axios'
import { showAlert } from './alerts'
export const signup = async (name,email,phone,role,password,confirmPassword)=>{
    try{
        let result
            result = await axios({
                method: 'POST',
                url: '/api/v1/users/signup',
                data:{
                    name,
                    email,
                    phone,
                    role,
                    password,
                    confirmPassword
                }
            });
        if(result.data.status==='success'){
            // alert('Logged in successfully');
            showAlert('success','Signed up successfully');
            window.setTimeout(()=>{
                location.assign('/');
            },1500);
        }


    }catch(err){
        // alert(err.response.data.message);
        showAlert('error',err.response.data.message);
    }
}




export const signupRest = async (name,email,phone,role,greeting,title,message,city,country,password,confirmPassword,choice)=>{
    try{
        let result
            result = await axios({
                method: 'POST',
                url: '/api/v1/restaurants/signup',
                data:{
                    name,
                    email,
                    phone,
                    role,
                    greeting,
                    title,
                    message,
                    city,
                    country,
                    password,
                    confirmPassword,
                    choice
                }
            });
        if(result.data.status==='success'){
            // alert('Logged in successfully');
            showAlert('success','Signed up successfully');
            window.setTimeout(()=>{
                location.assign('/');
            },1500);
        }


    }catch(err){
        // alert(err.response.data.message);
        showAlert('error',err.response.data.message);
    }
}
