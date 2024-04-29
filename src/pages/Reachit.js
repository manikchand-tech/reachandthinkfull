import React from 'react';
import SearchSection from '../components/SearchSection';
import Login from '../components/Login';
import { useAuth } from '../components/AuthContext';
import { Link } from 'react-router-dom';
import './Home.css'
const Reachit = () => {
    const { isLoggedIn } = useAuth();
    return (
        <div className='home-content'>
           <h1>Reachit</h1>
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

export default Reachit;
