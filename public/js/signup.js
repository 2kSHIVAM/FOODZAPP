import axios from 'axios'
import { showAlert } from './alerts'
export const signup = async (name,email,password,confirmPassword)=>{
    try{
        const result = await axios({
            method: 'POST',
            url: '/api/v1/users/signup',
            data:{
                name,
                email,
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
