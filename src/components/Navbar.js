import React from 'react';
import { FaUser } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import logo from '../images/rntlogo.png'; // Import your logo image
import './Navbar.css'; // Import the CSS file for styling

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="logo">
                <img src={logo} alt="Logo" className="logo-image" />
            </div>
            <div className="nav-links">
                <div>
                    <Link to="/" className="nav-link">Home</Link>
                    <Link to="/thinkit" className="nav-link">Thinkit</Link>
                    <Link to="/reachit" className="nav-link">Reachit</Link>
                </div>
                <div>
                    <Link to="/profile" className="nav-link">
                        <FaUser className="nav-icon" />
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
