import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { 
  HiSparkles,
  HiStar,
  HiTrendingUp,
  HiClock,
  HiHeart,
  HiCog
} from 'react-icons/hi';
import TastePreferenceSetup from '../components/TastePreferenceSetup';

const TasteMemoryPage = () => {
  const navigate = useNavigate();
  const [tasteProfile, setTasteProfile] = useState(null);
  const [tasteHistory, setTasteHistory] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [showSetup, setShowSetup] = useState(false);
  const [needsSetup, setNeedsSetup] = useState(false);

  useEffect(() => {
    fetchTasteProfile();
    fetchTasteHistory();
    fetchRecommendations();
  }, []);

  const fetchTasteProfile = async () => {
    try {
      const response = await api.get('/taste/profile');
      const profile = response.data.data;
      setTasteProfile(profile);
      
      // Check if profile needs setup
      const hasFlavors = profile?.flavorPreferences && Object.keys(profile.flavorPreferences).length > 0;
      const hasAnyData = profile?.favoriteDishes?.length > 0 || hasFlavors;
      setNeedsSetup(!hasAnyData);
    } catch (error) {
      console.error('Failed to fetch taste profile:', error);
      // If profile doesn't exist, show setup
      setNeedsSetup(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSetupComplete = () => {
    setShowSetup(false);
    setNeedsSetup(false);
    fetchTasteProfile();
    fetchRecommendations();
  };

  const fetchTasteHistory = async () => {
    try {
      const response = await api.get('/taste/history');
      const history = response.data.data || [];
      
      // If no history, show example data
      if (history.length === 0) {
        setTasteHistory(getExampleTasteHistory());
      } else {
        setTasteHistory(history);
      }
    } catch (error) {
      console.error('Failed to fetch taste history:', error);
      // Show example data on error
      setTasteHistory(getExampleTasteHistory());
    }
  };

  const fetchRecommendations = async () => {
    try {
      const response = await api.get('/taste/recommendations');
      const recs = response.data.data || [];
      
      // If no recommendations, show example data
      if (recs.length === 0) {
        setRecommendations(getExampleRecommendations());
      } else {
        setRecommendations(recs);
      }
    } catch (error) {
      console.error('Failed to fetch recommendations:', error);
      // Show example data on error
      setRecommendations(getExampleRecommendations());
    }
  };

  // Example taste history data
  const getExampleTasteHistory = () => {
    return [
      {
        stampId: 'example1',
        dishName: 'Khachapuri Adjaruli',
        venueName: 'Cafe Littera',
        rating: 5,
        flavorNotes: ['cheesy', 'buttery', 'warm'],
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
      },
      {
        stampId: 'example2',
        dishName: 'Khinkali',
        venueName: 'Barbarestan',
        rating: 5,
        flavorNotes: ['savory', 'aromatic', 'hearty'],
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
      },
      {
        stampId: 'example3',
        dishName: 'Churchkhela',
        venueName: 'Shemoikhede Genatsvale',
        rating: 4,
        flavorNotes: ['sweet', 'nutty', 'chewy'],
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
      },
      {
        stampId: 'example4',
        dishName: 'Mtsvadi (Georgian BBQ)',
        venueName: 'Azarphesha',
        rating: 5,
        flavorNotes: ['smoky', 'savory', 'aromatic'],
        timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) // 10 days ago
      },
      {
        stampId: 'example5',
        dishName: 'Lobio (Bean Stew)',
        venueName: 'Cafe Littera',
        rating: 4,
        flavorNotes: ['savory', 'aromatic', 'hearty'],
        timestamp: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000) // 12 days ago
      },
      {
        stampId: 'example6',
        dishName: 'Badrijani Nigvzit',
        venueName: 'Barbarestan',
        rating: 4,
        flavorNotes: ['creamy', 'nutty', 'fresh'],
        timestamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000) // 15 days ago
      }
    ];
  };

  // Example recommendations data
  const getExampleRecommendations = () => {
    return [
      {
        dishName: 'Khachapuri Imeruli',
        venueName: 'Cafe Littera',
        reason: 'Based on your preference for cheesy dishes',
        icon: '🧀'
      },
      {
        dishName: 'Satsivi',
        venueName: 'Barbarestan',
        reason: 'Perfect match for your love of aromatic flavors',
        icon: '🍗'
      },
      {
        dishName: 'Pkhali',
        venueName: 'Azarphesha',
        reason: 'Fresh and flavorful - matches your taste profile',
        icon: '🥗'
      },
      {
        dishName: 'Chakapuli',
        venueName: 'Shemoikhede Genatsvale',
        reason: 'Herbaceous and savory, great for your preferences',
        icon: '🍲'
      },
      {
        dishName: 'Kharcho',
        venueName: 'Cafe Littera',
        reason: 'Rich and hearty, based on your taste history',
        icon: '🍲'
      },
      {
        dishName: 'Elarji',
        venueName: 'Barbarestan',
        reason: 'Creamy and cheesy - you\'ll love this!',
        icon: '🧀'
      }
    ];
  };

  const flavorTags = ['spicy', 'sweet', 'savory', 'sour', 'bitter', 'aromatic', 'cheesy', 'buttery', 'smoky', 'fresh'];
  const preferredFlavors = tasteProfile?.flavorPreferences || {};

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
        <div style={{ marginBottom: '48px', textAlign: 'center' }}>
          <div style={{ 
            fontSize: '64px', 
            marginBottom: '16px',
            display: 'inline-block',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            <HiSparkles size={64} />
          </div>
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: '800', 
            marginBottom: '12px',
            color: '#212529',
            letterSpacing: '-1px'
          }}>
            Taste Memory™
          </h1>
          <p style={{ fontSize: '1.125rem', color: '#6c757d', margin: 0 }}>
            Your personalized taste profile based on your travel journey
          </p>
        </div>

        {/* Setup Button */}
        {(needsSetup || !tasteProfile) && !showSetup && (
          <div style={{ marginBottom: '32px', textAlign: 'center' }}>
            <button
              onClick={() => setShowSetup(true)}
              style={{
                padding: '16px 32px',
                fontSize: '1rem',
                fontWeight: '600',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                transition: 'all 0.3s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
              }}
            >
              <HiCog size={20} />
              Set Up Your Taste Profile
            </button>
          </div>
        )}

        {/* Edit Profile Button */}
        {tasteProfile && !needsSetup && !showSetup && (
          <div style={{ marginBottom: '32px', textAlign: 'right' }}>
            <button
              onClick={() => setShowSetup(true)}
              style={{
                padding: '10px 20px',
                fontSize: '0.875rem',
                fontWeight: '600',
                background: 'white',
                color: '#667eea',
                border: '2px solid #667eea',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#667eea';
                e.target.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'white';
                e.target.style.color = '#667eea';
              }}
            >
              <HiCog size={16} />
              Edit Preferences
            </button>
          </div>
        )}

        {/* Taste Preference Setup */}
        {showSetup && (
          <div style={{ marginBottom: '48px' }}>
            <TastePreferenceSetup
              onComplete={handleSetupComplete}
              onSkip={() => {
                setShowSetup(false);
                if (needsSetup) {
                  setNeedsSetup(false);
                }
              }}
            />
          </div>
        )}

        {/* Tabs */}
        {!showSetup && (
          <div style={{ 
            display: 'flex', 
            gap: '8px', 
            marginBottom: '32px',
            borderBottom: '2px solid #e9ecef',
            paddingBottom: '16px'
          }}>
          {[
            { id: 'profile', label: 'Taste Profile', icon: HiSparkles },
            { id: 'history', label: 'Taste History', icon: HiClock },
            { id: 'recommendations', label: 'Recommendations', icon: HiTrendingUp }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '12px 24px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  background: activeTab === tab.id ? '#667eea' : 'transparent',
                  color: activeTab === tab.id ? 'white' : '#6c757d',
                  border: 'none',
                  borderRadius: '8px 8px 0 0',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  borderBottom: activeTab === tab.id ? '3px solid #667eea' : '3px solid transparent'
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== tab.id) {
                    e.target.style.color = '#667eea';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== tab.id) {
                    e.target.style.color = '#6c757d';
                  }
                }}
              >
                <Icon size={20} />
                {tab.label}
              </button>
            );
          })}
        </div>
        )}

        {/* Content Sections - Only show if not in setup mode */}
        {!showSetup && (
          <>

        {/* Taste Profile Tab */}
        {activeTab === 'profile' && (
          <div>
            {!tasteProfile || Object.keys(preferredFlavors).length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '80px 24px',
                background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                borderRadius: '24px',
                border: '1px solid #e9ecef'
              }}>
                <div style={{ fontSize: '80px', marginBottom: '24px' }}>🍽️</div>
                <h2 style={{ 
                  fontSize: '1.75rem', 
                  fontWeight: '700', 
                  marginBottom: '12px',
                  color: '#212529'
                }}>
                  No Taste Profile Yet
                </h2>
                <p style={{ 
                  fontSize: '1.125rem', 
                  color: '#6c757d',
                  marginBottom: '32px'
                }}>
                  Start scanning QR codes and providing feedback to build your taste profile!
                </p>
                <button
                  onClick={() => navigate('/scan')}
                  style={{
                    padding: '16px 32px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    background: '#667eea',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
                  }}
                >
                  Start Scanning
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '32px' }}>
                {/* Flavor Preferences */}
                <div style={{
                  background: 'white',
                  borderRadius: '16px',
                  padding: '32px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  border: '1px solid #e9ecef'
                }}>
                  <h2 style={{ 
                    fontSize: '1.5rem', 
                    fontWeight: '700', 
                    marginBottom: '24px',
                    color: '#212529',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    <HiSparkles size={24} style={{ color: '#667eea' }} />
                    Flavor Preferences
                  </h2>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                    {Object.entries(preferredFlavors).map(([flavor, score]) => (
                      <div key={flavor} style={{
                        padding: '20px',
                        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                        borderRadius: '12px'
                      }}>
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          marginBottom: '8px'
                        }}>
                          <span style={{ 
                            fontSize: '0.9375rem', 
                            fontWeight: '600',
                            color: '#212529',
                            textTransform: 'capitalize'
                          }}>
                            {flavor}
                          </span>
                          <span style={{ 
                            fontSize: '0.875rem', 
                            color: '#6c757d',
                            fontWeight: '600'
                          }}>
                            {Math.round(score * 100)}%
                          </span>
                        </div>
                        <div style={{
                          width: '100%',
                          height: '8px',
                          background: '#e9ecef',
                          borderRadius: '4px',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            width: `${score * 100}%`,
                            height: '100%',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            borderRadius: '4px',
                            transition: 'width 0.3s ease'
                          }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Favorite Dishes */}
                {tasteProfile.favoriteDishes && tasteProfile.favoriteDishes.length > 0 && (
                  <div style={{
                    background: 'white',
                    borderRadius: '16px',
                    padding: '32px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    border: '1px solid #e9ecef'
                  }}>
                    <h2 style={{ 
                      fontSize: '1.5rem', 
                      fontWeight: '700', 
                      marginBottom: '24px',
                      color: '#212529',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}>
                      <HiHeart size={24} style={{ color: '#e63946' }} />
                      Favorite Dishes
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' }}>
                      {tasteProfile.favoriteDishes.slice(0, 6).map((dish, idx) => (
                        <div key={idx} style={{
                          padding: '16px',
                          background: '#f8f9fa',
                          borderRadius: '12px',
                          border: '1px solid #e9ecef'
                        }}>
                          <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '8px'
                          }}>
                            <span style={{ 
                              fontSize: '1rem', 
                              fontWeight: '600',
                              color: '#212529'
                            }}>
                              {dish.dishName}
                            </span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <HiStar size={16} style={{ color: '#ffc107' }} />
                              <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#495057' }}>
                                {dish.rating?.toFixed(1) || 'N/A'}
                              </span>
                            </div>
                          </div>
                          <p style={{ 
                            margin: 0,
                            fontSize: '0.875rem', 
                            color: '#6c757d'
                          }}>
                            Ordered {dish.orderCount || 0} {dish.orderCount === 1 ? 'time' : 'times'}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Dietary Profile */}
                {tasteProfile.dietaryProfile && (
                  <div style={{
                    background: 'white',
                    borderRadius: '16px',
                    padding: '32px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    border: '1px solid #e9ecef'
                  }}>
                    <h2 style={{ 
                      fontSize: '1.5rem', 
                      fontWeight: '700', 
                      marginBottom: '24px',
                      color: '#212529'
                    }}>
                      Dietary Profile
                    </h2>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                      {tasteProfile.dietaryProfile.restrictions?.map((restriction, idx) => (
                        <span key={idx} style={{
                          padding: '8px 16px',
                          background: '#fff3cd',
                          color: '#856404',
                          borderRadius: '20px',
                          fontSize: '0.875rem',
                          fontWeight: '500'
                        }}>
                          {restriction}
                        </span>
                      ))}
                      {tasteProfile.dietaryProfile.preferences?.map((pref, idx) => (
                        <span key={idx} style={{
                          padding: '8px 16px',
                          background: '#d4edda',
                          color: '#155724',
                          borderRadius: '20px',
                          fontSize: '0.875rem',
                          fontWeight: '500'
                        }}>
                          {pref}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Taste History Tab */}
        {activeTab === 'history' && (
          <div>
            {tasteHistory.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '80px 24px',
                background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                borderRadius: '24px',
                border: '1px solid #e9ecef'
              }}>
                <div style={{ fontSize: '80px', marginBottom: '24px' }}>📜</div>
                <h2 style={{ 
                  fontSize: '1.75rem', 
                  fontWeight: '700', 
                  marginBottom: '12px',
                  color: '#212529'
                }}>
                  No Taste History Yet
                </h2>
                <p style={{ 
                  fontSize: '1.125rem', 
                  color: '#6c757d',
                  marginBottom: '32px'
                }}>
                  Your taste feedback history will appear here after you start providing feedback
                </p>
              </div>
            ) : (
              <>
                {tasteHistory[0]?.stampId?.startsWith('example') && (
                  <div style={{
                    padding: '16px',
                    background: 'linear-gradient(135deg, #fff3cd 0%, #ffe69c 100%)',
                    borderRadius: '12px',
                    marginBottom: '24px',
                    border: '1px solid #ffc107',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    <span style={{ fontSize: '24px' }}>💡</span>
                    <div>
                      <strong style={{ color: '#856404', display: 'block', marginBottom: '4px' }}>
                        Example Taste History
                      </strong>
                      <span style={{ fontSize: '0.875rem', color: '#856404' }}>
                        This is example data. Start scanning QR codes and providing feedback to build your real taste history!
                      </span>
                    </div>
                  </div>
                )}
                <div style={{ display: 'grid', gap: '16px' }}>
                  {tasteHistory.map((entry, idx) => (
                    <div key={idx} style={{
                      background: 'white',
                      borderRadius: '16px',
                      padding: '24px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                      border: '1px solid #e9ecef',
                      display: 'flex',
                      gap: '20px',
                      alignItems: 'flex-start'
                    }}>
                      <div style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '24px',
                        flexShrink: 0
                      }}>
                        🍽️
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          marginBottom: '12px'
                        }}>
                          <div>
                            <h3 style={{ 
                              margin: 0,
                              fontSize: '1.125rem', 
                              fontWeight: '700',
                              color: '#212529',
                              marginBottom: '4px'
                            }}>
                              {entry.dishName}
                            </h3>
                            <p style={{ 
                              margin: 0,
                              fontSize: '0.875rem', 
                              color: '#6c757d'
                            }}>
                              {entry.venueName} • {new Date(entry.timestamp).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            {Array.from({ length: 5 }).map((_, i) => (
                              <HiStar 
                                key={i} 
                                size={20} 
                                style={{ 
                                  color: i < entry.rating ? '#ffc107' : '#e9ecef' 
                                }} 
                              />
                            ))}
                          </div>
                        </div>
                        {entry.flavorNotes && entry.flavorNotes.length > 0 && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
                            {entry.flavorNotes.map((note, i) => (
                              <span key={i} style={{
                                padding: '4px 12px',
                                background: '#f8f9fa',
                                color: '#495057',
                                borderRadius: '12px',
                                fontSize: '0.75rem',
                                fontWeight: '500',
                                textTransform: 'capitalize'
                              }}>
                                {note}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Recommendations Tab */}
        {activeTab === 'recommendations' && (
          <div>
            {recommendations.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '80px 24px',
                background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                borderRadius: '24px',
                border: '1px solid #e9ecef'
              }}>
                <div style={{ fontSize: '80px', marginBottom: '24px' }}>💡</div>
                <h2 style={{ 
                  fontSize: '1.75rem', 
                  fontWeight: '700', 
                  marginBottom: '12px',
                  color: '#212529'
                }}>
                  No Recommendations Yet
                </h2>
                <p style={{ 
                  fontSize: '1.125rem', 
                  color: '#6c757d',
                  marginBottom: '32px'
                }}>
                  We'll recommend dishes based on your taste profile once you've provided feedback
                </p>
              </div>
            ) : (
              <>
                {recommendations.some(r => r.dishName === 'Khachapuri Imeruli') && (
                  <div style={{
                    padding: '16px',
                    background: 'linear-gradient(135deg, #d1ecf1 0%, #bee5eb 100%)',
                    borderRadius: '12px',
                    marginBottom: '24px',
                    border: '1px solid #17a2b8',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    <span style={{ fontSize: '24px' }}>💡</span>
                    <div>
                      <strong style={{ color: '#0c5460', display: 'block', marginBottom: '4px' }}>
                        Example Recommendations
                      </strong>
                      <span style={{ fontSize: '0.875rem', color: '#0c5460' }}>
                        These are example recommendations. Complete your taste profile setup and start scanning to get personalized recommendations!
                      </span>
                    </div>
                  </div>
                )}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                  {recommendations.map((rec, idx) => (
                    <div key={idx} style={{
                      background: 'white',
                      borderRadius: '16px',
                      padding: '24px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      border: '1px solid #e9ecef',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                    }}
                    onClick={() => navigate('/map')}
                    >
                      <div style={{ 
                        fontSize: '48px', 
                        marginBottom: '16px',
                        textAlign: 'center'
                      }}>
                        {rec.icon || '🍽️'}
                      </div>
                      <h3 style={{ 
                        fontSize: '1.25rem', 
                        fontWeight: '700',
                        marginBottom: '8px',
                        color: '#212529',
                        textAlign: 'center'
                      }}>
                        {rec.dishName}
                      </h3>
                      <p style={{ 
                        fontSize: '0.875rem', 
                        color: '#6c757d',
                        marginBottom: '16px',
                        textAlign: 'center',
                        fontStyle: 'italic'
                      }}>
                        {rec.reason || 'Based on your taste preferences'}
                      </p>
                      {rec.venueName && (
                        <div style={{
                          padding: '12px',
                          background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                          borderRadius: '8px',
                          textAlign: 'center'
                        }}>
                          <span style={{ fontSize: '0.875rem', color: '#495057' }}>
                            Available at: <strong>{rec.venueName}</strong>
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
          </>
        )}
      </div>
    </div>
  );
};

export default TasteMemoryPage;

