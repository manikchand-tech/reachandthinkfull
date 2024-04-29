import React, { useState, useEffect } from 'react';
import './UserProfile.css'; // Import your CSS file for styling
import profilesvg from '../images/profileplaceholder.svg';
import axios from 'axios'; // Import Axios
import { useParams } from 'react-router-dom';
import { useAuth } from './AuthContext';
import VendorProduct from './VendorProduct';
import StarRating from './StarRating';
import VendorReviewPage from './VendorReview';
const VendorProfilePage = () => {
    const {rntId}=useAuth();
    const {userType}=useAuth();
    
    const { id } = useParams();
    
    // const { rntId } = useAuth();
    // const { userType } = useAuth();
     const [userData, setUserData] = useState(null);
    // const [editMode, setEditMode] = useState(false);
    // const loginEndpoint = userType === 'customer' ? `customers/${rntId}` : `vendors/${rntId}`;
    // const initialUserData = { ...userData };
    useEffect(() => {
        axios.get(`http://localhost:3000/vendors/${id}`)
            .then(response => setUserData(response.data))
            .catch(error => console.error('Error fetching data:', error));
    }, [id]); // Add loginEndpoint as a dependency to useEffect

   
   

    const renderBusinessAddress = (address) => {
        return (
            <>
                <div className="boxall">
                    <span className="value">District</span>
                    <span className="parameter">{address.district}</span>
                </div>
                <div className="boxall">
                    <span className="value">City</span>
                    <span className="parameter">{address.city}</span>
                </div>
                {/* Add more fields as needed */}
            </>
        );
    };


    return (
   <>
            <div className="left-sidebar reviews-section">
       {userType==='customer' &&(
         
            <div><h2>Rate and Review</h2>  
             <h3>Rate this vendor:</h3>  
             <StarRating vendorId={id} customerId={rntId}  />  
             
             </div>
        )}
                
             
            </div>
    
        <div className={`user-profile-container`}>
  
            <h2>Profile</h2>
            {userData && (
                <div className="main">
                    <div className="profile">
                        <div className="pro-im-na">
                            <div className="img">
                                {userData.vendorImage ? (
                                    <img src={userData.vendorImage} alt="Profile" />
                                ) : (
                                    <svg className='svg-icon'>{profilesvg}</svg>
                                )}
                            </div>
                            <div className="name">{userData.name}</div>
                            <div className="username">UserName: {userData.username}</div>
                            <div className="email">Email: {userData.email}</div>
                        </div>
                        <div className="alltion">
                            <button className="btn">Follow</button>
                            <button className="btn">Message</button>
                        </div>
                    </div>

                    <div className="viwer">
                        <div className="boxall">
                            <span className="value">Role</span>
                            <span className="parameter">{userData.role}</span>
                        </div>
                        <div className="boxall">
                            <span className="value">Preferences</span>
                            <span className="parameter">{userData.preferences}</span>
                        </div>
                        <div className="boxall">
                            {userData.role === 'customer' ? (
                                <>
                                    <span className="value">Location</span>
                                    <span className="parameter">{userData.location}</span></>
                            ) : (
                                <>
                                    <span className="value">Business Address</span>
                                    {/* Call the render function with the businessAddress object */}
                                    {renderBusinessAddress(userData.businessAddress)}
                                </>
                            )}

                        </div>





                    </div>
                   


                </div>
               

            )}
           
           <div className='vendorproduct'><VendorProduct vendorId={id}/></div>
        </div>
        
        
        </>
      
    );
};

export default VendorProfilePage;
