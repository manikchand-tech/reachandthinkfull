// ProductReviewPage.js
import React from 'react';
import AddReviewButton from './AddReviewButton';

const ProductReviewPage = ({ productId, customerId,vendorId,rating }) => {
    const handleProductReviewSuccess = () => {
        // Handle success (e.g., show a success message)
        console.log('Product review submitted successfully');
    };

    return (
        <div>
            <h1>Product Review</h1>
            <AddReviewButton
                productId={productId}
                customerId={customerId}
                vendorId={vendorId}
                rating={rating}
                onSuccess={handleProductReviewSuccess}
            />
        </div>
    );
};

export default ProductReviewPage;
