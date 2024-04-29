import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Reviews = ({ vendorId },{ratingId}) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/reviews/vendors/${vendorId}/ratings/${ratingId}}`);
                setReviews(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching reviews:', error);
                setError('Error fetching reviews. Please try again.');
                setLoading(false);
            }
        };

        fetchReviews();
    }, [vendorId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            {reviews.map(review => (
                <div key={review._id} className="review-item">
                    <p><strong>Rating:</strong> {review.rating}</p>
                    <p><strong>Comment:</strong> {review.comment}</p>
                </div>
            ))}
        </div>
    );
};

export default Reviews;
