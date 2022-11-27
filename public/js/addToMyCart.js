import { showAlert } from './alerts'
import axios from 'axios'

export const addToCart = async(foodId,menuId,restId,userId)=>{
    try{
        const result = await axios({
            method: 'POST',
            url: 'http://127.0.0.1:3000/api/v1/restaurants/addToCart',
            data:{
                foodId,
                menuId,
                restId,
                userId
            }
        })
        if(result.data.status==='success'){
            // alert('Logged in successfully');
            showAlert('success','Added to cart successfully');
        }
    }catch(err){
        showAlert('error',err.response.data.message)
    }
}