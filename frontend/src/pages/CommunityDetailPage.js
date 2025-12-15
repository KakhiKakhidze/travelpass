import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { HiUserGroup, HiLocationMarker, HiArrowLeft, HiUser, HiChat, HiHeart, HiTrash } from 'react-icons/hi';
import LevelBadge from '../components/LevelBadge';

const CommunityDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [community, setCommunity] = useState(null);
  const [members, setMembers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('members'); // 'members' or 'posts'

  // Travel status names
  const travelStatuses = [
    'Exploring',
    'On the Road',
    'Traveling',
    'Checked In',
    'Sightseeing',
    'Discovering New Places',
    'Local Hopping',
    'City Exploring',
    'Wandering'
  ];

  // Get status display - use currentStatus.text if available, otherwise show level-based or default
  const getStatusDisplay = (member) => {
    if (member.currentStatus?.text) {
      return member.currentStatus.text;
    }
    // If no currentStatus, show travel status based on level (cycling through the list)
    const statusIndex = (member.level || 1) % travelStatuses.length;
    return travelStatuses[statusIndex];
  };

  useEffect(() => {
    fetchCommunity();
  }, [id]);

  useEffect(() => {
    if (community && activeTab === 'members') {
      fetchMembers();
    } else if (community && activeTab === 'posts') {
      fetchPosts();
    }
  }, [community, activeTab]);

  const fetchCommunity = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/communities/${id}`);
      setCommunity(response.data.data.community);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to load community');
    } finally {
      setLoading(false);
    }
  };

  const fetchMembers = async () => {
    try {
      const response = await api.get(`/communities/${id}/members`);
      setMembers(response.data.data.members || []);
    } catch (err) {
      console.error('Failed to fetch members:', err);
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await api.get(`/communities/${id}/posts`);
      setPosts(response.data.data.posts || []);
    } catch (err) {
      console.error('Failed to fetch posts:', err);
    }
  };

  const handleJoin = async () => {
    try {
      await api.post(`/communities/${id}/join`);
      await fetchCommunity(); // Refresh to update isMember status
      if (activeTab === 'members') {
        await fetchMembers(); // Refresh members list
      }
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to join community');
    }
  };

  const handleLeave = async () => {
    try {
      await api.delete(`/communities/${id}/leave`);
      await fetchCommunity(); // Refresh to update isMember status
      if (activeTab === 'members') {
        await fetchMembers(); // Refresh members list
      }
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to leave community');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this community? This action cannot be undone.')) {
      return;
    }

    try {
      await api.delete(`/communities/${id}`);
      navigate('/communities');
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to delete community');
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

  if (!community) {
    return (
      <div className="container-sm py-4">
        <div className="paper p-4 text-center">
          <p className="text-muted">Community not found</p>
          <button className="btn" onClick={() => navigate('/communities')}>
            Back to Communities
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-sm py-4">
      {/* Back Button */}
      <button
        onClick={() => navigate('/communities')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '24px',
          background: 'transparent',
          border: 'none',
          color: '#6c757d',
          cursor: 'pointer',
          fontSize: '0.9375rem',
          fontWeight: '600'
        }}
      >
        <HiArrowLeft size={20} />
        Back to Communities
      </button>

      {error && (
        <div className="alert alert-error mb-3">
          {error}
        </div>
      )}

      {/* Community Header */}
      <div className="paper p-4 mb-4">
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '24px', marginBottom: '24px' }}>
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: '#e63946',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              flexShrink: 0
            }}
          >
            <HiUserGroup size={40} />
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{ margin: '0 0 8px 0', fontSize: '2rem', fontWeight: '800' }}>
              {community.name}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
              {community.type === 'city' && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.875rem', color: '#6c757d' }}>
                  <HiLocationMarker />
                  {community.category}
                </span>
              )}
              <span style={{ fontSize: '0.875rem', color: '#6c757d' }}>
                {community.stats?.memberCount || 0} members
              </span>
              {community.isPublic ? (
                <span style={{ fontSize: '0.75rem', color: '#28a745', fontWeight: '600' }}>Public</span>
              ) : (
                <span style={{ fontSize: '0.75rem', color: '#6c757d', fontWeight: '600' }}>Private</span>
              )}
            </div>
            {community.description && (
              <p style={{ color: '#495057', marginBottom: '16px', lineHeight: '1.6' }}>
                {community.description}
              </p>
            )}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {community.isMember ? (
                <button className="btn btn-outlined" onClick={handleLeave}>
                  Leave Community
                </button>
              ) : (
                <button className="btn" onClick={handleJoin}>
                  Join Community
                </button>
              )}
              {community.isCreator && (
                <button 
                  className="btn" 
                  onClick={handleDelete}
                  style={{
                    background: '#dc2626',
                    color: 'white',
                    border: 'none'
                  }}
                >
                  <HiTrash size={18} style={{ marginRight: '6px', display: 'inline' }} />
                  Delete Community
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '2px solid #e9ecef' }}>
        <button
          onClick={() => setActiveTab('members')}
          style={{
            padding: '12px 24px',
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'members' ? '3px solid #e63946' : '3px solid transparent',
            color: activeTab === 'members' ? '#e63946' : '#6c757d',
            fontWeight: activeTab === 'members' ? '700' : '600',
            cursor: 'pointer',
            fontSize: '1rem',
            transition: 'all 0.3s ease'
          }}
        >
          Members ({community.stats?.memberCount || 0})
        </button>
        <button
          onClick={() => setActiveTab('posts')}
          style={{
            padding: '12px 24px',
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'posts' ? '3px solid #e63946' : '3px solid transparent',
            color: activeTab === 'posts' ? '#e63946' : '#6c757d',
            fontWeight: activeTab === 'posts' ? '700' : '600',
            cursor: 'pointer',
            fontSize: '1rem',
            transition: 'all 0.3s ease'
          }}
        >
          Posts ({community.stats?.postCount || 0})
        </button>
      </div>

      {/* Members Tab */}
      {activeTab === 'members' && (
        <div>
          {members.length === 0 ? (
            <div className="paper p-4 text-center">
              <HiUserGroup size={48} style={{ color: '#6c757d', marginBottom: '16px' }} />
              <p className="text-muted">No members yet</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' }}>
              {members.map((member) => (
                <div
                  key={member.id}
                  className="paper p-4"
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/profile/${member.id}`)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <div style={{ flexShrink: 0 }}>
                      <LevelBadge 
                        level={member.level || 1} 
                        size={50} 
                        currentLevel={999} 
                        showLabel={false} 
                      />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                        <div style={{ fontWeight: '600', fontSize: '1rem' }}>
                          {member.name}
                        </div>
                        {user && (String(member.id || member._id) === String(user._id || user.id)) && (
                          <span style={{
                            background: '#9333ea',
                            color: 'white',
                            fontSize: '0.625rem',
                            fontWeight: '700',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                          }}>
                            You
                          </span>
                        )}
                        {member.role && (
                          <span style={{
                            background: member.role === 'Admin' ? '#dc2626' : member.role === 'Moderator' ? '#ea580c' : '#6b7280',
                            color: 'white',
                            fontSize: '0.625rem',
                            fontWeight: '600',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                          }}>
                            {member.role}
                          </span>
                        )}
                        {getStatusDisplay(member) && (
                          <span style={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            fontSize: '0.625rem',
                            fontWeight: '600',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            letterSpacing: '0.5px'
                          }}>
                            {getStatusDisplay(member)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {member.bio && (
                    <p style={{ fontSize: '0.875rem', color: '#6c757d', marginBottom: '12px', lineHeight: '1.5' }}>
                      {member.bio.length > 100 ? `${member.bio.substring(0, 100)}...` : member.bio}
                    </p>
                  )}
                  {member.stats && (
                    <div style={{ display: 'flex', gap: '16px', fontSize: '0.75rem', color: '#6c757d' }}>
                      <span><strong>{member.stats.totalCheckIns || 0}</strong> check-ins</span>
                      <span><strong>{member.stats.totalReviews || 0}</strong> reviews</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Posts Tab */}
      {activeTab === 'posts' && (
        <div>
          {posts.length === 0 ? (
            <div className="paper p-4 text-center">
              <HiChat size={48} style={{ color: '#6c757d', marginBottom: '16px' }} />
              <p className="text-muted">No posts yet. Be the first to post!</p>
              {community.isMember && (
                <button className="btn" onClick={() => {/* TODO: Open create post modal */}} style={{ marginTop: '16px' }}>
                  Create Post
                </button>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {posts.map((post) => (
                <div key={post.id} className="paper p-4">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <div>
                      <LevelBadge 
                        level={post.user?.level || 1} 
                        size={40} 
                        currentLevel={post.user?.level || 1} 
                        showLabel={false} 
                      />
                    </div>
                    <div>
                      <div style={{ fontWeight: '600' }}>{post.user?.name || 'User'}</div>
                      <div style={{ fontSize: '0.75rem', color: '#6c757d' }}>
                        {new Date(post.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <p style={{ marginBottom: '12px', lineHeight: '1.6' }}>{post.content}</p>
                  {post.photos && post.photos.length > 0 && (
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                      {post.photos.map((photo, idx) => (
                        <img
                          key={idx}
                          src={photo}
                          alt="Post"
                          style={{
                            width: '150px',
                            height: '150px',
                            objectFit: 'cover',
                            borderRadius: '8px'
                          }}
                        />
                      ))}
                    </div>
                  )}
                  {post.locationTag && (
                    <div style={{ marginBottom: '12px', fontSize: '0.875rem', color: '#6c757d' }}>
                      <HiLocationMarker style={{ display: 'inline', marginRight: '4px' }} />
                      {post.locationTag.name}
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <button className="btn btn-text" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <HiHeart size={18} />
                      {post.likes || 0}
                    </button>
                    <button className="btn btn-text" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <HiChat size={18} />
                      {post.comments || 0}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CommunityDetailPage;

