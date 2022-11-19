import axios from 'axios'
import { showAlert } from './alerts'

export const bookFood = async foodId => {
    try{
        const stripe = Stripe('pk_test_51LRN6xSIAQC8rt2pAtsGiBlQnjJYAZPnV0M6HCCJn6qBwFbry9DgvdZVWjq3rc2PPrloDJJEpfVZW7MtvqGZAlmn00R0qBaYLB')
    //     // 1) Get checkout session from API
    const session = await axios(`http://localhost:3000/api/v1/booking/checkout-session/784545`)
    // // 2) Create checkout form + charge credit card
    await stripe.redirectToCheckout({
        sessionId: session.data.session.id
      });
    }catch (err) {
        // console.log(err);
        showAlert('error', err);
      }
}
  
    