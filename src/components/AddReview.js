import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddReviewButton = ({ vendorId, productId, customerId, rating, onSuccess, isVendorReview }) => {
    const [reviewText, setReviewText] = useState('');
    const [reviewId, setReviewId] = useState(null); // State to store the review ID
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hasSubmittedReview, setHasSubmittedReview] = useState(false);
    const [showThankYou, setShowThankYou] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchReviewStatus = async () => {
            try {
                console.log(rating)
                const response = await axios.get(`http://localhost:3000/reviews/status/customer/${customerId}/rating/${rating}`);
                setHasSubmittedReview(response.data.hasSubmittedReview);
                if (response.data.hasSubmittedReview) {
                    setReviewText(response.data.comment);
                    setReviewId(response.data.reviewId); // Capture the review ID from the response
                }
            } catch (error) {
                console.error('Error fetching review status:', error);
            }
        };

        fetchReviewStatus();
    }, [customerId, rating]);

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
                rating: rating, // Include the rating when editing a review
                comment: reviewText
            };
    
            if (!isVendorReview) {
                requestBody.productId = productId;
            }
    
            let response;
            if (isEditing && reviewId) {
                // If editing, send a PUT request to the update API
                response = await axios.put(`http://localhost:3000/reviews/update/${reviewId}`, requestBody);
            } else if (!hasSubmittedReview) {
                // If not editing and no previous review, send a POST request to submit a new review
                response = await axios.post(`http://localhost:3000/reviews/submit`, requestBody);

                setReviewId(response.data._id); // Save the review ID from the response
            } else {
                // If not editing but a previous review exists, show an error
                setError('You can only submit one review. Use the Edit button to update your existing review.');
                return;
            }
    
            setReviewText('');
            setError(null);
            setShowThankYou(true);
            setTimeout(() => setShowThankYou(false), 5000);
            onSuccess();
            setHasSubmittedReview(true);
        } catch (error) {
            console.error('Error submitting review:', error);
            setError('Error submitting review. Please try again.');
        } finally {
            setLoading(false);
            setIsEditing(false);
        }
    };
    

    const handleEditClick = () => {
        setIsEditing((prevIsEditing) => !prevIsEditing);
        if (!isEditing) {
            setError(null); // Clear any error messages when starting to edit
        }
    };

    return (
        <div>
            {!hasSubmittedReview ? (
                <div>
                    <textarea
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="Write your review here"
                        className="review-textarea"
                    />
                    {error && <div className="error-message">{error}</div>}
                    <button onClick={handleSubmitReview} disabled={loading} className="add-review-button">
                        {loading ? 'Submitting...' : isEditing ? 'Update Review' : 'Submit Review'}
                    </button>
                </div>
            ) : (
                <div>
                    {showThankYou && <div className="review-submitted">Thank you for your review!</div>}
                    <button onClick={handleEditClick} className="edit-review-button">
                        {isEditing ? 'Cancel Edit' : 'Edit Review'}
                    </button>
                    {isEditing && (
                        <div>
                            <textarea
                                value={reviewText}
                                onChange={(e) => setReviewText(e.target.value)}
                                placeholder="Write your review here"
                                className="review-textarea"
                            />
                            {error && <div className="error-message">{error}</div>}
                            <button onClick={handleSubmitReview} disabled={loading} className="add-review-button">
                                {loading ? 'Updating...' : 'Update Review'}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AddReviewButton;
