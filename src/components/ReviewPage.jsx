// ReviewPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
const ReviewPage = () => {
    const { vendorId, ratingId, customerId } = useParams();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/reviews/vendors/${vendorId}/ratings/${ratingId}/customer/${customerId}`);
                const comments = response.data.map(review => review.comment);
                setReviews(comments);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching reviews:', error);
                setError('Error fetching reviews. Please try again.');
                setLoading(false);
            }
        };

        fetchReviews();
    }, [vendorId, ratingId, customerId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h4>Your Reviews</h4>
            {reviews.map((comment, index) => (
                <div key={index} className="review-item">
                    <p><strong>Comment:</strong> {comment}</p>
                </div>
            ))}
        </div>
    );
};

export default ReviewPage;
