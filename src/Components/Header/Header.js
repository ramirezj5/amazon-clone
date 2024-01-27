import React from 'react'
import './Header.css';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import { Link } from 'react-router-dom';
import { useStateValue } from '../../Services/StateProvider';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';

function Header() {
  const [{basket, user}, dispatch] = useStateValue();

  // handle sign in/sign out 
  const handleAuthentication = () =>{
    if(user){
      signOut(auth);
    }
  }

  return (
    <div className='header'>
      <Link to='/'>
      <img className= 'header_logo' src='http://pngimg.com/uploads/amazon/amazon_PNG11.png' alt=''>
      </img>
      </Link>
      <div className='header_search'>
        <input
        className='header_search_input'
        type='text'>
        </input>
        <SearchIcon className='header_search_icon'/>
      </div>

      <div className='header_nav'>
        <Link to={!user && '/login'}>
        <div onClick={handleAuthentication}className='header_option'>
          <span className='header_option_line_one'>
            Hello {user ? user.email : 'Guest'}
          </span>
          <span className='header_option_line_two'>
            {user ? 'Sign Out': 'Sign In'}
          </span>
        </div>
        </Link>
        <div className='header_option'>
          <span className='header_option_line_one'>
            Returns
          </span>
          <span className='header_option_line_two'>
            & Orders
          </span>
        </div>
        <div className='header_option'>
          <span className='header_option_line_one'>
            Your 
          </span>
          <span className='header_option_line_two'>
            Prime
          </span>
        </div>
        
        <Link to='/checkout'>
          <div className='header_option_basket'>
            <ShoppingBasketIcon/>
            <span className='header_option_line_two_basket_count'>{basket?.length}</span>
          </div>
        </Link>
      </div>
    </div>
  )
}

export default Header