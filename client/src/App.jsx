import { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Register from './Register.jsx';
import Login from './Login.jsx';
import Artworks from './Artworks.jsx';
import './App.css';

function Home() {
  const [profiles, setProfiles] = useState([]);
  const token = localStorage.getItem('access_token');

  const fetchProfiles = () => {
    fetch('http://127.0.0.1:8000/api/users/profiles/', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((res) => res.json())
      .then((data) => setProfiles(data))
      .catch((err) => console.error('Error fetching profiles:', err));
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const handleFollow = async (profileId) => {
    if (!token) {
      alert('Please log in to follow artists.');
      return;
    }
    await fetch(`http://127.0.0.1:8000/api/users/profiles/${profileId}/follow/`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchProfiles();
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>ArtsOn — Artist Profiles</h1>
      {profiles.length === 0 ? (
        <p>No profiles found yet.</p>
      ) : (
        profiles.map((profile) => (
          <div key={profile.id} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
            <h3>{profile.username}</h3>
            <p><strong>Bio:</strong> {profile.bio}</p>
            <p><strong>Category:</strong> {profile.art_category}</p>
            <p><strong>Location:</strong> {profile.location}</p>
            <p>{profile.followers_count} followers · {profile.following_count} following</p>
            <button onClick={() => handleFollow(profile.id)}>
              {profile.is_following ? 'Unfollow' : 'Follow'}
            </button>
          </div>
        ))
      )}
    </div>
  );
}

function App() {
  return (
    <div>
      <nav style={{ padding: '1rem', borderBottom: '1px solid #ccc' }}>
        <Link to="/" style={{ marginRight: '1rem' }}>Home</Link>
        <Link to="/artworks" style={{ marginRight: '1rem' }}>Artworks</Link>
        <Link to="/register" style={{ marginRight: '1rem' }}>Register</Link>
        <Link to="/login">Login</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/artworks" element={<Artworks />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;