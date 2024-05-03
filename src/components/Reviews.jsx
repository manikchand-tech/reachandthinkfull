// Reviews.jsx
import React from 'react';
import { useHistory,useNavigate } from 'react-router-dom';
import ReviewPage from './ReviewPage';

const Reviews = ({ vendorId, ratingId, customerId }) => {
    const navigate = useNavigate();

    const showReviews = () => {
        navigate(`/reviews/vendors/${vendorId}/ratings/${ratingId}/customer/${customerId}`);
    };

    return (
        <div>
            <h4>Your Review</h4>
            <button onClick={showReviews}>Show Reviews</button>
        </div>
    );
};

export default Reviews;
