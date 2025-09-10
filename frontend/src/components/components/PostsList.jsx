import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Post from './Post';
import createPostImage from '../assets/createpost.jpg'; // Import background image

const PostsList = () => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  // Fetch all posts
  const fetchPosts = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/posts/get/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      } else {
        console.error('Failed to fetch posts.');
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Handle Delete
  const handleDelete = (postId) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
    console.log(`Post with ID ${postId} deleted.`);
  };

  // Handle Follow
  const handleFollow = (authorId) => {
    console.log(`Followed user with ID ${authorId}.`);
  };

  // Handle Unfollow
  const handleUnfollow = (authorId) => {
    console.log(`Unfollowed user with ID ${authorId}.`);
  };

  return (
    <div
      style={{
        backgroundImage: `url(${createPostImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        padding: '20px',
      }}
    >
      <div
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          padding: '30px',
          borderRadius: '15px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          maxWidth: '100%',
        }}
      >
        <h2 className="text-center mb-4 text-white">Posts</h2>
        <div className="mb-3 text-center">
          <button
            className="btn btn-secondary"
            onClick={() => navigate('/home')}
          >
            Go Back
          </button>
        </div>
        <div className="row">
          {posts.map((post) => (
            <div className="col-md-4" key={post.id}>
              <Post
                postId={post.id}
                title={post.title}
                author={post.author}
                content={post.content}
                likes={post.like_count}
                dislikes={post.dislike_count}
                onDelete={handleDelete}
                onFollow={handleFollow}
                onUnfollow={handleUnfollow}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostsList;
