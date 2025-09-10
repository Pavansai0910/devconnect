import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Post from './Post'; // Import the Post component
import addPostImage from '../assets/postlist.jpg'; // Import the background image

const UserPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchUserPosts = async () => {
    const accessToken = localStorage.getItem('accessToken');  // Get the token from local storage
    
    try {
      const response = await fetch('http://127.0.0.1:8000/api/posts/user/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,  // Send token in the header
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
        setLoading(false);
        // Process the posts data here
      } else {
        const data = await response.json();
        console.error(data.error || 'Failed to fetch posts');
      }
    } catch (error) {
      console.error('Error fetching user posts:', error);
    }
  };

  useEffect(() => {
    fetchUserPosts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div
      style={{
        backgroundImage: `url(${addPostImage})`, // Set background image
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh', // Make sure the background covers the entire page
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
      }}
    >
      <div
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent white background for readability
          padding: '30px',
          borderRadius: '15px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          width: '100%',
          maxWidth: '800px',
        }}
      >
        <div className="mb-4">
          <button
            className="btn btn-primary me-3"
            onClick={() => navigate('/add-post')}
          >
            Create New Post
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => navigate('/home')}
          >
            Go Back
          </button>
        </div>

        <h2 className="mb-4">Your Posts</h2>

        {posts.length === 0 ? (
          <p>You haven't created any posts yet.</p>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="mb-4">
              <Post
                postId={post.id}
                title={post.title}
                author={post.author}
                content={post.content}
                likes={post.like_count}
                dislikes={post.dislike_count}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserPosts;
