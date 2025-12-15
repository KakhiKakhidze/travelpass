import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { HiHeart, HiChat, HiLocationMarker, HiStar, HiShare } from 'react-icons/hi';
import LevelBadge from '../components/LevelBadge';

const FeedPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [commentingOn, setCommentingOn] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState({});

  useEffect(() => {
    fetchFeed();
  }, []);

  const fetchFeed = async () => {
    try {
      setLoading(true);
      const response = await api.get('/social/feed');
      setFeed(response.data.data.feed || []);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to load feed');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (type, id) => {
    try {
      if (type === 'review') {
        await api.post(`/reviews/${id}/like`);
      } else if (type === 'checkin') {
        await api.post(`/checkins/${id}/like`);
      }
      fetchFeed();
    } catch (err) {
      console.error('Failed to like:', err);
    }
  };

  const fetchComments = async (targetType, targetId) => {
    try {
      const response = await api.get(`/comments?targetType=${targetType}&targetId=${targetId}`);
      setComments(prev => ({
        ...prev,
        [`${targetType}-${targetId}`]: response.data.data.comments || []
      }));
    } catch (err) {
      console.error('Failed to fetch comments:', err);
    }
  };

  const handleAddComment = async (targetType, targetId) => {
    if (!commentText.trim()) return;

    try {
      await api.post('/comments', {
        targetType,
        targetId,
        text: commentText
      });
      setCommentText('');
      setCommentingOn(null);
      await fetchComments(targetType, targetId);
      fetchFeed();
    } catch (err) {
      console.error('Failed to add comment:', err);
    }
  };

  const handleShare = async (type, id) => {
    const url = `${window.location.origin}/feed?${type}=${id}`;
    try {
      await navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (loading) {
    return (
      <div className="container-sm py-4">
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-sm py-4">
      <h2 className="mb-4">Activity Feed</h2>

      {error && (
        <div className="alert alert-error mb-3">
          {error}
        </div>
      )}

      {feed.length === 0 ? (
        <div className="paper p-4 text-center">
          <p className="text-muted">No activity yet. Start following travelers to see their updates!</p>
          <button
            className="btn"
            onClick={() => navigate('/communities')}
            style={{ marginTop: '16px' }}
          >
            Explore Communities
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {feed.map((item) => (
            <div key={`${item.type}-${item.id}`} className="paper p-4">
              {item.type === 'checkin' && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <div>
                      <LevelBadge 
                        level={item.data.userId?.level || 1} 
                        size={40} 
                        currentLevel={999} 
                        showLabel={false} 
                      />
                    </div>
                    <div>
                      <div style={{ fontWeight: '600' }}>
                        {item.data.userId?.name || 'User'}
                      </div>
                      <div style={{ fontSize: '0.875rem', color: '#6c757d' }}>
                        {new Date(item.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <HiLocationMarker style={{ display: 'inline', marginRight: '6px' }} />
                    <strong>{item.data.status || 'Checked in'}</strong> at{' '}
                    <span style={{ color: '#e63946' }}>
                      {item.data.locationId?.name || 'Location'}
                    </span>
                  </div>
                  {item.data.note && (
                    <p style={{ marginBottom: '12px' }}>{item.data.note}</p>
                  )}
                  {item.data.photos && item.data.photos.length > 0 && (
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                      {item.data.photos.map((photo, idx) => (
                        <img
                          key={idx}
                          src={photo}
                          alt="Check-in"
                          style={{
                            width: '100px',
                            height: '100px',
                            objectFit: 'cover',
                            borderRadius: '8px'
                          }}
                        />
                      ))}
                    </div>
                  )}
                  {item.data.isVerified && (
                    <span
                      style={{
                        fontSize: '0.75rem',
                        background: '#e63946',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        marginBottom: '12px',
                        display: 'inline-block'
                      }}
                    >
                      ✓ Verified
                    </span>
                  )}
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginTop: '12px' }}>
                    <button
                      className="btn btn-text"
                      onClick={() => handleLike('checkin', item.id)}
                      style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <HiHeart size={18} fill={item.data.liked ? '#e63946' : 'none'} color={item.data.liked ? '#e63946' : '#6c757d'} />
                      {item.data.likes || 0}
                    </button>
                    <button
                      className="btn btn-text"
                      onClick={() => {
                        setCommentingOn(`checkin-${item.id}`);
                        fetchComments('checkin', item.id);
                      }}
                      style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <HiChat size={18} />
                      {item.data.comments?.length || 0}
                    </button>
                    <button
                      className="btn btn-text"
                      onClick={() => handleShare('checkin', item.id)}
                      style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <HiShare size={18} />
                    </button>
                  </div>
                  {commentingOn === `checkin-${item.id}` && (
                    <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #e9ecef' }}>
                      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                        <input
                          type="text"
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          placeholder="Write a comment..."
                          style={{
                            flex: 1,
                            padding: '8px 12px',
                            border: '2px solid #e9ecef',
                            borderRadius: '8px',
                            fontSize: '0.875rem'
                          }}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              handleAddComment('checkin', item.id);
                            }
                          }}
                        />
                        <button
                          className="btn"
                          onClick={() => handleAddComment('checkin', item.id)}
                          style={{ padding: '8px 16px' }}
                        >
                          Post
                        </button>
                      </div>
                      {comments[`checkin-${item.id}`] && comments[`checkin-${item.id}`].length > 0 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {comments[`checkin-${item.id}`].slice(0, 3).map((comment) => (
                            <div key={comment.id} style={{ fontSize: '0.875rem' }}>
                              <strong>{comment.userId?.name}</strong> {comment.text}
                            </div>
                          ))}
                          {comments[`checkin-${item.id}`].length > 3 && (
                            <button
                              className="btn btn-text"
                              style={{ fontSize: '0.75rem', alignSelf: 'flex-start' }}
                            >
                              View all {comments[`checkin-${item.id}`].length} comments
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {item.type === 'review' && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <div>
                      <LevelBadge 
                        level={item.data.userId?.level || 1} 
                        size={40} 
                        currentLevel={999} 
                        showLabel={false} 
                      />
                    </div>
                    <div>
                      <div style={{ fontWeight: '600' }}>
                        {item.data.userId?.name || 'User'}
                      </div>
                      <div style={{ fontSize: '0.875rem', color: '#6c757d' }}>
                        {new Date(item.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      {[...Array(5)].map((_, i) => (
                        <HiStar
                          key={i}
                          size={20}
                          color={i < item.data.rating ? '#ffc107' : '#e0e0e0'}
                        />
                      ))}
                      <span style={{ marginLeft: '8px', fontWeight: '600' }}>
                        {item.data.locationId?.name || 'Location'}
                      </span>
                    </div>
                    {item.data.text && (
                      <p style={{ marginBottom: '12px' }}>{item.data.text}</p>
                    )}
                    {item.data.photos && item.data.photos.length > 0 && (
                      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                        {item.data.photos.map((photo, idx) => (
                          <img
                            key={idx}
                            src={photo}
                            alt="Review"
                            style={{
                              width: '100px',
                              height: '100px',
                              objectFit: 'cover',
                              borderRadius: '8px'
                            }}
                          />
                        ))}
                      </div>
                    )}
                    {item.data.tags && item.data.tags.length > 0 && (
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
                        {item.data.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            style={{
                              fontSize: '0.75rem',
                              background: '#f0f0f0',
                              padding: '4px 8px',
                              borderRadius: '12px'
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '12px' }}>
                    <button
                      className="btn btn-text"
                      onClick={() => handleLike('review', item.id)}
                      style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <HiHeart size={18} fill={item.data.liked ? '#e63946' : 'none'} color={item.data.liked ? '#e63946' : '#6c757d'} />
                      {item.data.likes || 0}
                    </button>
                    <button
                      className="btn btn-text"
                      onClick={() => {
                        setCommentingOn(`review-${item.id}`);
                        fetchComments('review', item.id);
                      }}
                      style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <HiChat size={18} />
                      {item.data.comments?.length || 0}
                    </button>
                    <button
                      className="btn btn-text"
                      onClick={() => handleShare('review', item.id)}
                      style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <HiShare size={18} />
                    </button>
                  </div>
                  {commentingOn === `review-${item.id}` && (
                    <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #e9ecef' }}>
                      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                        <input
                          type="text"
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          placeholder="Write a comment..."
                          style={{
                            flex: 1,
                            padding: '8px 12px',
                            border: '2px solid #e9ecef',
                            borderRadius: '8px',
                            fontSize: '0.875rem'
                          }}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              handleAddComment('review', item.id);
                            }
                          }}
                        />
                        <button
                          className="btn"
                          onClick={() => handleAddComment('review', item.id)}
                          style={{ padding: '8px 16px' }}
                        >
                          Post
                        </button>
                      </div>
                      {comments[`review-${item.id}`] && comments[`review-${item.id}`].length > 0 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {comments[`review-${item.id}`].slice(0, 3).map((comment) => (
                            <div key={comment.id} style={{ fontSize: '0.875rem' }}>
                              <strong>{comment.userId?.name}</strong> {comment.text}
                            </div>
                          ))}
                          {comments[`review-${item.id}`].length > 3 && (
                            <button
                              className="btn btn-text"
                              style={{ fontSize: '0.75rem', alignSelf: 'flex-start' }}
                            >
                              View all {comments[`review-${item.id}`].length} comments
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FeedPage;
