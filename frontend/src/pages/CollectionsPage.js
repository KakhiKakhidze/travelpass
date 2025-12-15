import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { HiBookmark, HiLocationMarker, HiPlus, HiHeart, HiUser } from 'react-icons/hi';
import LevelBadge from '../components/LevelBadge';

const CollectionsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: '',
    description: '',
    isPublic: true,
    tags: []
  });

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      setLoading(true);
      const response = await api.get('/collections');
      setCollections(response.data.data.collections || []);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to load collections');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCollection = async (e) => {
    e.preventDefault();
    try {
      await api.post('/collections', createForm);
      await fetchCollections();
      setShowCreateModal(false);
      setCreateForm({ name: '', description: '', isPublic: true, tags: [] });
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to create collection');
    }
  };

  const handleFollow = async (collectionId, isFollowing) => {
    try {
      if (isFollowing) {
        await api.delete(`/collections/${collectionId}/follow`);
      } else {
        await api.post(`/collections/${collectionId}/follow`);
      }
      await fetchCollections();
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to follow/unfollow collection');
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
        <h2 style={{ margin: 0 }}>Location Collections</h2>
        <button className="btn" onClick={() => setShowCreateModal(true)}>
          <HiPlus size={20} style={{ marginRight: '6px', display: 'inline' }} />
          Create Collection
        </button>
      </div>

      {error && (
        <div className="alert alert-error mb-3">
          {error}
        </div>
      )}

      {collections.length === 0 ? (
        <div className="paper p-4 text-center">
          <HiBookmark size={48} style={{ color: '#6c757d', marginBottom: '16px' }} />
          <p className="text-muted">No collections yet. Create your first collection!</p>
          <button className="btn" onClick={() => setShowCreateModal(true)} style={{ marginTop: '16px' }}>
            Create Collection
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {collections.map((collection) => (
            <div
              key={collection.id}
              className="paper p-4"
              style={{ cursor: 'pointer' }}
              onClick={() => navigate(`/collections/${collection.id}`)}
            >
              {collection.coverPhoto ? (
                <img
                  src={collection.coverPhoto}
                  alt={collection.name}
                  style={{
                    width: '100%',
                    height: '200px',
                    objectFit: 'cover',
                    borderRadius: '12px',
                    marginBottom: '16px'
                  }}
                />
              ) : (
                <div style={{
                  width: '100%',
                  height: '200px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px',
                  color: 'white',
                  fontSize: '3rem'
                }}>
                  <HiBookmark />
                </div>
              )}
              <h3 style={{ marginBottom: '8px', fontSize: '1.25rem' }}>{collection.name}</h3>
              {collection.description && (
                <p style={{ color: '#6c757d', marginBottom: '12px', fontSize: '0.875rem' }}>
                  {collection.description.length > 100 ? `${collection.description.substring(0, 100)}...` : collection.description}
                </p>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <LevelBadge level={collection.userId?.level || 1} size={24} currentLevel={999} showLabel={false} />
                  <span style={{ fontSize: '0.875rem', color: '#6c757d' }}>{collection.userId?.name}</span>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '16px', fontSize: '0.875rem', color: '#6c757d' }}>
                  <span><HiLocationMarker style={{ display: 'inline', marginRight: '4px' }} />{collection.stats?.locationCount || 0} locations</span>
                  <span><HiUser style={{ display: 'inline', marginRight: '4px' }} />{collection.stats?.followerCount || 0} followers</span>
                </div>
                <button
                  className="btn btn-text"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFollow(collection.id, collection.isFollowing);
                  }}
                  style={{
                    color: collection.isFollowing ? '#e63946' : '#6c757d',
                    fontSize: '0.875rem'
                  }}
                >
                  {collection.isFollowing ? 'Following' : 'Follow'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Collection Modal */}
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
            <h3 style={{ marginBottom: '16px' }}>Create Collection</h3>
            <form onSubmit={handleCreateCollection}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                  Collection Name *
                </label>
                <input
                  type="text"
                  required
                  value={createForm.name}
                  onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e9ecef',
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}
                  placeholder="e.g., Best Coffee Shops in Tbilisi"
                />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                  Description
                </label>
                <textarea
                  value={createForm.description}
                  onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e9ecef',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    minHeight: '100px',
                    resize: 'vertical'
                  }}
                  placeholder="Describe your collection..."
                />
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={createForm.isPublic}
                    onChange={(e) => setCreateForm({ ...createForm, isPublic: e.target.checked })}
                  />
                  Public (anyone can see and follow)
                </label>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="submit" className="btn">
                  Create Collection
                </button>
                <button type="button" className="btn btn-outlined" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollectionsPage;

