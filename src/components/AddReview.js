import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddReviewButton = ({ vendorId, productId, customerId, rating, onSuccess, isVendorReview }) => {
    const [reviewText, setReviewText] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hasSubmittedReview, setHasSubmittedReview] = useState(false);

    useEffect(() => {
        const fetchReviewStatus = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/reviews/status/customer/${customerId}/rating/${rating}`);
                setHasSubmittedReview(response.data.hasSubmittedReview);
            } catch (error) {
                console.error('Error fetching review status:', error);
            }
        };

        fetchReviewStatus();
    }, [customerId]);

    const handleSubmitReview = async () => {
        if (!reviewText.trim()) {
            setError('Review cannot be empty');
            return;
        }

        setLoading(true);
        try {
            let requestBody = {
                vendorId: vendorId,
                customerId: customerId,
                rating: rating,
                comment: reviewText
            };

            if (!isVendorReview) {
                requestBody.productId = productId;
            }

            const response = await axios.post(`http://localhost:3000/reviews/submit`, requestBody);
            setReviewText('');
            setError(null);
            onSuccess();
            setHasSubmittedReview(true);
            console.log(response.data);
        } catch (error) {
            console.error('Error submitting review:', error);
            setError('Error submitting review. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {hasSubmittedReview ? (
                <div className="review-submitted">
                    Thank you for your review!
                </div>
            ) : (
                <div>
                    <textarea
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="Write your review here"
                        className="review-textarea"
                    />
                    {error && <div className="error-message">{error}</div>}
                    <button onClick={handleSubmitReview} disabled={loading} className="add-review-button">
                        {loading ? 'Submitting...' : 'Submit Review'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default AddReviewButton;
