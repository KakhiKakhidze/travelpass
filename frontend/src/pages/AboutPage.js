import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { 
  HiCamera, 
  HiLocationMarker, 
  HiStar 
} from 'react-icons/hi';

const AboutPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [stats, setStats] = useState({
    venues: 0,
    wineVenues: 0,
    khachapuriVenues: 0,
    villageFoodVenues: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/venues?limit=100');
      const venues = response.data.data.venues || [];
      setStats({
        venues: venues.length,
        wineVenues: venues.filter(v => v.category?.includes('wine')).length,
        khachapuriVenues: venues.filter(v => v.category?.includes('khachapuri')).length,
        villageFoodVenues: venues.filter(v => v.category?.includes('village_food')).length
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const features = [
    {
      icon: HiCamera,
      title: 'Grow Your Business',
      description: 'Connect with food enthusiasts and expand your customer base through our platform',
    },
    {
      icon: HiLocationMarker,
      title: 'Drive More Sales',
      description: 'Attract new customers and increase foot traffic with our gamified discovery system',
    },
    {
      icon: HiStar,
      title: 'Handled By Expert',
      description: 'Our team ensures the best experience for both venues and food explorers',
    },
  ];

  const teamMembers = [
    {
      name: 'Nanuka Khatiashvili',
      role: 'CEO',
      emoji: '👨‍💼'
    },
    {
      name: 'Kakhi Kakhidze',
      role: 'CTO',
      emoji: '👩‍🍳'
    },
    {
      name: 'Nina Chkhikvadze',
      role: 'Merketing Manager',
      emoji: '👨‍💻'
    },
  ];

  return (
    <div style={{ background: '#ffffff', minHeight: '100vh' }}>
      {/* Hero Section */}
      <section style={{ 
        padding: '120px 24px 80px',
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '60px', 
            alignItems: 'center',
            position: 'relative',
            zIndex: 1
          }}>
            <div>
              <h1 style={{ 
                fontSize: '3.5rem', 
                fontWeight: '800', 
                lineHeight: '1.2', 
                marginBottom: '16px',
                color: '#212529',
                letterSpacing: '-1px'
              }}>
                About Us
              </h1>
              <h2 style={{ 
                fontSize: '2rem', 
                fontWeight: '600', 
                marginBottom: '24px',
                color: '#495057'
              }}>
                Helping People Get More Business
              </h2>
              <p style={{ 
                fontSize: '1.25rem', 
                color: '#6c757d', 
                marginBottom: '40px',
                lineHeight: '1.6'
              }}>
                TravelPass is a traveler-focused platform that connects explorers with authentic experiences. Share your journey, discover amazing places, and connect with fellow travelers in a community-driven environment.
              </p>
              {!isAuthenticated && (
                <button
                  onClick={() => navigate('/register')}
                  style={{
                    padding: '16px 32px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    background: '#e63946',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Try Free
                </button>
              )}
            </div>
            <div style={{ 
              position: 'relative',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <div style={{
                width: '400px',
                height: '400px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                position: 'relative'
              }}>
                <div style={{ fontSize: '120px', filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.2))' }}>
                  🍽️
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section style={{ 
        padding: '80px 24px', 
        background: 'white'
      }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '80px',
            alignItems: 'center'
          }}>
            <div>
              <h2 style={{ 
                fontSize: '2.5rem', 
                fontWeight: '700', 
                marginBottom: '40px',
                color: '#212529'
              }}>
                Join An Attractive & Personalized
              </h2>
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: '700', 
                  marginBottom: '12px',
                  color: '#212529'
                }}>
                  Our Mission
                </h3>
                <p style={{ 
                  fontSize: '1.125rem', 
                  color: '#6c757d',
                  lineHeight: '1.6'
                }}>
                  To promote Georgian culture and help local businesses thrive by connecting them with travelers from around the world.
                </p>
              </div>
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: '700', 
                  marginBottom: '12px',
                  color: '#212529'
                }}>
                  Our Vision
                </h3>
                <p style={{ 
                  fontSize: '1.125rem', 
                  color: '#6c757d',
                  lineHeight: '1.6'
                }}>
                  To become the leading platform for travel experiences in Georgia, making it easy and fun for travelers to discover authentic dining experiences.
                </p>
              </div>
              {!isAuthenticated && (
                <button
                  onClick={() => navigate('/register')}
                  style={{
                    padding: '16px 32px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    background: '#e63946',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Try Free
                </button>
              )}
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '24px'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #e63946 0%, #c1121f 100%)',
                padding: '32px',
                borderRadius: '16px',
                color: 'white',
                textAlign: 'center',
                boxShadow: '0 8px 24px rgba(25, 118, 210, 0.3)'
              }}>
                <div style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '8px' }}>
                  {stats.venues}+
                </div>
                <div style={{ fontSize: '1rem', opacity: 0.9 }}>
                  Working Hours
                </div>
              </div>
              <div style={{
                background: 'linear-gradient(135deg, #ff6f00 0%, #e65100 100%)',
                padding: '32px',
                borderRadius: '16px',
                color: 'white',
                textAlign: 'center',
                boxShadow: '0 8px 24px rgba(255, 111, 0, 0.3)'
              }}>
                <div style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '8px' }}>
                  {stats.venues}+
                </div>
                <div style={{ fontSize: '1rem', opacity: 0.9 }}>
                  Projects Done
                </div>
              </div>
              <div style={{
                background: 'linear-gradient(135deg, #ffc107 0%, #ff8f00 100%)',
                padding: '32px',
                borderRadius: '16px',
                color: 'white',
                textAlign: 'center',
                boxShadow: '0 8px 24px rgba(255, 193, 7, 0.3)'
              }}>
                <div style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '8px' }}>
                  {stats.venues}+
                </div>
                <div style={{ fontSize: '1rem', opacity: 0.9 }}>
                  Happy Clients
                </div>
              </div>
              <div style={{
                background: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)',
                padding: '32px',
                borderRadius: '16px',
                color: 'white',
                textAlign: 'center',
                boxShadow: '0 8px 24px rgba(76, 175, 80, 0.3)'
              }}>
                <div style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '8px' }}>
                  {stats.venues}+
                </div>
                <div style={{ fontSize: '1rem', opacity: 0.9 }}>
                  Cup Of Coffee
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Perfect Solution Section */}
      <section style={{ padding: '80px 24px', background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ 
              fontSize: '2.5rem', 
              fontWeight: '700', 
              marginBottom: '16px',
              color: '#212529'
            }}>
              Perfect Solution For Your Business
            </h2>
            <p style={{ 
              fontSize: '1.125rem', 
              color: '#6c757d',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Discover amazing experiences and grow your food business with our platform
            </p>
          </div>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '32px' 
          }}>
            {features.map((feature, index) => (
              <div 
                key={index}
                style={{
                  padding: '40px',
                  background: 'white',
                  borderRadius: '16px',
                  border: '1px solid #e9ecef',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.1)';
                  e.currentTarget.style.borderColor = '#e63946';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = '#e9ecef';
                }}
              >
                <div style={{ 
                  fontSize: '64px', 
                  marginBottom: '24px',
                  display: 'inline-block',
                  color: '#e63946'
                }}>
                  {React.createElement(feature.icon, { size: 64 })}
                </div>
                <h3 style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: '700', 
                  marginBottom: '12px',
                  color: '#212529'
                }}>
                  {feature.title}
                </h3>
                <p style={{ 
                  fontSize: '1rem', 
                  color: '#6c757d',
                  lineHeight: '1.6',
                  marginBottom: '20px'
                }}>
                  {feature.description}
                </p>
                <a 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/map');
                  }}
                  style={{
                    color: '#e63946',
                    textDecoration: 'none',
                    fontWeight: '600',
                    fontSize: '0.9375rem'
                  }}
                >
                  Get Started →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Members Section */}
      <section style={{ padding: '80px 24px', background: 'white' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '60px'
          }}>
            <h2 style={{ 
              fontSize: '2.5rem', 
              fontWeight: '700',
              color: '#212529'
            }}>
              Our Dedicated Team Members
            </h2>
            {!isAuthenticated && (
              <button
                onClick={() => navigate('/register')}
                style={{
                  padding: '12px 24px',
                  fontSize: '0.9375rem',
                  fontWeight: '600',
                  background: '#e63946',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                  transition: 'all 0.3s ease'
                }}
              >
                Join Us
              </button>
            )}
          </div>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
            gap: '32px' 
          }}>
            {teamMembers.map((member, index) => (
              <div 
                key={index}
                style={{
                  padding: '32px',
                  background: 'white',
                  borderRadius: '16px',
                  border: '1px solid #e9ecef',
                  textAlign: 'center',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ 
                  fontSize: '80px', 
                  marginBottom: '24px',
                  display: 'inline-block'
                }}>
                  {member.emoji}
                </div>
                <h3 style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: '700', 
                  marginBottom: '8px',
                  color: '#212529'
                }}>
                  {member.name}
                </h3>
                <p style={{ 
                  fontSize: '1rem', 
                  color: '#6c757d',
                  marginBottom: '20px'
                }}>
                  {member.role}
                </p>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  gap: '16px' 
                }}>
                  <a href="#" style={{ color: '#6c757d', fontSize: '1.25rem' }}>🐦</a>
                  <a href="#" style={{ color: '#6c757d', fontSize: '1.25rem' }}>💼</a>
                  <a href="#" style={{ color: '#6c757d', fontSize: '1.25rem' }}>📷</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;

