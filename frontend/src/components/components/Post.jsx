import React, { useState, useEffect } from 'react';

const Post = ({ postId, title, author, content, likes: initialLikes, dislikes: initialDislikes, onDelete, onFollow, onUnfollow }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false); // Follow state
  const [likes, setLikes] = useState(initialLikes);
  const [dislikes, setDislikes] = useState(initialDislikes);
  const [message, setMessage] = useState('');
  const [editMode, setEditMode] = useState(false); // Toggle edit mode
  const [formData, setFormData] = useState({ title, content }); // Edit form data
  const [commentContent, setCommentContent] = useState('');
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const loggedInUser = localStorage.getItem('username');

  // Handle Like
  const handleLike = async () => {
    const accessToken = localStorage.getItem('accessToken');
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/post/${postId}/like/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (isLiked) {
          setLikes((prev) => prev - 1); // Unlike
          setIsLiked(false);
        } else {
          setLikes((prev) => prev + 1); // Like
          if (isDisliked) {
            setDislikes((prev) => prev - 1); // Remove dislike if it was disliked
          }
          setIsLiked(true);
          setIsDisliked(false);
        }
        setMessage(data.message || 'Successfully liked the post.');
      } else {
        setMessage('Error liking the post.');
      }
    } catch (error) {
      setMessage('Error liking the post.');
    }
  };

  // Handle Dislike
  const handleDislike = async () => {
    const accessToken = localStorage.getItem('accessToken');
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/post/${postId}/dislike/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (isDisliked) {
          setDislikes((prev) => prev - 1); // Undislike
          setIsDisliked(false);
        } else {
          setDislikes((prev) => prev + 1); // Dislike
          if (isLiked) {
            setLikes((prev) => prev - 1); // Remove like if it was liked
          }
          setIsDisliked(true);
          setIsLiked(false);
        }
        setMessage(data.message || 'Successfully disliked the post.');
      } else {
        setMessage('Error disliking the post.');
      }
    } catch (error) {
      setMessage('Error disliking the post.');
    }
  };

  // Handle Edit
  const handleEdit = async () => {
    const accessToken = localStorage.getItem('accessToken');
    const editUrl = `http://127.0.0.1:8000/api/post/${postId}/edit/`;

    try {
      const response = await fetch(editUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage('Post updated successfully!');
        setEditMode(false); // Exit edit mode
      } else {
        const errorData = await response.json();
        setMessage(errorData.detail || 'Failed to update the post.');
      }
    } catch (error) {
      setMessage('Error updating the post.');
    }
  };

  // Handle Delete
  const handleDelete = async () => {
    const accessToken = localStorage.getItem('accessToken');
    const deleteUrl = `http://127.0.0.1:8000/api/post/${postId}/delete/`;

    try {
      const response = await fetch(deleteUrl, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        setMessage('Post deleted successfully!');
        onDelete(postId); // Notify parent to remove this post from the list
      } else {
        const errorData = await response.json();
        setMessage(errorData.detail || 'Failed to delete the post.');
      }
    } catch (error) {
      setMessage('Error deleting the post.');
    }
  };

  // Handle Follow
  const handleFollow = async () => {
    const accessToken = localStorage.getItem('accessToken');
    const followUrl = `http://127.0.0.1:8000/api/user/${author}/follow/`;

    try {
      const response = await fetch(followUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setIsFollowing(true);
        setMessage('User followed successfully!');
        onFollow(author); // Notify parent
      } else {
        setMessage('Error following the user.');
      }
    } catch (error) {
      setMessage('Error following the user.');
    }
  };

  // Handle Unfollow
  const handleUnfollow = async () => {
    const accessToken = localStorage.getItem('accessToken');
    const unfollowUrl = `http://127.0.0.1:8000/api/user/${author}/unfollow/`;

    try {
      const response = await fetch(unfollowUrl, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        setIsFollowing(false);
        setMessage('User unfollowed successfully!');
        onUnfollow(author); // Notify parent
      } else {
        setMessage('Error unfollowing the user.');
      }
    } catch (error) {
      setMessage('Error unfollowing the user.');
    }
  };

  // Fetch comments for the post
  const fetchComments = async () => {
    const accessToken = localStorage.getItem('accessToken');
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/post/${postId}/comments/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  // Handle comment submission
  const handleAddComment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const accessToken = localStorage.getItem('accessToken');
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/post/${postId}/comments/add/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ content: commentContent }),
      });

      if (response.ok) {
        const newComment = await response.json();
        setComments((prevComments) => [newComment, ...prevComments]); // Prepend the new comment
        setCommentContent('');
        setMessage('Comment added successfully!');
      } else {
        setMessage('Failed to add comment. Please try again.');
      }
    } catch (error) {
      setMessage('An error occurred while adding the comment.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments(); // Fetch comments when component mounts
  }, [postId]);

  return (
    <div className="card mb-4 shadow-sm">
      <div className="card-body">
        {editMode ? (
          <div>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="form-control mb-2"
            />
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="form-control mb-2"
            />
            <button className="btn btn-success" onClick={handleEdit}>
              Save Changes
            </button>
            <button className="btn btn-secondary" onClick={() => setEditMode(false)}>
              Cancel
            </button>
          </div>
        ) : (
          <>
            <h5 className="card-title">{title}</h5>
            <p className="card-text">{content}</p>
            <p className="card-text">Author: {author}</p>
            <div className="d-flex justify-content-between align-items-center">
              <div className="btn-group">
                <button
                  className={`btn ${isLiked ? 'btn-success' : 'btn-outline-success'}`}
                  onClick={handleLike}
                >
                  Like ({likes})
                </button>
                <button
                  className={`btn ${isDisliked ? 'btn-danger' : 'btn-outline-danger'}`}
                  onClick={handleDislike}
                >
                  Dislike ({dislikes})
                </button>
                {loggedInUser === author && (
                  <>
                    <button className="btn btn-warning" onClick={() => setEditMode(true)}>
                      Edit
                    </button>
                    <button className="btn btn-danger" onClick={handleDelete}>
                      Delete
                    </button>
                  </>
                )}
                {loggedInUser !== author && (
                  <button
                    className={`btn ${isFollowing ? 'btn-danger' : 'btn-primary'}`}
                    onClick={isFollowing ? handleUnfollow : handleFollow}
                  >
                    {isFollowing ? 'Unfollow' : 'Follow'}
                  </button>
                )}
              </div>
              {message && <small className="text-muted">{message}</small>}
            </div>

            {/* Display comments */}
            <div className="mt-3">
              <h6>Comments:</h6>
              {comments.map((comment) => (
                <div key={comment.id} className="comment">
                  <p>{comment.content}</p>
                </div>
              ))}

              {/* Add comment form */}
              <div className="mt-3">
                <textarea
                  className="form-control mb-2"
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  placeholder="Write a comment"
                />
                <button className="btn btn-primary" onClick={handleAddComment} disabled={loading}>
                  {loading ? 'Adding...' : 'Add Comment'}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Post;
