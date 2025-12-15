import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { HiUserGroup, HiLocationMarker, HiPlus, HiX } from 'react-icons/hi';

const CommunitiesPage = () => {
  const navigate = useNavigate();
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: '',
    description: '',
    type: 'city',
    category: '',
    isPublic: true,
    joinApproval: false
  });

  useEffect(() => {
    fetchCommunities();
  }, []);

  const fetchCommunities = async () => {
    try {
      setLoading(true);
      const response = await api.get('/communities');
      const communitiesData = response.data.data.communities || [];
      
      // Check which communities user is a member of
      const communitiesWithMembership = await Promise.all(
        communitiesData.map(async (community) => {
          try {
            const detailResponse = await api.get(`/communities/${community.id}`);
            return {
              ...community,
              isMember: detailResponse.data.data.community.isMember || false
            };
          } catch {
            return { ...community, isMember: false };
          }
        })
      );
      
      setCommunities(communitiesWithMembership);
      setError('');
    } catch (err) {
      // Fallback to mock data if API fails
      setCommunities([
        {
          id: '1',
          name: 'Tbilisi Travelers',
          description: 'Community for travelers exploring Tbilisi',
          type: 'city',
          category: 'Tbilisi',
          stats: { memberCount: 124 },
          isPublic: true,
          isMember: false
        },
        {
          id: '2',
          name: 'Georgian Food Lovers',
          description: 'Share your favorite Georgian food experiences',
          type: 'interest',
          category: 'Food',
          stats: { memberCount: 89 },
          isPublic: true,
          isMember: true
        },
        {
          id: '3',
          name: 'Hiking Georgia',
          description: 'Discover hiking trails and mountain adventures',
          type: 'interest',
          category: 'Hiking',
          stats: { memberCount: 67 },
          isPublic: true,
          isMember: false
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCommunity = async (e) => {
    e.preventDefault();
    try {
      // In real implementation:
      // const response = await api.post('/api/communities', createForm);
      // await fetchCommunities();
      // setShowCreateModal(false);
      
      // Mock for now
      const response = await api.post('/communities', createForm);
      const newCommunity = response.data.data.community;
      setShowCreateModal(false);
      setCreateForm({
        name: '',
        description: '',
        type: 'city',
        category: '',
        isPublic: true,
        joinApproval: false
      });
      // Navigate to the new community detail page
      navigate(`/communities/${newCommunity.id}`);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to create community');
    }
  };

  const handleJoinCommunity = async (communityId) => {
    try {
      await api.post(`/communities/${communityId}/join`);
      // Navigate to community detail page to see members
      navigate(`/communities/${communityId}`);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to join community');
    }
  };

  const handleLeaveCommunity = async (communityId) => {
    try {
      await api.delete(`/communities/${communityId}/leave`);
      await fetchCommunities();
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to leave community');
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
        <h2>Communities</h2>
        <button 
          className="btn" 
          onClick={() => setShowCreateModal(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <HiPlus size={20} />
          Create Community
        </button>
      </div>

      {error && (
        <div className="alert alert-error mb-3">
          {error}
        </div>
      )}

      {/* Create Community Modal */}
      {showCreateModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div className="paper" style={{ 
            maxWidth: '500px', 
            width: '100%', 
            padding: '32px',
            position: 'relative'
          }}>
            <button
              onClick={() => setShowCreateModal(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#6c757d'
              }}
            >
              <HiX />
            </button>
            <h3 style={{ marginBottom: '24px' }}>Create Community</h3>
            <form onSubmit={handleCreateCommunity}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                  Community Name *
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
                  placeholder="e.g., Tbilisi Travelers"
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                  Description *
                </label>
                <textarea
                  required
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
                  placeholder="Describe your community..."
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                  Type *
                </label>
                <select
                  value={createForm.type}
                  onChange={(e) => setCreateForm({ ...createForm, type: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e9ecef',
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}
                >
                  <option value="city">City-based</option>
                  <option value="interest">Interest-based</option>
                  <option value="custom">Custom</option>
                </select>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                  Category *
                </label>
                <input
                  type="text"
                  required
                  value={createForm.category}
                  onChange={(e) => setCreateForm({ ...createForm, category: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e9ecef',
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}
                  placeholder={createForm.type === 'city' ? 'e.g., Tbilisi' : 'e.g., Food, Hiking'}
                />
              </div>

              <div style={{ marginBottom: '24px', display: 'flex', gap: '16px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={createForm.isPublic}
                    onChange={(e) => setCreateForm({ ...createForm, isPublic: e.target.checked })}
                  />
                  Public (anyone can join)
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={createForm.joinApproval}
                    onChange={(e) => setCreateForm({ ...createForm, joinApproval: e.target.checked })}
                  />
                  Require approval
                </label>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className="btn btn-text"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn">
                  Create Community
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {communities.map((community) => (
          <div
            key={community.id}
            className="paper p-4"
            style={{ cursor: 'pointer' }}
            onClick={() => navigate(`/communities/${community.id}`)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  background: '#e63946',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white'
                }}
              >
                <HiUserGroup size={24} />
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: 0 }}>{community.name}</h4>
                <div style={{ fontSize: '0.875rem', color: '#6c757d' }}>
                  {community.type === 'city' && <HiLocationMarker style={{ display: 'inline' }} />}
                  {community.type === 'city' ? 'City' : 'Interest'} Community
                </div>
              </div>
            </div>
            <p style={{ color: '#6c757d', marginBottom: '12px' }}>{community.description}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.875rem', color: '#6c757d' }}>
                {community.stats?.memberCount || community.memberCount || 0} members
              </span>
              {community.isPublic ? (
                <span style={{ fontSize: '0.75rem', color: '#28a745' }}>Public</span>
              ) : (
                <span style={{ fontSize: '0.75rem', color: '#6c757d' }}>Private</span>
              )}
            </div>
            {community.isMember ? (
              <button
                className="btn btn-outlined"
                onClick={(e) => {
                  e.stopPropagation();
                  handleLeaveCommunity(community.id);
                }}
                style={{ width: '100%' }}
              >
                Leave Community
              </button>
            ) : (
              <button
                className="btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleJoinCommunity(community.id);
                }}
                style={{ width: '100%' }}
              >
                Join Community
              </button>
            )}
          </div>
        ))}
      </div>

      {communities.length === 0 && !loading && (
        <div className="paper p-4 text-center">
          <HiUserGroup size={48} style={{ color: '#6c757d', marginBottom: '16px' }} />
          <p className="text-muted">No communities yet. Be the first to create one!</p>
          <button
            className="btn"
            onClick={() => setShowCreateModal(true)}
            style={{ marginTop: '16px' }}
          >
            Create Community
          </button>
        </div>
      )}
    </div>
  );
};

export default CommunitiesPage;

