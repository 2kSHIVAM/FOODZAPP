import axios from 'axios'
import { showAlert } from './alerts'
export const login = async (email,password,data)=>{
    // let result
    // console.log(data)
    try{
        let result
        if(data==='Rest'){
            result = await axios({
                method: 'POST',
                url: '/api/v1/restaurants/login',
                data:{
                    email,
                    password
                }
            });
        }
        else if(data==='User')
        {
            result = await axios({
                method: 'POST',
                url: '/api/v1/users/login',
                data:{
                    email,
                    password
                }
            });
        }
        

        if(result.data.status==='success'){
            // alert('Logged in successfully');
            showAlert('success','Logged in successfully');
            window.setTimeout(()=>{
                location.assign('/');
            },1500);
        }


    }catch(err){
        // alert(err.response.data.message);
        showAlert('error',err.response.data.message);
    }
}

export const logout = async ()=>{
    try{
        const result = await axios({
            method: 'GET',
            url: '/api/v1/users/logout',
            
        })
        if(result.data.status='success')
        location.reload(true);
    }catch(err){
        showAlert('error','Error logging out!! Try again.');
    }
}