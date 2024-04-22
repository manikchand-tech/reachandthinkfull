// StarRating.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './StarRating.css'; // Make sure to create a corresponding CSS file

const StarRating = ({ vendorId, customerId, maxStars = 5 }) => {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [averageRating, setAverageRating] = useState(0);
    const [userRating, setUserRating] = useState(null); // Change initial value to null
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        axios.get(`http://localhost:3000/ratings/${vendorId}/average-rating`)
            .then(response => {
                setAverageRating(response.data.averageRating);
            })
            .catch(error => {
                console.error('Error fetching average rating', error);
            });
    }, [vendorId, submitted]);

    useEffect(() => {
        axios.get(`http://localhost:3000/ratings/${vendorId}/${customerId}`)
            .then(response => {
                setUserRating(response.data.rating);
            })
            .catch(error => {
                console.error('Error fetching user rating', error);
            });
    }, [vendorId, customerId, submitted]);

    const submitRating = (newRating) => {
        axios.post(`http://localhost:3000/ratings/${vendorId}`, { rating: newRating, customerId: customerId })
            .then(response => {
                // Assuming the backend returns the updated average rating
                setAverageRating(response.data.averageRating);
                setSubmitted(!submitted); // Toggle submitted state to trigger useEffect
            })
            .catch(error => {
                console.error('Error submitting rating', error);
            });
    };

    return (
        <div className="star-rating">
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

            <p>The average rating is: {averageRating}</p>
            {userRating !== null && <p>Your rating: {userRating}</p>}
        </div>
    );
};

export default StarRating;
