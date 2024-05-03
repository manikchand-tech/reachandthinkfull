import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RandomThinkitProducts.css';

const RandomThinkitProducts = () => {
    const [products, setProducts] = useState([]); // Define products state as an empty array
    const [error, setError] = useState('');

    useEffect(() => {
        axios.get('http://localhost:3000/products/random/thinkit')
            .then(response => {
                setProducts(response.data);
            })
            .catch(error => {
                setError('Failed to fetch products: ' + error.message);
            });
    }, []);

    // Updated return statement to map over and display multiple products
    return (
        <div className="product-container">
            {products.map(product => (
                <div key={product._id} className="product-card">
                    <div className="product-image">
                        {product.imageUrl && <img src={product.imageUrl} alt={product.name} />}
                    </div>
                    <div className="product-info">
                        <h3>{product.name}</h3>
                        <p>{product.description}</p>
                        <p className="product-price"><strong>Price:</strong> {product.price} Rs.</p>
                        {/* Add more product details you want to display */}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default RandomThinkitProducts;
