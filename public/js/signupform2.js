import { showAlert } from './alerts'
import axios from 'axios'

export const signup2 = async (c_name,m_name,m_price,m_photo)=>{
        try{
            const result = await axios({
                method: 'POST',
                url: '/api/v1/restaurants/signup2',
                data:{
                    c_name,
                    m_name,
                    m_price,
                    m_photo
                }
            });
            if(result.data.status==='success'){
                // alert('Logged in successfully');
                showAlert('success','Data loaded successfully');
                window.setTimeout(()=>{
                    location.assign('/signup2-menu');
                },1500);
            }
            else{
                console.log("hellish pain")
            }
        }
        catch(err){
            showAlert('error',err.response.data.message)
        }
    
}
