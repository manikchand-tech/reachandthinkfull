import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './StarRating.css'; // Make sure to create a corresponding CSS file
import { useAuth } from './AuthContext';
const ProductRating = ({ productId, customerId,vendorId, maxStars = 5}) => {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [averageRating, setAverageRating] = useState(0);
    const [userRating, setUserRating] = useState(null); // Change initial value to null
    const [submitted, setSubmitted] = useState(false);
const {userType}=useAuth()
    useEffect(() => {
        axios.get(`http://localhost:3000/ratings/average-rating/product/${productId}`)
            .then(response => {
                let averageRating = response.data.averageRating;
                let parts = averageRating.toString().split('.');
                let formattedRating = parts[0] + (parts[1] ? '.' + parts[1].slice(0, 2) : '');
                setAverageRating((formattedRating));
                
            })
            .catch(error => {
                console.error('Error fetching average rating', error);
            });
    }, [productId, submitted]);

    useEffect(() => {
        axios.get(`http://localhost:3000/ratings/you-rated/product/${productId}/${customerId}`)
            .then(response => {

                setUserRating(response.data.rating);
            })
            .catch(error => {
                console.error('Error fetching user rating', error);
            });
    }, [productId, customerId, submitted]);

    const submitRating = (newRating) => {
        // Check user type before submitting rating
        if (userType === 'customer') {
            axios.post(`http://localhost:3000/ratings/product/${productId}`, { rating: newRating, customerId: customerId,vendorId:vendorId})
                .then(response => {
                    // Assuming the backend returns the updated average rating
                    let averageRating = response.data.averageRating;
                    let parts = averageRating.toString().split('.');
                    let formattedRating = parts[0] + (parts[1] ? '.' + parts[1].slice(0, 2) : '');
                    setAverageRating(formattedRating);
                    
                    setUserRating(response.data.userRating);
                    setSubmitted(!submitted); // Toggle submitted state to trigger useEffect
                })
                .catch(error => {
                    console.error('Error submitting rating', error);
                });
        } else {
            alert('Only customers can submit ratings.');
        }
    };
    
    return (
        <div className="star-rating">
        {/* {userType !== 'customer' && (
            <div className="alert">Only customers can submit ratings.</div>
        )} */}

            {[...Array(maxStars)].map((star, index) => {
                const ratingValue = index + 1;
                const isHalf = (hover % 1 !== 0 && ratingValue === Math.ceil(hover));
                const isFilled = (ratingValue <= (hover || averageRating));

                return (
                    <label key={index}>
                        <input
                            type="radio"
                            name="rating"
                            value={ratingValue}
                            onClick={() => {
                                
                                    setRating(ratingValue);
                                    submitRating(ratingValue);
                                
                               
                            }}
                        />
                        <span
                            className={`star ${isFilled ? 'filled' : ''} ${isHalf ? 'half-filled' : ''} ${ratingValue <= hover ? 'hover' : ''}`}
                            onMouseEnter={() => setHover(ratingValue)}
                            onMouseLeave={() => setHover(averageRating)}
                        >{isHalf ? '\u00BD' : '\u2605'}</span>
                    </label>
                );
            })}

            <p>The average rating is: {averageRating}
           </p>
            {userRating !== null && <p>Your rating: {userRating}</p>}
        </div>
    );
};

export default ProductRating;
