// VendorReviewPage.js
import React from 'react';
import AddReviewButton from './AddReview';
import Reviews from './Reviews';
const VendorReviewPage = ({ vendorId, customerId, rating }) => {
    const handleVendorReviewSuccess = () => {
        // Handle success (e.g., show a success message)
        console.log('Vendor review submitted successfully');
    };

    return (
        <div>

            <h3>Vendor Review</h3>
            <AddReviewButton
                vendorId={vendorId}
                customerId={customerId}
                rating={rating}
                isVendorReview={true}
                onSuccess={handleVendorReviewSuccess}
            />

            <Reviews vendorId={vendorId} ratingId={rating} customerId={customerId} />
        </div>
    );
};

export default VendorReviewPage;
