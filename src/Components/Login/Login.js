import React, {useState} from 'react'
import { Link, useNavigate} from 'react-router-dom'
import './Login.css';
import { auth } from '../../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword} from 'firebase/auth';

function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const signIn = e => {
        // prevents refreshing 
        e.preventDefault()

        // firebase stuff happens here
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            navigate('/');
            // Signed in 
            
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert(errorMessage);
        });
    }

    const register = e =>{
        e.preventDefault();
        createUserWithEmailAndPassword(auth, email, password)
        .then((auth) => {
            // it successfully created a new user with email and password
            if(auth){
                navigate('/')
            }
        })
        .catch(error => alert(error.message))

        //do some fancy firebase register stuff
    }
    return (
        <div className='login'>
            <Link to='/'>
                <img 
                    className='login_logo'
                    src='https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/1024px-Amazon_logo.svg.png'
                >
                </img>
            </Link>

            <div className='login_container'>
                <h1>Sign-in</h1>
                <form>
                    <h5>E-mail</h5>
                    <input type='text' value={email} onChange={e => setEmail(e.target.value)}></input>
                    <h5>Password</h5>
                    <input type='password' value={password} onChange={e => setPassword(e.target.value)} ></input>
                    <button type='submit' onClick={signIn} className='login_signInButton'>Sign In</button>
                </form>

                <p> By signing-in you agree to the AMAZON FAKE CLONE conditions of Use & Sale. 
                    Please see our Privacy Notice, our Cookies Notice and our Interest-Based Ads Notice
                    and our Interest-Based Ads Notice,</p>
                
                <button onClick={register} className='login_registerButton'>
                    Create your Amazon Account
                </button>
            </div>
        </div>
    )
}

export default Login