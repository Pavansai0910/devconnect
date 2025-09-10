import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import profileImage from '../assets/profile2.jpg'; // Import the profile image for background

const Profile = () => {
  const navigate = useNavigate();

  const user = localStorage.getItem('username');
  const mail = localStorage.getItem('email');
  const access = localStorage.getItem('accessToken');

  const [formData, setFormData] = useState({
    username: user,
    email: mail,
    phone: '',
    bio: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [initialLoading, setInitialLoading] = useState(true);

  // Fetch the profile data on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      const apiUrl = 'http://127.0.0.1:8000/api/user/profile/data';
      try {
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setFormData({
            username: user,
            email: mail,
            phone: data.phone || '',
            bio: data.bio || '',
          });
        } else {
          console.error('Failed to fetch profile data');
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchProfile();
  }, [user, mail]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const apiUrl = 'http://127.0.0.1:8000/api/user/profile/update';

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage('Profile updated successfully!');
      } else {
        setMessage('Failed to update profile. Please try again.');
      }
    } catch (error) {
      setMessage('An error occurred while updating the profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleNavigateHome = () => {
    navigate('/home');
  };

  if (initialLoading) {
    return <div style={{ textAlign: 'center', color: 'pink', fontSize: '20px' }}>Loading profile...</div>;
  }

  return (
    <div
      style={{
        backgroundImage: `url(${profileImage})`, // Background image applied here
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        color: 'white', // Text color for better contrast with the background
      }}
    >
      <div
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.18)', // Light background for readability
          padding: '30px',
          borderRadius: '15px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          maxWidth: '500px',
          width: '100%',
        }}
      >
        <h2 style={{ textAlign: 'center', color: 'black', marginBottom: '20px' }}>Profile Page</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="username" style={{ display: 'block', marginBottom: '5px', color: 'black' }}>
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                backgroundColor: 'rgb(255,255,255)',
              }}
              disabled
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="email" style={{ display: 'block', marginBottom: '5px', color: 'black' }}>
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                backgroundColor: 'rgb(255,255,255)',
              }}
              disabled
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="phone" style={{ display: 'block', marginBottom: '5px', color: 'black' }}>
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                backgroundColor: 'rgb(255,255,255)',
              }}
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="bio" style={{ display: 'block', marginBottom: '5px', color: 'black' }}>
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                backgroundColor: 'rgb(255,255,255)',
              }}
              rows="4"
            ></textarea>
          </div>
          <div style={{ textAlign: 'center' }}>
            <button
              type="submit"
              style={{
                backgroundColor: 'rgb(241, 137, 52)',
                color: '#fff',
                padding: '10px 20px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
              }}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
        {message && (
          <div
            style={{
              marginTop: '20px',
              color: message.includes('successfully') ? 'green' : 'red',
              textAlign: 'center',
            }}
          >
            {message}
          </div>
        )}
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: 'rgb(241, 137, 52)',
              padding: '10px 20px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              
            }}
            onClick={handleNavigateHome}
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
