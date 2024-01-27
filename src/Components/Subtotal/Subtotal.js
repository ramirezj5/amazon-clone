import React from 'react';
import CurrencyFormat from 'react-currency-format';
import './Subtotal.css';
import { useStateValue } from '../../Services/StateProvider';
import { getBasketTotal } from '../../Reducers/reducer';
import { useNavigate } from 'react-router-dom'; 

function Subtotal() {

  const navigate = useNavigate();
  const [{basket}, dispatch] = useStateValue();
  return (
    <div className='subtotal'>
        <CurrencyFormat
        renderText =  {(value) => (
            <> 
            <p>
                Subtotal ({basket?.length}): <strong>{value}</strong>
            </p>
            <small className='subtotal_gift'>
                <input type='checkbox'/>
                This order contains a gift
            </small>
            </>
        )}
        decimalScale={2}
        value={getBasketTotal(basket)}
        displayType={'text'}
        thousandSeparator={true}
        prefix={'$'}
        />
           
        <button onClick={() => navigate('/payment')}>Proceed to Checkout</button>


    </div>
  )
}

export default Subtotal