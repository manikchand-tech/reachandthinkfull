import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home.js';

import Navbar from './components/Navbar.js';
import Reachit from './pages/Reachit.js';
import Thinkit from './pages/Thinkit.js';
import Careers from './pages/Careers.js';
import Signup from './components/Signup.js';
import Login from './components/Login.jsx';
import Profile from './components/Profile.js';
import CustomerSignup from './components/CustomerSignup.js';
import { AuthProvider } from './components/AuthContext.js';
import ImageUpload from './components/imageUpload.jsx';
import VendorProfilePage from './components/VendorProfilPage.js';
import Reviews from './components/Reviews.jsx';
import ReviewPage from './components/ReviewPage.jsx';
const App = () => {
    return (<>

        <AuthProvider>
            <Router>
                <Navbar />
                <Routes>
                    <Route exact path='/' index element={<Home />} />

                    <Route exact path='/reachit' Component={Reachit} />
                    <Route exact path='/thinkit' Component={Thinkit} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/customer-signup" element={<CustomerSignup />} /> {/* Use element prop for the component */}
                    <Route path="/vendor-signup" element={<Signup />} />
                    <Route path="/login" element={<Login />} />
                   <Route path='/imageupload' element={<ImageUpload/>}/>
                   <Route path="/vendor-profile/:id" element={<VendorProfilePage/>} />
                   <Route exact path="/reviews" element={<Reviews/>} />
                <Route path="/reviews/vendors/:vendorId/ratings/:ratingId/customer/:customerId" element={<ReviewPage/>} />
                </Routes>

            </Router>
        </AuthProvider>
    </>
    );
}

export default App;
