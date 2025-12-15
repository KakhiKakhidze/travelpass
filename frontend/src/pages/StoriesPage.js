import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { HiCamera, HiHeart, HiLocationMarker, HiX, HiPlus } from 'react-icons/hi';
import LevelBadge from '../components/LevelBadge';

const StoriesPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedStory, setSelectedStory] = useState(null);
  const [viewingStory, setViewingStory] = useState(null);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      setLoading(true);
      const response = await api.get('/stories/feed');
      setStories(response.data.data.stories || []);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to load stories');
    } finally {
      setLoading(false);
    }
  };

  const handleViewStory = async (story) => {
    setViewingStory(story);
    // Mark as viewed
    try {
      await api.post(`/stories/${story.id}/view`);
      fetchStories(); // Refresh to update view count
    } catch (err) {
      console.error('Failed to mark story as viewed:', err);
    }
  };

  const handleReact = async (storyId, hasReacted) => {
    try {
      if (hasReacted) {
        await api.delete(`/stories/${storyId}/react`);
      } else {
        await api.post(`/stories/${storyId}/react`, { type: 'like' });
      }
      fetchStories();
    } catch (err) {
      console.error('Failed to react:', err);
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ margin: 0 }}>Travel Stories</h2>
        <button className="btn" onClick={() => setShowCreateModal(true)}>
          <HiPlus size={20} style={{ marginRight: '6px', display: 'inline' }} />
          Create Story
        </button>
      </div>

      {error && (
        <div className="alert alert-error mb-3">
          {error}
        </div>
      )}

      {stories.length === 0 ? (
        <div className="paper p-4 text-center">
          <HiCamera size={48} style={{ color: '#6c757d', marginBottom: '16px' }} />
          <p className="text-muted">No stories yet. Create your first story!</p>
          <button className="btn" onClick={() => setShowCreateModal(true)} style={{ marginTop: '16px' }}>
            Create Story
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
          {stories.map((story) => (
            <div
              key={story.id}
              className="paper p-0"
              style={{ cursor: 'pointer', overflow: 'hidden', borderRadius: '16px' }}
              onClick={() => handleViewStory(story)}
            >
              <div style={{ position: 'relative', paddingBottom: '133%' }}>
                <img
                  src={story.photos[0]}
                  alt="Story"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
                <div style={{
                  position: 'absolute',
                  top: '8px',
                  left: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'rgba(0,0,0,0.5)',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '0.75rem'
                }}>
                  <LevelBadge level={story.userId?.level || 1} size={20} currentLevel={999} showLabel={false} />
                  <span>{story.userId?.name}</span>
                </div>
                <div style={{
                  position: 'absolute',
                  bottom: '8px',
                  left: '8px',
                  right: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  color: 'white',
                  fontSize: '0.75rem'
                }}>
                  <span>{story.views} views</span>
                  <span>{story.reactions} reactions</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Story Viewer Modal */}
      {viewingStory && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.9)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }} onClick={() => setViewingStory(null)}>
          <div style={{
            maxWidth: '500px',
            width: '100%',
            background: 'white',
            borderRadius: '16px',
            overflow: 'hidden',
            position: 'relative'
          }} onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setViewingStory(null)}
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: 'rgba(0,0,0,0.5)',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                cursor: 'pointer',
                zIndex: 10
              }}
            >
              <HiX size={20} />
            </button>
            <div style={{ position: 'relative' }}>
              <img
                src={viewingStory.photos[0]}
                alt="Story"
                style={{ width: '100%', height: '500px', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                padding: '24px',
                color: 'white'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <LevelBadge level={viewingStory.userId?.level || 1} size={40} currentLevel={999} showLabel={false} />
                  <div>
                    <div style={{ fontWeight: '600' }}>{viewingStory.userId?.name}</div>
                    <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>
                      {new Date(viewingStory.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
                {viewingStory.caption && (
                  <p style={{ marginBottom: '12px' }}>{viewingStory.caption}</p>
                )}
                {viewingStory.locationTag && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px', fontSize: '0.875rem' }}>
                    <HiLocationMarker />
                    {viewingStory.locationTag.name}
                  </div>
                )}
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReact(viewingStory.id, viewingStory.hasReacted);
                    }}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      cursor: 'pointer',
                      fontSize: '1rem'
                    }}
                  >
                    <HiHeart size={24} fill={viewingStory.hasReacted ? 'white' : 'none'} />
                    {viewingStory.reactions}
                  </button>
                  <span style={{ fontSize: '0.875rem', opacity: 0.8 }}>
                    {viewingStory.views} views
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Story Modal - Placeholder */}
      {showCreateModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }} onClick={() => setShowCreateModal(false)}>
          <div className="paper p-4" style={{ maxWidth: '500px', width: '100%' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: '16px' }}>Create Story</h3>
            <p className="text-muted">Story creation feature coming soon!</p>
            <button className="btn" onClick={() => setShowCreateModal(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoriesPage;

