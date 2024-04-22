import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase/firebaseConfig';
import { v4 as uuidv4 } from 'uuid';
import './VendorProduct.css';
import { useAuth } from './AuthContext';


const ConfirmModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Confirm Deletion</h2>
                <p>Are you sure you want to delete this product?</p>
                <button onClick={onConfirm}>Yes, Delete</button>
                <button onClick={onClose}>Cancel</button>
            </div>
        </div>
    );
};

// Component to manage vendor products
const VendorProduct = ({ vendorId }) => {
  const {userType} =useAuth() 
    // State for products and form inputs
    const [products, setProducts] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [editingProduct, setEditingProduct] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false); 
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    // Fetch products on component mount
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/products/${vendorId}`);
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, [vendorId]);

    // Handle image file change
    const handleImageChange = (e) => {
        if (e.target.files.length) {
            const file = e.target.files[0];
            const uniqueFileName = `${uuidv4()}-${file.name}`;
            setImage({ file, uniqueFileName });

            const reader = new FileReader();
            reader.onload = () => {
                setImageUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle form submission for adding a new product
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (image) {
            const { file, uniqueFileName } = image;
            const storageRef = ref(storage, `productImg/${uniqueFileName}`);

            try {
                await uploadBytes(storageRef, file);
                const imageUrl = await getDownloadURL(storageRef);

                const newProduct = {
                    name,
                    description,
                    price: Number(price),
                    imageUrl,
                    vendorId
                };

                const response = await axios.post('http://localhost:3000/products', newProduct);

                setProducts([...products, { ...response.data, imageUrl }]);
                resetForm();
            } catch (error) {
                console.error('Error adding product:', error);
            }
        } else {
            alert('Please select an image for the product.');
        }
    };
    const handleAddProduct = async (e) => {
        e.preventDefault();

        // Check if all form fields are filled
        if (!name || !description || !price || !image) {
            alert('Please fill all the fields and select an image.');
            return;
        }

        const { file, uniqueFileName } = image;
        const storageRef = ref(storage, `productImg/${uniqueFileName}`);

        try {
            // Upload the image to Firebase Storage
            await uploadBytes(storageRef, file);
            const imageUrl = await getDownloadURL(storageRef);

            // Create a new product object
            const newProduct = {
                name,
                description,
                price: Number(price),
                imageUrl,
                vendorId
            };

            // Send a POST request to add the new product
            const response = await axios.post('http://localhost:3000/products', newProduct);

            // Update the products state with the new product
            setProducts([...products, { ...response.data, imageUrl }]);
            
            // Reset the form fields
            resetForm();
        } catch (error) {
            console.error('Error adding product:', error);
        }
    };
    // Reset form fields
    const resetForm = () => {
        setName('');
        setDescription('');
        setPrice('');
        setImage(null);
        setImageUrl('');
    };

    // Function to handle edit button click
    const handleEdit = (product) => {
        setEditingProduct(product);
        setName(product.name);
        setDescription(product.description);
        setPrice(product.price);
        setImageUrl(product.imageUrl);
    };


    const handleCancelUpdate = () => {
        setEditingProduct(null);
        resetForm();
    };
    // Function to handle update form submission
    const handleUpdate = async (e) => {
        e.preventDefault();

        let imageUrlToUpdate = imageUrl; // Use existing image URL by default
        if (image) {
            try {
                // Upload the new image and get the URL
                const storageRef = ref(storage, `productImg/${image.uniqueFileName}`);
                await uploadBytes(storageRef, image.file);
                imageUrlToUpdate = await getDownloadURL(storageRef);
            } catch (error) {
                console.error('Error uploading new image:', error);
                return; // Exit the function if image upload fails
            }
        }

        // Prepare the updated product data
        const updatedProductData = {
            name,
            description,
            price: Number(price),
            imageUrl: imageUrlToUpdate,
            // Include other fields that might be part of the product
        };

        try {
            // Send a PUT request to update the product
            await axios.put(`http://localhost:3000/products/${editingProduct._id}`, updatedProductData);
            // Update the local products state
            setProducts(products.map(product => product._id === editingProduct._id ? { ...product, ...updatedProductData } : product));
            resetForm();
            setEditingProduct(null);
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };

    // Function to delete a product
    const deleteProduct = async (productId) => {
        try {
            await axios.delete(`http://localhost:3000/products/${productId}`);
            setProducts(products.filter(product => product._id !== productId));
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };



    // ProductCard component
    const ProductCard = ({ product }) => (
        <div className="product-card">
            <img src={product.imageUrl} alt={product.name} className="product-image" />
            <div className="product-info">
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <p className="product-price">Rs.{product.price}</p>
                {userType === 'vendor' && (
                    <>
                        <button onClick={() => handleEdit(product)}>Edit</button>
                        <button onClick={() => openDeleteModal(product._id)}>Delete</button>
                    </>
                )}
            </div>
        </div>
    );
    const toggleAddForm = () => {
        setShowAddForm(!showAddForm);
    };
    const openDeleteModal = (productId) => {
        setIsModalOpen(true);
        setProductToDelete(productId);
    };

    // Function to close the confirmation modal
    const closeDeleteModal = () => {
        setIsModalOpen(false);
        setProductToDelete(null);
    };

    // Function to delete a product after confirmation
    const confirmDelete = async () => {
        if (productToDelete) {
            try {
                await axios.delete(`http://localhost:3000/products/${productToDelete}`);
                setProducts(products.filter(product => product._id !== productToDelete));
                closeDeleteModal();
            } catch (error) {
                console.error('Error deleting product:', error);
            }
        }
    };

    return (
        
        <div className='vendor-product-container'>
                   {userType === 'vendor' && (
                <button className="toggle-button" onClick={toggleAddForm}>
                    {showAddForm ? 'Hide Add Product Form' : 'Show Add Product Form'}
                </button>
            )}

            {showAddForm && userType === 'vendor' && (
            <form onSubmit={handleAddProduct}>
                {/* Form fields for product details */}
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Product Name"
                />
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Product Description"
                />
                <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Product Price"
                />
                <input
                    type="file"
                    onChange={handleImageChange}
                />
                <button type="submit">Add Product</button>
            </form>
            )}
            <h1>Vendor Products</h1>
            {/* Display products */}
            <div className="product-grid">
                {products.map(product => (
                    <ProductCard
                        key={product._id}
                        product={product}
                    />
                ))}
            </div>
            {/* Update product form */}
            {editingProduct && (
                <form onSubmit={handleUpdate}>
                    <h2>Update Product</h2>
                    {/* Form fields with existing values from editingProduct */}
                    <label>
                        Name:
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        Description:
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        Price:
                        <input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        Image:
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                    </label>
                    {imageUrl && (
                        <div className="image-preview">
                            <img src={imageUrl} alt="Preview" />
                        </div>
                    )}
                    <button type="submit">Update Product</button>
                    <button type="button" className="button-cancel" onClick={handleCancelUpdate}>
                            Cancel
                        </button>
                </form>
            )}
             <ConfirmModal
                isOpen={isModalOpen}
                onClose={closeDeleteModal}
                onConfirm={confirmDelete}
            />
        </div>
    );
};

export default VendorProduct;
