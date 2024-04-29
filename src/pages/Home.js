import React from 'react';
import { Link } from 'react-router-dom';
import Login from '../components/Login';
import './Home.css'; // Import the CSS file
import { useAuth } from '../components/AuthContext';
const Home = () => {
    const { isLoggedIn } = useAuth();
    return (
       
        <div className="home-container">
            <div className="home-content">
                <h1 className="home-title">Welcome to Reach&Think</h1>
                <p className="home-description">Find quality products from local vendors and shopkeepers.</p>
                {isLoggedIn ? (
                <p>Welcome, you are logged in!</p>
            ) : (
               <>
                <Login/>
          <div className="home-signup">
                <p>Not registered?</p>
                <Link to="/vendor-signup" className="signup-link">Sign up as Vendor</Link>
                <Link to="/customer-signup" className="signup-link">Sign up as Customer</Link>
            </div>
            </> 
            )}
                
            </div>
        </div>
    );
}

export default Home;
