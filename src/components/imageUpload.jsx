import React, { useState } from 'react';
import { useAuth } from '../components/AuthContext';
import firebase from '../firebase/firebaseSDK';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { app, storage } from '../firebase/firebaseConfig';

import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
const ImageUpload = () => {
    const { setIsLoggedIn } = useAuth();
    const location = useLocation();
    const vendorid = location.state?.vendorId; 
   console.log(vendorid)
    const navigate = useNavigate();
    const [vendorImageFile, setVendorImageFile] = useState(null);
    const [shopImageFile, setShopImageFile] = useState(null);
    const [vendorImage, setVendorImageUrl] = useState('');
    const [shopImage, setShopImageUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const vendorImageSelectedHandler = (event) => {
        setVendorImageFile(event.target.files[0]);
    };

    const shopImageSelectedHandler = (event) => {
        setShopImageFile(event.target.files[0]);
    };

    const generateUniqueName = () => {
        const date = new Date();
        const timestamp = date.getTime();
        const dateString = date.toISOString().slice(0, 10); // Get YYYY-MM-DD format
        const randomString = Math.random().toString(36).substring(2, 8);
        return `${timestamp}-${dateString}-${randomString}`;
    };

    const fileUploadHandler = async () => {
        if (!vendorImageFile || !shopImageFile) {
            alert('Please select both vendor and shop images before uploading.');
            return;
        }
    
        setLoading(true);

        // Generate unique names for images
        const vendorImageName = generateUniqueName() + '-' + vendorImageFile.name;
        const shopImageName = generateUniqueName() + '-' + shopImageFile.name;

        // Upload vendor image
        const vendorImageRef = ref(storage, `vendor_images/${vendorImageName}`);
        const vendorImageSnapshot = await uploadBytes(vendorImageRef, vendorImageFile);
        const vendorImage = await getDownloadURL(vendorImageSnapshot.ref);
        console.log('Vendor image uploaded successfully');

        // Upload shop image
        const shopImageRef = ref(storage, `shopimg/${shopImageName}`);
        const shopImageSnapshot = await uploadBytes(shopImageRef, shopImageFile);
        const shopImage= await getDownloadURL(shopImageSnapshot.ref);
        console.log('Shop image uploaded successfully');

        // Set the image URLs
        setVendorImageUrl(vendorImage);
        setShopImageUrl(shopImage);
       
        // Post image URLs to server
        axios.post(`http://localhost:3000/vendors/verify/images/${vendorid}`, {
           vendorImage,
            shopImage,
        
        })
            .then(response => {
                console.log("sending id is ",vendorid)
                console.log('Server response:', response.data);
                setIsLoggedIn(true);
                // Navigate to home page
                
                navigate('/'); // Navigate to the home page
                setSubmitted(true);     })
            .catch(error => {
                console.error('Error posting image URLs:', error);
            }).finally( ()=>{
                setLoading(false);
                setVendorImageFile(null);
                setShopImageFile(null);
            });
           
    };
   
    return (
       
        <div>
              {!submitted && ( <> 
            <div>
                <label>Upload Vendor Image:</label>
                <input type="file" onChange={vendorImageSelectedHandler} />
            </div>
            <div>
                <label>Upload Shop Image:</label>
                <input type="file" onChange={shopImageSelectedHandler} />
            </div>
            <button onClick={fileUploadHandler}>Upload Images</button>
            {loading ? 'Uploading...' : 'Upload Images'}
            {vendorImage && <img src={vendorImage} alt="Uploaded Vendor Image" />}
            {shopImage && <img src={shopImage} alt="Uploaded Shop Image" />}
            </>   )}     </div>
       
    );
};

export default ImageUpload;
