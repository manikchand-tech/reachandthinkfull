import React from 'react';

function LogoutButton() {
    const handleLogout = () => {
        // Perform logout actions (e.g., clear authentication state)
        // For example, if you are using localStorage for authentication:
        localStorage.removeItem('token');
        // Redirect to the login page or do other necessary actions
        window.location.href = '/login'; // Redirect to the login page
    };

    return (
        <button onClick={handleLogout}>
            Logout
        </button>
    );
}

export default LogoutButton;
