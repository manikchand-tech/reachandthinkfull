// AuthContext.js

import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
   const[userType,setUserType]=useState('')
    const [rntId, setRntId] = useState('');
    return (
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn,rntId,setRntId ,userType,setUserType}}>
            {children}
        </AuthContext.Provider>
    );
};

;

export const useAuth = () => useContext(AuthContext);
