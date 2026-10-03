import { useState, useEffect } from 'react';

function Artworks() {
  const [artworks, setArtworks] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', category: '' });
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [commentText, setCommentText] = useState({});

  const token = localStorage.getItem('access_token');

  const fetchArtworks = () => {
    fetch('http://127.0.0.1:8000/api/artworks/', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((res) => res.json())
      .then((data) => setArtworks(data))
      .catch((err) => console.error('Error fetching artworks:', err));
  };

  useEffect(() => {
    fetchArtworks();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!token) {
      setError('You must be logged in to post artwork.');
      return;
    }
    const data = new FormData();
    data.append('title', form.title);
    data.append('description', form.description);
    data.append('category', form.category);
    if (image) data.append('image', image);

    try {
      const res = await fetch('http://127.0.0.1:8000/api/artworks/', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      });
      if (!res.ok) throw new Error('Upload failed');
      setForm({ title: '', description: '', category: '' });
      setImage(null);
      fetchArtworks();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLike = async (artworkId) => {
    if (!token) {
      alert('Please log in to like artworks.');
      return;
    }
    await fetch(`http://127.0.0.1:8000/api/artworks/${artworkId}/like/`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchArtworks();
  };

  const handleCommentChange = (artworkId, value) => {
    setCommentText({ ...commentText, [artworkId]: value });
  };

  const handleCommentSubmit = async (artworkId) => {
    if (!token) {
      alert('Please log in to comment.');
      return;
    }
    const text = commentText[artworkId];
    if (!text) return;

    await fetch(`http://127.0.0.1:8000/api/artworks/${artworkId}/comment/`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });
    setCommentText({ ...commentText, [artworkId]: '' });
    fetchArtworks();
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>ArtsOn — Artwork Feed</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem', border: '1px solid #ccc', padding: '1rem' }}>
        <h3>Upload Artwork</h3>
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required /><br /><br />
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} /><br /><br />
        <input name="category" placeholder="Category (e.g. Painting)" value={form.category} onChange={handleChange} /><br /><br />
        <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} required /><br /><br />
        <button type="submit">Post Artwork</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>

      {artworks.length === 0 ? (
        <p>No artworks posted yet.</p>
      ) : (
        artworks.map((art) => (
          <div key={art.id} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
            <h3>{art.title}</h3>
            <p><strong>By:</strong> {art.artist_username}</p>
            <p>{art.description}</p>
            <p><strong>Category:</strong> {art.category}</p>
            {art.image && <img src={art.image} alt={art.title} style={{ maxWidth: '300px' }} />}

            <div style={{ marginTop: '0.5rem' }}>
              <button onClick={() => handleLike(art.id)}>
                {art.liked_by_me ? '❤️ Liked' : '🤍 Like'} ({art.likes_count})
              </button>
            </div>

            <div style={{ marginTop: '1rem' }}>
              <strong>Comments:</strong>
              {art.comments.length === 0 ? (
                <p style={{ fontSize: '0.9rem', color: '#666' }}>No comments yet.</p>
              ) : (
                art.comments.map((c) => (
                  <p key={c.id} style={{ fontSize: '0.9rem' }}>
                    <strong>{c.username}:</strong> {c.text}
                  </p>
                ))
              )}
              <input
                placeholder="Add a comment..."
                value={commentText[art.id] || ''}
                onChange={(e) => handleCommentChange(art.id, e.target.value)}
              />
              <button onClick={() => handleCommentSubmit(art.id)}>Post</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Artworks;