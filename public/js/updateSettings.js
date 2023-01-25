import axios from 'axios'
import { showAlert } from './alerts'

// data will be a object
// type will tell whether it is for password change or data update
export const updateSettings = async(data,type)=>{
    try{
        const url = '/api/v1/users/updateMe'
        const result = await axios({
            method: 'PATCH',
            url,
            data
        });

        if(result.data.status==='success'){
            // alert('Logged in successfully');
            showAlert('success','Data updated successfully');
            window.setTimeout(()=>{
                location.assign('/me-user');
            },1500);
        }


    }catch(err){
        // alert(err.response.data.message);
        showAlert('error',err.response.data.message);
    }
}