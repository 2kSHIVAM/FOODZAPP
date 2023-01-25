import { showAlert } from './alerts'
import axios from 'axios'

export const addTicky = async(foodId,restId)=>{
    try{
        const result = await axios({
            method: 'POST',
            url: 'http://127.0.0.1:3000/api/v1/restaurants/addTick',
            data:{
                foodId,
                restId
            }
        })
        if(result.data.status==='success'){
            // alert('Logged in successfully');
            showAlert('success','Orders updated successfully');
            window.setTimeout(()=>{
                location.assign('/my-orders-rest');
            },1500);
            //to do
            //after sometime reload the page
        }
    }catch(err){
        showAlert('error',err.response.data.message)
    }
}