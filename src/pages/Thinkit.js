import React from 'react';
import Signup from '../components/Signup';
import SearchSection from '../components/SearchSection';
import { Link } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import Login from '../components/Login';
import './Home.css';
const Thinkit = () => {const { isLoggedIn } = useAuth();
return (
    <div className='home-content'>
       <h1>Thinkit</h1>
       {isLoggedIn ? (
           <> <p>Welcome, you are logged in!</p>
            <SearchSection/>
            </>  ) : (
           <>
            <Login/>
      <div className="home-signup" >
            <p>Not registered?</p>
            <Link to="/vendor-signup" className="signup-link">Sign up as Vendor</Link>
            <Link to="/customer-signup" className="signup-link">Sign up as Customer</Link>
        </div>
        </> 
        )}
       
    </div>
);
}

export default Thinkit;
