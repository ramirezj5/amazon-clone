import './App.css';
import Header from './Components/Header/Header';
import Home from './Components/Home/Home';
import Checkout from './Components/Checkout/Checkout';
import Payment from './Components/Payment/Payment';
import Orders from './Components/Orders/Orders';
import { BrowserRouter as Router, Route,Routes, Navigate} from 'react-router-dom';
import Login  from './Components/Login/Login'
import { useEffect } from 'react';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useStateValue } from './Services/StateProvider';
import { loadStripe } from '@stripe/stripe-js';
import {Elements} from '@stripe/react-stripe-js';

const promise = loadStripe(process.env.REACT_APP_STRIPE_KEY);

function App() {
  const [{},dispatch] = useStateValue();
  useEffect(()=>{
    // will only run once when the app component loads, [] contains the condition that will trigger the useEffect
    onAuthStateChanged(auth, (user)=> {
      console.log('The user is ',user);
      if(user){
        //user is logged in 
        dispatch({
          type:'SET_USER',
          user: user
        })
      }
      else {
        //the user is logged out
        dispatch({
          type:'SET_USER',
          user:null
        })
      }
    })
  }, [])
  return (
    <Router>
      <div className="App">
        <Routes>
         <Route path='/login' element= {<> 
            <Login/>
          </>}/>
          <Route path='/checkout' element= {<> 
            <Header/>
            <Checkout/>
          </>}/>
          <Route path='/payment' element= {<>
            <Header/>
            <Elements stripe={promise}>
              <Payment/>
            </Elements>
            </>}/>
          <Route path='/orders' element= {<> 
            <Header/>
            <Orders/>
          </>}/>
          <Route path='*' element={<Navigate to="/" />} />
          <Route path='/' element= {<> 
            <Header/>
            <Home/>
          </>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
