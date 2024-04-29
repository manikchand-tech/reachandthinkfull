import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css'; // Import CSS file for styling
import { useNavigate } from 'react-router-dom';

const SearchSection = () => {
  const navigate = useNavigate();
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState('');
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [area, setArea] = useState('');
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    // Fetch list of countries
    axios.get('https://countriesnow.space/api/v0.1/countries/states')
      .then(response => {
        setCountries(response.data.data);
      })
      .catch(error => {
        console.error('Error fetching countries:', error);
      });
  }, []);

  const handleCountryChange = (e) => {
    const country = e.target.value;
    setSelectedCountry(country);
    setSelectedState('');
    setSelectedCity('');
    // Fetch states for the selected country
    axios.post('https://countriesnow.space/api/v0.1/countries/states', { country })
      .then(response => {
        setStates(response.data.data.states);
      })
      .catch(error => {
        console.error('Error fetching states:', error);
      });
  };

  const handleStateChange = (e) => {
    const state = e.target.value;
    setSelectedState(state);
    setSelectedCity('');
    // Fetch cities for the selected country and state
    axios.post('https://countriesnow.space/api/v0.1/countries/state/cities', { country: selectedCountry, state })
      .then(response => {
        setCities(response.data.data);
      })
      .catch(error => {
        console.error('Error fetching cities:', error);
      });
  };

  const handleCityChange = (e) => {
    const city = e.target.value;
    setSelectedCity(city);
  };

  const handleAreaChange = (e) => {
    const area = e.target.value;
    setArea(area);
  };

  const searchVendors = async () => {
    try {
      const response = await axios.get('http://localhost:3000/vendors'); // Assuming this endpoint returns all vendors
      let filteredVendors = [];
  
      // Try to find vendors that match all fields
      filteredVendors = response.data.filter((vendor) => {
        const { businessAddress } = vendor;
        return (
          businessAddress &&
          businessAddress.country &&
          businessAddress.country.toLowerCase() === selectedCountry.toLowerCase() &&
          (businessAddress.state && businessAddress.state.toLowerCase() === selectedState.toLowerCase()) &&
          (businessAddress.city && businessAddress.city.toLowerCase() === selectedCity.toLowerCase()) &&
          (businessAddress.addressLine1 && businessAddress.addressLine1.toLowerCase().includes(area.toLowerCase()))
        );
      });
  
      // If no vendors are found, try to match addressLine2
      if (filteredVendors.length === 0) {
        filteredVendors = response.data.filter((vendor) => {
          const { businessAddress } = vendor;
          return (
            businessAddress &&
            businessAddress.country &&
            businessAddress.country.toLowerCase() === selectedCountry.toLowerCase() &&
            (businessAddress.state && businessAddress.state.toLowerCase() === selectedState.toLowerCase()) &&
            (businessAddress.city && businessAddress.city.toLowerCase() === selectedCity.toLowerCase()) &&
            (businessAddress.addressLine2 && businessAddress.addressLine2.toLowerCase().includes(area.toLowerCase()))
          );
        });
      }
  
      // If still no vendors are found, relax the criteria progressively
      if (filteredVendors.length === 0) {
        // Relax criteria up to city level
        filteredVendors = response.data.filter((vendor) => {
          const { businessAddress } = vendor;
          return (
            businessAddress &&
            businessAddress.country &&
            businessAddress.country.toLowerCase() === selectedCountry.toLowerCase() &&
            (businessAddress.state && businessAddress.state.toLowerCase() === selectedState.toLowerCase()) &&
            (businessAddress.city && businessAddress.city.toLowerCase() === selectedCity.toLowerCase())
          );
        });
      }
  
      if (filteredVendors.length === 0) {
        // Relax criteria up to state level
        filteredVendors = response.data.filter((vendor) => {
          const { businessAddress } = vendor;
          return (
            businessAddress &&
            businessAddress.country &&
            businessAddress.country.toLowerCase() === selectedCountry.toLowerCase() &&
            (businessAddress.state && businessAddress.state.toLowerCase() === selectedState.toLowerCase())
          );
        });
      }
  
      if (filteredVendors.length === 0) {
        // Relax criteria up to country level
        filteredVendors = response.data.filter((vendor) => {
          const { businessAddress } = vendor;
          return (
            businessAddress &&
            businessAddress.country &&
            businessAddress.country.toLowerCase() === selectedCountry.toLowerCase()
          );
        });
      }
  
      setVendors(filteredVendors);
    } catch (error) {
      console.error('Error fetching vendors:', error);
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    searchVendors();
  };

  const HandleVendorClick = (event, vendorId) => {
    event.preventDefault();
    
    navigate(`/vendor-profile/${vendorId}`);
  };

  return (
    <div>
      <h2>Search Component</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="country">Select Country:</label>
          <select id="country" value={selectedCountry} onChange={handleCountryChange}>
            <option value="">Select Country</option>
            {countries.map(country => (
              <option key={country.iso3} value={country.name}>{country.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="state">Select State:</label>
          <select id="state" value={selectedState} onChange={handleStateChange}>
            <option value="">Select State</option>
            {states.map(state => (
              <option key={state.state_code} value={state.name}>{state.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="city">Select City:</label>
          <select id="city" value={selectedCity} onChange={handleCityChange}>
            <option value="">Select City</option>
            {cities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="area">Enter Area:</label>
          <input
            type="text"
            id="area"
            value={area}
            onChange={handleAreaChange}
            placeholder="Enter area"
          />
        </div>
        <div>
          <button type="submit">Search</button>
        </div>
      </form>
      <div>
  {vendors.length > 0 ? (
    <ul>
      {vendors.map((vendor, index) => (
        <li key={index}>
      <a href="#" onClick={(e) => HandleVendorClick(e, vendor._id)}> {vendor.businessName}</a> - {vendor.businessAddress.addressLine1}, {vendor.businessAddress.addressLine2 && vendor.businessAddress.addressLine2 + ', '}
        {vendor.businessAddress.city}, {vendor.businessAddress.district}, {vendor.businessAddress.state}, {vendor.businessAddress.country}
    
        </li>
      ))}
    </ul>
  ) : (
    <p>No vendors found.</p>
  )}
</div>

    </div>
  );
};

export default SearchSection;
