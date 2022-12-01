import { showAlert } from './alerts'
import axios from 'axios'

export const deleteMeal = async(mealId,menuId,restId)=>{
    try{
        const result = await axios({
            method: 'POST',
            url: 'http://127.0.0.1:3000/api/v1/restaurants/manageMenu',
            data:{
                mealId,
                menuId,
                restId
            }
        })
        if(result.data.status==='success'){
            // alert('Logged in successfully');
            showAlert('success','Menu updated successfully');
            window.setTimeout(()=>{
                location.assign('/manageMenu');
            },1500);
            //to do
            //after sometime reload the page
        }
    }catch(err){
        showAlert('error',err.response.data.message)
    }
}