import React, { useState,useEffect} from 'react'
import './Payment.css'
import { useStateValue } from '../../Services/StateProvider'
import CheckoutProduct from '../Checkout/Product/CheckoutProduct';
import { Link, useNavigate } from 'react-router-dom';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import CurrencyFormat from 'react-currency-format';
import { getBasketTotal } from '../../Reducers/reducer';
import axios from "../../Axios";
import {db} from '../../firebase';
import { doc, setDoc } from "firebase/firestore"; 


export default function Payment() {

    const [{basket, user}, dispatch] = useStateValue();
    const [error,setError] = useState(null);
    const [disabled, setDisabled]= useState(true);
    const [processing,setProcessing] = useState(null);
    const [succeeded, setSucceeded]= useState(false);
    const [clientSecret, setClientSecret] = useState(true);

    const history = useNavigate();

    // this is dependent on basket changing 
    useEffect(()=> {
        // generate the special strip secret which allows us to charge a custoemr 

        // stripe expects the total in a currencies subunits 
        const getClientSecret = async () => {
            
            const response = await axios({
                method:'post',
                url: `/payments/create?total=${getBasketTotal(basket) * 100}`
            })
            setClientSecret(response.data.clientSecret);
        }
        getClientSecret();
     

    }, [basket])

    console.log('THE SECRET', clientSecret)

    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (event) => {
        // Do the fancy stripe stuff 
        event.preventDefault();
        setProcessing(true);

        const payload = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement)
            }
        }).then(async ({paymentIntent}) => {
            // essentially payment confirmation 

            await setDoc(doc(db,"users", user?.uid, "orders", paymentIntent.id),{basket: basket, 
                    amount:paymentIntent.amount,
                    created:paymentIntent.created});
    
            setSucceeded(true);
            setError(null);
            setProcessing(false);

            dispatch({
                type: 'EMPTY_BASKET'
            })

            history('/orders', {replace:true});
        })
    }

    const handleChange = event => {
        // Listen for changes in the cardElement 
        // Set any errors as the customer types their card details 
        setDisabled(event.empty);
        setError(event.error ? event.error.message : "");
    }

    return (
        <div className='payment'>
            <div className='payment_container'>
                <h1>
                    Checkout (<Link to="/checkout"> {basket?.length} items</Link>)
                </h1>
                <div className='payment_section'>
                    <div className = 'payment_title'>
                        <h3> Delivery Address </h3>
                    </div>
                 
                    <div className='payment_address'>
                        <p> {user?.email}</p>
                        <p>123 React Lane</p>
                        <p>Los Angeles, CA</p>
                    </div>
                </div>    
                <div className='payment_section'>
                <div className = 'payment_title'>
                        <h3> Review items and delivery </h3>
                    </div>
                    <div className='payment_items'>
                        {basket.map(item => (
                            <CheckoutProduct
                                id= {item.id}
                                title = {item.title}
                                image={item.image}
                                price={item.price}
                                rating={item.rating}
                            />
                        ))}
                    </div>
                </div>
                {/* Payment Section - Payment Method*/}
                <div className='payment_section'>
                    <div className = 'payment_title'>
                        <h3>Payment Method</h3>
                    </div>
                    <div className='payment_details'>
                        <form onSubmit={handleSubmit}>
                            <CardElement onChange={handleChange}/>
                            <div className='payment_priceContainer'>
                                <CurrencyFormat
                                renderText={(value) => (
                                    <h3>
                                        Order Total: {value}
                                    </h3>
                                )}
                                decimalScale={2}
                                value = {getBasketTotal(basket)}
                                displayType={"text"}
                                thousandSeparator={true}
                                prefix={"$"}
                                />
                                <button disabled={processing || disabled || succeeded}>
                                    <span>{processing? <p>Processing</p>: 'Buy Now'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                    
                </div>    
                
                
            
            </div>    
            

        </div>
    )
}
