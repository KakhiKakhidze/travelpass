import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Badge from '../components/Badge';
import LevelBadge, { LevelProgress } from '../components/LevelBadge';

const ProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [tasteMemories, setTasteMemories] = useState([]);
  const [selectedMemories, setSelectedMemories] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // Get status display - use currentStatus.text if available, otherwise show travel status based on level
  const getStatusDisplay = () => {
    if (user?.currentStatus?.text) {
      return user.currentStatus.text;
    }
    // If no currentStatus, show travel status based on level (cycling through the list)
    const statusIndex = (user?.level || 1) % travelStatuses.length;
    return travelStatuses[statusIndex];
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch check-ins, reviews, and stamps (taste memories)
      const [checkinsRes, reviewsRes, stampsRes] = await Promise.all([
        api.get('/checkins?limit=1').catch(() => ({ data: { data: { pagination: { total: 0 } } } })),
        api.get('/reviews?limit=1').catch(() => ({ data: { data: { pagination: { total: 0 } } } })),
        api.get('/stamps?limit=10').catch(() => ({ data: { data: { stamps: [], pagination: { total: 0 } } } })),
      ]);

      const stamps = stampsRes.data.data.stamps || [];

      setStats({
        totalCheckIns: checkinsRes.data.data.pagination?.total || 0,
        totalReviews: reviewsRes.data.data.pagination?.total || 0,
        tasteMemory: stampsRes.data.data.pagination?.total || 0,
      });
      
      setTasteMemories(stamps);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      setStats({
        totalCheckIns: 0,
        totalReviews: 0,
        tasteMemory: 0,
      });
      setTasteMemories([]);
    } finally {
      setLoading(false);
    }
  };

  const getXPForNextLevel = () => {
    const levelXP = [0, 50, 150, 300, 500];
    return levelXP[user.level] || 500;
  };

 

  
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh' 
      }}>
        <div className="progress-circular"></div>
      </div>
    );
  }

  return (
    <div style={{ background: '#ffffff', minHeight: '100vh', padding: '40px 24px' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '48px' }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: '800', 
            marginBottom: '12px',
            color: '#212529',
            letterSpacing: '-1px'
          }}>
            My Profile
          </h1>
          <p style={{ fontSize: '1.125rem', color: '#6c757d', margin: 0 }}>
            Manage your account and track your travel journey
          </p>
        </div>


        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '32px' 
        }}>
          {/* Profile Card */}
          <div style={{
            background: 'white',
            borderRadius: '24px',
            padding: '40px',
            border: '1px solid #e9ecef',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ margin: '0 auto 24px', display: 'flex', justifyContent: 'center' }}>
                <LevelBadge 
                  level={user.level || 1} 
                  size={120} 
                  currentLevel={user.level || 1} 
                  showLabel={false} 
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                <h2 style={{ 
                  fontSize: '1.75rem', 
                  fontWeight: '700', 
                  margin: 0,
                  color: '#212529'
                }}>
                  {user.name}
                </h2>
                {getStatusDisplay() && (
                  <span style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    padding: '4px 10px',
                    borderRadius: '12px',
                    letterSpacing: '0.5px'
                  }}>
                    {getStatusDisplay()}
                  </span>
                )}
              </div>
              <p style={{ 
                fontSize: '1rem', 
                color: '#6c757d',
                marginBottom: '20px'
              }}>
                {user.email}
              </p>
              <div style={{
                display: 'inline-block',
                padding: '10px 20px',
                background: 'linear-gradient(135deg, #2d5016 0%, #1a3009 100%)',
                color: 'white',
                borderRadius: '20px',
                fontSize: '0.9375rem',
                fontWeight: '600',
                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)'
              }}>
                {getStatusDisplay()}
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div>
            {/* Status Progress Card */}
            <LevelProgress 
              currentLevel={user.level || 1} 
              xp={user.xp || 0} 
              xpForNextLevel={getXPForNextLevel()} 
            />

            {/* Stats Grid */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
              gap: '16px',
              marginBottom: '24px'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #2d5016 0%, #1a3009 100%)',
                padding: '24px',
                borderRadius: '16px',
                color: 'white',
                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)'
              }}>
                <div style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '4px' }}>
                  {stats?.totalStamps || 0}
                </div>
                <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>
                  Stamps Collected
                </div>
              </div>
              <div style={{
                background: 'linear-gradient(135deg, #ff6f00 0%, #e65100 100%)',
                padding: '24px',
                borderRadius: '16px',
                color: 'white',
                boxShadow: '0 4px 12px rgba(255, 111, 0, 0.3)'
              }}>
                <div style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '4px' }}>
                  {stats?.rewards || 0}
                </div>
                <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>
                  Active Rewards
                </div>
              </div>
              <div style={{
                background: 'linear-gradient(135deg, #9d4edd 0%, #7b2cbf 100%)',
                padding: '24px',
                borderRadius: '16px',
                color: 'white',
                boxShadow: '0 4px 12px rgba(157, 78, 221, 0.3)'
              }}>
                <div style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '4px' }}>
                  {stats?.tasteMemory || 0}
                </div>
                <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>
                  Taste Memory
                </div>
              </div>
            </div>

            {/* Level Badges */}
            <div style={{
              background: 'white',
              borderRadius: '24px',
              padding: '32px',
              border: '1px solid #e9ecef',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              marginBottom: '24px'
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px'
              }}>
                <h3 style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: '700',
                  color: '#212529',
                  margin: 0
                }}>
                  Status Badges
                </h3>
                <button
                  onClick={() => navigate('/status')}
                  style={{
                    padding: '8px 16px',
                    background: 'transparent',
                    border: '2px solid #2d5016',
                    color: '#2d5016',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#e63946';
                    e.target.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'transparent';
                    e.target.style.color = '#e63946';
                  }}
                >
                  View All Status Levels
                </button>
              </div>
              <div style={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                gap: '24px',
                justifyContent: 'center'
              }}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                  <LevelBadge 
                    key={level}
                    level={level} 
                    size={80} 
                    currentLevel={user.level || 1}
                    showLabel={false}
                  />
                ))}
              </div>
            </div>

            {/* Achievement Badges */}
            <div style={{
              background: 'white',
              borderRadius: '24px',
              padding: '32px',
              border: '1px solid #e9ecef',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              marginBottom: '24px'
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px'
              }}>
                <h3 style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: '700',
                  color: '#212529',
                  margin: 0
                }}>
                  Achievement Badges
                </h3>
              </div>
              <div style={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                gap: '24px',
                justifyContent: 'center'
              }}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((badgeType) => {
                  const earned = user.badges && user.badges.includes(badgeType);
                  return (
                    <Badge 
                      key={badgeType}
                      type={badgeType} 
                      size={80} 
                      earned={earned}
                    />
                  );
                })}
              </div>
            </div>

            {/* Preferences */}
            {user.preferences && user.preferences.length > 0 && (
              <div style={{
                background: 'white',
                borderRadius: '24px',
                padding: '32px',
                border: '1px solid #e9ecef',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
              }}>
                <h3 style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: '700', 
                  marginBottom: '20px',
                  color: '#212529'
                }}>
                  Food Interests
                </h3>
                <div style={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: '12px' 
                }}>
                  {user.preferences.map((pref, idx) => (
                    <span 
                      key={idx}
                      style={{
                        padding: '10px 20px',
                        background: '#f8f9fa',
                        color: '#495057',
                        borderRadius: '20px',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        border: '2px solid #e9ecef'
                      }}
                    >
                      {pref.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Taste Memory */}
            <div style={{
              background: 'white',
              borderRadius: '24px',
              padding: '32px',
              border: '1px solid #e9ecef',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              marginTop: '24px'
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px'
              }}>
                <h3 style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: '700', 
                  margin: 0,
                  color: '#212529'
                }}>
                  🧠 Taste Memory™
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  {selectedMemories.length > 0 && (
                    <span style={{
                      fontSize: '0.875rem',
                      color: '#9d4edd',
                      fontWeight: '600'
                    }}>
                      {selectedMemories.length} selected
                    </span>
                  )}
                  {tasteMemories.length > 0 && (
                    <span style={{
                      fontSize: '0.875rem',
                      color: '#6c757d',
                      fontWeight: '600'
                    }}>
                      {stats?.tasteMemory || 0} memories
                    </span>
                  )}
                  <button
                    onClick={() => navigate('/taste-memory')}
                    style={{
                      padding: '8px 16px',
                      background: 'linear-gradient(135deg, #9d4edd 0%, #7b2cbf 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      whiteSpace: 'nowrap'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 4px 12px rgba(157, 78, 221, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    View Full Profile
                  </button>
                </div>
              </div>
              {tasteMemories.length > 0 ? (
                <div style={{ 
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                  gap: '20px'
                }}>
                  {tasteMemories.map((memory) => {
                    const isSelected = selectedMemories.includes(memory.id);
                    return (
                      <div
                        key={memory.id}
                        onClick={() => {
                          if (isSelected) {
                            setSelectedMemories(selectedMemories.filter(id => id !== memory.id));
                          } else {
                            setSelectedMemories([...selectedMemories, memory.id]);
                          }
                        }}
                        style={{
                          background: isSelected ? 'linear-gradient(135deg, #9d4edd15 0%, #7b2cbf15 100%)' : '#f8f9fa',
                          borderRadius: '16px',
                          padding: '16px',
                          border: isSelected ? '2px solid #9d4edd' : '1px solid #e9ecef',
                          transition: 'all 0.3s ease',
                          cursor: 'pointer',
                          position: 'relative',
                          transform: isSelected ? 'translateY(-4px)' : 'translateY(0)',
                          boxShadow: isSelected ? '0 8px 16px rgba(157, 78, 221, 0.3)' : 'none'
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected) {
                            e.currentTarget.style.transform = 'translateY(-4px)';
                            e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
                            e.currentTarget.style.borderColor = '#9d4edd';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                            e.currentTarget.style.borderColor = '#e9ecef';
                          }
                        }}
                      >
                        {isSelected && (
                          <div style={{
                            position: 'absolute',
                            top: '12px',
                            right: '12px',
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #9d4edd 0%, #7b2cbf 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            boxShadow: '0 2px 8px rgba(157, 78, 221, 0.4)'
                          }}>
                            ✓
                          </div>
                        )}
                      {memory.photo && (
                        <div style={{
                          width: '100%',
                          height: '120px',
                          borderRadius: '12px',
                          background: `url(${memory.photo}) center/cover`,
                          marginBottom: '12px'
                        }} />
                      )}
                      <div style={{
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: '#9d4edd',
                        marginBottom: '4px'
                      }}>
                        {memory.venue?.name || 'Unknown Venue'}
                      </div>
                      <div style={{
                        fontSize: '1rem',
                        fontWeight: '700',
                        color: '#212529',
                        marginBottom: '4px'
                      }}>
                        {memory.dishName || 'Taste Experience'}
                      </div>
                      {memory.dishDescription && (
                        <div style={{
                          fontSize: '0.75rem',
                          color: '#6c757d',
                          marginBottom: '8px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical'
                        }}>
                          {memory.dishDescription}
                        </div>
                      )}
                      {memory.scannedAt && (
                        <div style={{
                          fontSize: '0.75rem',
                          color: '#adb5bd'
                        }}>
                          {new Date(memory.scannedAt).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                    );
                  })}
                </div>
              ) : (
                <div style={{
                  textAlign: 'center',
                  padding: '40px 20px',
                  color: '#6c757d'
                }}>
                  <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🧠</div>
                  <div style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '8px' }}>
                    No taste memories yet
                  </div>
                  <div style={{ fontSize: '0.875rem', marginBottom: '16px' }}>
                    Start collecting stamps at venues to build your taste memory!
                  </div>
                  <button
                    onClick={() => navigate('/scan')}
                    style={{
                      padding: '12px 24px',
                      background: 'linear-gradient(135deg, #9d4edd 0%, #7b2cbf 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 4px 12px rgba(157, 78, 221, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    Scan QR Code
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ 
          marginTop: '48px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px'
        }}>
          <button
            onClick={() => navigate('/map')}
            style={{
              padding: '20px',
              background: 'white',
              border: '1px solid #e9ecef',
              borderRadius: '16px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              textAlign: 'left'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-4px)';
              e.target.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
              e.target.style.borderColor = '#2d5016';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
              e.target.style.borderColor = '#e9ecef';
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📍</div>
            <div style={{ fontSize: '1rem', fontWeight: '600', color: '#212529' }}>
              Explore Venues
            </div>
          </button>
          <button
            onClick={() => navigate('/scan')}
            style={{
              padding: '20px',
              background: 'white',
              border: '1px solid #e9ecef',
              borderRadius: '16px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              textAlign: 'left'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-4px)';
              e.target.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
              e.target.style.borderColor = '#2d5016';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
              e.target.style.borderColor = '#e9ecef';
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📷</div>
            <div style={{ fontSize: '1rem', fontWeight: '600', color: '#212529' }}>
              Scan QR Code
            </div>
          </button>
          <button
            onClick={() => navigate('/challenges')}
            style={{
              padding: '20px',
              background: 'white',
              border: '1px solid #e9ecef',
              borderRadius: '16px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              textAlign: 'left'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-4px)';
              e.target.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
              e.target.style.borderColor = '#2d5016';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
              e.target.style.borderColor = '#e9ecef';
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🏆</div>
            <div style={{ fontSize: '1rem', fontWeight: '600', color: '#212529' }}>
              View Challenges
            </div>
          </button>
          <button
            onClick={() => navigate('/communities')}
            style={{
              padding: '20px',
              background: 'white',
              border: '1px solid #e9ecef',
              borderRadius: '16px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              textAlign: 'left'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-4px)';
              e.target.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
              e.target.style.borderColor = '#2d5016';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
              e.target.style.borderColor = '#e9ecef';
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>👥</div>
            <div style={{ fontSize: '1rem', fontWeight: '600', color: '#212529' }}>
              My Communities
            </div>
          </button>
          <button
            onClick={() => navigate('/taste-memory')}
            style={{
              padding: '20px',
              background: 'white',
              border: '1px solid #e9ecef',
              borderRadius: '16px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              textAlign: 'left'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-4px)';
              e.target.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
              e.target.style.borderColor = '#9d4edd';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
              e.target.style.borderColor = '#e9ecef';
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🧠</div>
            <div style={{ fontSize: '1rem', fontWeight: '600', color: '#212529' }}>
              Taste Memory™
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
