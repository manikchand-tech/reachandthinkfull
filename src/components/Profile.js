import React from 'react';
import { useAuth } from './AuthContext';
import Login from './Login';
import { Link } from 'react-router-dom';
import './Profile.css'
import UserProfile from './userProfile';
import VendorProduct from './VendorProduct';

const Profile = () => {
  const { isLoggedIn, userType, rntId } = useAuth();

  return (
    <div className='Home-Content'>
      {isLoggedIn ? (
        <>
          <div className="container">
           
            <div className="user-profile-container">
              <UserProfile />
            </div>
            {userType === 'vendor' && (
              <div className="vendor-product-container">
                <VendorProduct vendorId={rntId} />
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <Login />
          <div className="home-signup" style={{ textAlign: 'center', margin: '1rem' }}>
            <p>Not registered?</p>
            <Link to="/vendor-signup" className="signup-link">Sign up as Vendor</Link>
            <Link to="/customer-signup" className="signup-link">Sign up as Customer</Link>
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;
