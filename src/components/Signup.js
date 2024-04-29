import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './signup.css';

import axios from 'axios';

const Signup = () => {

    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        vendorName: '',
        username: '',
        email: '',
        password: '',
        businessName: '',
        businessAddress: {
            addressLine1: '',
            addressLine2: '',
            city: '',
            district: '',
            state: '',
            country: ''
        },
        businessType: '',
        contactNumber: '',
       
    });
    const [alertMessage, setAlertMessage] = useState('');
   
       
      
    

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('businessAddress')) {
            const [, field] = name.split('.');
            setFormData(prevState => ({
                ...prevState,
                businessAddress: {
                    ...prevState.businessAddress,
                    [field]: value
                }
            }));
        } else {
            setFormData(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const { vendorName, username, email, password, businessName, businessAddress, businessType, contactNumber } = formData;
    
        try {
            // Check if username is unique
            const uniqueUsernameResponse = await axios.get(`http://localhost:3000/vendors/checkUsername/${username}`);
            if (!uniqueUsernameResponse.data.isUnique) {
                setAlertMessage('Username is already taken.');
                return;
            }
    
            // Check if email is unique
            const uniqueEmailResponse = await axios.get(`http://localhost:3000/vendors/checkEmail/${email}`);
            if (!uniqueEmailResponse.data.isUnique) {
                setAlertMessage('Email is already registered.');
                return;
            }
    
            // Check if contact number is unique
            const uniqueContactResponse = await axios.get(`http://localhost:3000/vendors/checkContact/${contactNumber}`);
            if (!uniqueContactResponse.data.isUnique) {
                setAlertMessage('Contact number is already in use.');
                return;
            }
    
            // Send form data to backend for signup
            const dataToSend = {
               
                    vendorName: formData.vendorName,
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                    businessName: formData.businessName,
                    businessAddress: formData.businessAddress, // Assign the businessAddress object directly
                    businessType: formData.businessType,
                    contactNumber: formData.contactNumber
                
        
            };
    
            // Make HTTP request to backend
            const response = await axios.post('http://localhost:3000/vendors/signup', dataToSend);
            console.log(response.status);
            setAlertMessage('Signup successful!');
            // Clear form data after successful signup
            setFormData(prevState => ({
                ...prevState,
                vendorName: '',
                username: '',
                email: '',
                password: '',
                businessName: '',
                businessAddress: {
                    addressLine1: '',
                    addressLine2: '',
                    city: '',
                    district: '',
                    state: '',
                    country: ''
                },
                businessType: '',
                contactNumber: ''
            }));
            navigate('/login');
        } catch (error) {
            if (error.response && error.response.data) {
                setAlertMessage(`Signup failed: ${error.response.data.message}`);
            } else {
                setAlertMessage('Signup failed. Please try again.');
            }
        }
    };
    
    return (
        <div className="auth-container">
            <h2>Sign Up as a Vendor</h2>
            {alertMessage && <p className="alert">{alertMessage}</p>}
            <form onSubmit={handleSubmit} className="auth-form">
                <label>Vendor Name:</label>
                <input type="text" name="vendorName" value={formData.vendorName} onChange={handleChange} required />

                <label>Username:</label>
                <input type="text" name="username" value={formData.username} onChange={handleChange} required />
                <label>Email:</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required />

                <label>Password:</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} required />

                <label>Business Name:</label>
                <input type="text" name="businessName" value={formData.businessName} onChange={handleChange} required />

                <label>Business Address:</label>
<input type="text" name="businessAddress.addressLine1" placeholder="Address Line 1" value={formData.businessAddress.addressLine1} onChange={handleChange} required />
<input type="text" name="businessAddress.addressLine2" placeholder="Address Line 2" value={formData.businessAddress.addressLine2} onChange={handleChange} />
<input type="text" name="businessAddress.city" placeholder="City" value={formData.businessAddress.city} onChange={handleChange} required />
<input type="text" name="businessAddress.district" placeholder="District" value={formData.businessAddress.district} onChange={handleChange} required />
<input type="text" name="businessAddress.state" placeholder="State" value={formData.businessAddress.state} onChange={handleChange} required />
<input type="text" name="businessAddress.country" placeholder="Country" value={formData.businessAddress.country} onChange={handleChange} required />


                <label>Business Type:</label>
                <select name="businessType" value={formData.businessType} onChange={handleChange} required>
                    <option value="">Select Type</option>
                    <option value="reachit">Reachit (Customer will visit)</option>
                    <option value="thinkit">Thinkit (Delivery available)</option>
                </select>

                <label>Contact Number:</label>
                <input type="tel" name="contactNumber" value={formData.contactNumber} onChange={handleChange} required />

                {/* <label>Vendor Image:</label>
                <input type="file" name="vendorImage" onChange={handleFileChange} required />

                <label>Shop Images:</label>
                <input type="file" name="shopImage" onChange={handleFileChange} required /> */}

                <button type="submit">Sign up</button>
            </form>
        </div>
    );
};


export default Signup;
