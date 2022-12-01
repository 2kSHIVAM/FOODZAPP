import { showAlert } from './alerts'
// import axios from 'axios'

export const viewDetailPage = async(id)=>{
    try{
            // alert('Logged in successfully');
            showAlert('success','Loading Details ');
            window.setTimeout(()=>{
                location.assign(`/my-orders-details/${id}`);
            },1500);
            //to do
            //after sometime reload the page
    }catch(err){
        showAlert('error',err.response.data.message)
    }
}