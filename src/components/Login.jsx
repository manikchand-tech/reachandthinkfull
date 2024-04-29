import React, { useState } from 'react';
import axios from 'axios';
import './login.css';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

import ImageUpload from './imageUpload';
function Login() {
    const{setUserType}=useAuth();
    const {setRntId}=useAuth();
    const navigate = useNavigate();
    const { setIsLoggedIn } = useAuth();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        userType: 'customer', // Default user type is customer
    });
    const [loginStatus, setLoginStatus] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const loginEndpoint = formData.userType === 'customer' ? 'customers/login' : 'vendors/login';

        await axios.post(`http://localhost:3000/${loginEndpoint}`, formData).then((response) => {
            //console.log(response.data.vendorId);
            const token = response.data.token;
setUserType(formData.userType)
if (formData.userType==='vendor') {
    

          const vendorId = response.data.vendorId;
            const notVerified = response.data.bool


            console.log(notVerified," ",vendorId," ")

            if (notVerified) {
                navigate('/imageupload', { state: { vendorId: vendorId } });
                console.log("image upload process")
            }
            setLoginStatus('success');
            setRntId(vendorId)
            setIsLoggedIn(true);
            localStorage.setItem('token', token);

        }
           else if (formData.userType==='customer') {
            const customerId=response.data.customerId;
            console.log('login by customer',customerId)
setRntId(customerId)
setLoginStatus('success');
setIsLoggedIn(true);
localStorage.setItem('token', token);
navigate('/')

           }
            // console.log(token)
            
        }).catch((error) => {
            console.log(error);
            setLoginStatus('failure');
        })

    };

    return (
        <div className="auth-container">
            <h2 style={{color:'black'}}>Login</h2>
            {loginStatus === 'success' && <p>Login successful!</p>}
            {loginStatus === 'failure' && <p>Invalid username or password</p>}
            <form onSubmit={handleSubmit} className="auth-form">
                <label>Username:</label>
                <input type="text" name="username" value={formData.username} onChange={handleChange} required />
                <label>Password:</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                <label>User Type:</label>
                <select name="userType" value={formData.userType} onChange={handleChange}>
                    <option value="customer">Customer</option>
                    <option value="vendor">Vendor</option>
                </select>
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login;
