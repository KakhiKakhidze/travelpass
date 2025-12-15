import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  FaTwitter, 
  FaLinkedin, 
  FaInstagram, 
  FaFacebook 
} from 'react-icons/fa';

const Footer = () => {
  const { isAuthenticated } = useAuth();

  return (
    <footer style={{
      background: 'linear-gradient(135deg, #1a3009 0%, #0f4554 100%)',
      color: 'white',
      padding: '60px 24px 24px',
      marginTop: '80px'
    }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '48px',
          marginBottom: '48px'
        }}>
          {/* Brand Column */}
          <div>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              marginBottom: '20px',
              color: 'white'
            }}>
              TravelPass
            </h3>
            <p style={{
              fontSize: '0.9375rem',
              color: 'rgba(255, 255, 255, 0.7)',
              lineHeight: '1.6',
              marginBottom: '24px'
            }}>
              Connect with travelers, share authentic experiences, and discover amazing places. A community-driven platform for explorers.
            </p>
            <div style={{ display: 'flex', gap: '16px' }}>
              <a href="#" style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '1.5rem', textDecoration: 'none', transition: 'color 0.3s ease' }} onMouseEnter={(e) => e.target.style.color = 'white'} onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.7)'}><FaTwitter /></a>
              <a href="#" style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '1.5rem', textDecoration: 'none', transition: 'color 0.3s ease' }} onMouseEnter={(e) => e.target.style.color = 'white'} onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.7)'}><FaLinkedin /></a>
              <a href="#" style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '1.5rem', textDecoration: 'none', transition: 'color 0.3s ease' }} onMouseEnter={(e) => e.target.style.color = 'white'} onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.7)'}><FaInstagram /></a>
              <a href="#" style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '1.5rem', textDecoration: 'none', transition: 'color 0.3s ease' }} onMouseEnter={(e) => e.target.style.color = 'white'} onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.7)'}><FaFacebook /></a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h4 style={{
              fontSize: '1.125rem',
              fontWeight: '700',
              marginBottom: '20px',
              color: 'white'
            }}>
              Quick Links
            </h4>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0
            }}>
              <li style={{ marginBottom: '12px' }}>
                <Link 
                  to="/" 
                  style={{ 
                    color: 'rgba(255, 255, 255, 0.7)', 
                    textDecoration: 'none',
                    fontSize: '0.9375rem',
                    transition: 'color 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.color = 'white'}
                  onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.7)'}
                >
                  Home
                </Link>
              </li>
              <li style={{ marginBottom: '12px' }}>
                <Link 
                  to="/about" 
                  style={{ 
                    color: 'rgba(255, 255, 255, 0.7)', 
                    textDecoration: 'none',
                    fontSize: '0.9375rem',
                    transition: 'color 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.color = 'white'}
                  onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.7)'}
                >
                  About Us
                </Link>
              </li>
              <li style={{ marginBottom: '12px' }}>
                <Link 
                  to="/contact" 
                  style={{ 
                    color: 'rgba(255, 255, 255, 0.7)', 
                    textDecoration: 'none',
                    fontSize: '0.9375rem',
                    transition: 'color 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.color = 'white'}
                  onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.7)'}
                >
                  Contact
                </Link>
              </li>
              {isAuthenticated ? (
                <>
                  <li style={{ marginBottom: '12px' }}>
                    <Link 
                      to="/challenges" 
                      style={{ 
                        color: 'rgba(255, 255, 255, 0.7)', 
                        textDecoration: 'none',
                        fontSize: '0.9375rem',
                        transition: 'color 0.3s ease'
                      }}
                      onMouseEnter={(e) => e.target.style.color = 'white'}
                      onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.7)'}
                    >
                      Challenges
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li style={{ marginBottom: '12px' }}>
                    <Link 
                      to="/login" 
                      style={{ 
                        color: 'rgba(255, 255, 255, 0.7)', 
                        textDecoration: 'none',
                        fontSize: '0.9375rem',
                        transition: 'color 0.3s ease'
                      }}
                      onMouseEnter={(e) => e.target.style.color = 'white'}
                      onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.7)'}
                    >
                      Sign In
                    </Link>
                  </li>
                  <li style={{ marginBottom: '12px' }}>
                    <Link 
                      to="/register" 
                      style={{ 
                        color: 'rgba(255, 255, 255, 0.7)', 
                        textDecoration: 'none',
                        fontSize: '0.9375rem',
                        transition: 'color 0.3s ease'
                      }}
                      onMouseEnter={(e) => e.target.style.color = 'white'}
                      onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.7)'}
                    >
                      Sign Up
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Services Column */}
          <div>
            <h4 style={{
              fontSize: '1.125rem',
              fontWeight: '700',
              marginBottom: '20px',
              color: 'white'
            }}>
              Services
            </h4>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0
            }}>
              <li style={{ marginBottom: '12px' }}>
                <span style={{ 
                  color: 'rgba(255, 255, 255, 0.7)', 
                  fontSize: '0.9375rem'
                }}>
                  🍷 Wine Tastings
                </span>
              </li>
              <li style={{ marginBottom: '12px' }}>
                <span style={{ 
                  color: 'rgba(255, 255, 255, 0.7)', 
                  fontSize: '0.9375rem'
                }}>
                  🧀 Khachapuri Trails
                </span>
              </li>
              <li style={{ marginBottom: '12px' }}>
                <span style={{ 
                  color: 'rgba(255, 255, 255, 0.7)', 
                  fontSize: '0.9375rem'
                }}>
                  🏡 Village Food Tours
                </span>
              </li>
              <li style={{ marginBottom: '12px' }}>
                <span style={{ 
                  color: 'rgba(255, 255, 255, 0.7)', 
                  fontSize: '0.9375rem'
                }}>
                  🏆 Challenge Rewards
                </span>
              </li>
              <li style={{ marginBottom: '12px' }}>
                <span style={{ 
                  color: 'rgba(255, 255, 255, 0.7)', 
                  fontSize: '0.9375rem'
                }}>
                  🧠 Taste Memory
                </span>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 style={{
              fontSize: '1.125rem',
              fontWeight: '700',
              marginBottom: '20px',
              color: 'white'
            }}>
              Contact Us
            </h4>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0
            }}>
              <li style={{ 
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span>📧</span>
                <span style={{ 
                  color: 'rgba(255, 255, 255, 0.7)', 
                  fontSize: '0.9375rem'
                }}>
                  info@travelpass.com
                </span>
              </li>
              <li style={{ 
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span>📞</span>
                <span style={{ 
                  color: 'rgba(255, 255, 255, 0.7)', 
                  fontSize: '0.9375rem'
                }}>
                  +995 32 2 XX XX XX
                </span>
              </li>
              <li style={{ 
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span>📍</span>
                <span style={{ 
                  color: 'rgba(255, 255, 255, 0.7)', 
                  fontSize: '0.9375rem'
                }}>
                  Tbilisi, Georgia
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          paddingTop: '32px',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <p style={{
            margin: 0,
            fontSize: '0.875rem',
            color: 'rgba(255, 255, 255, 0.6)'
          }}>
            © {new Date().getFullYear()} TravelPass Community. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            <a 
              href="#" 
              style={{ 
                color: 'rgba(255, 255, 255, 0.6)', 
                textDecoration: 'none',
                fontSize: '0.875rem',
                transition: 'color 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.color = 'white'}
              onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.6)'}
            >
              Privacy Policy
            </a>
            <a 
              href="#" 
              style={{ 
                color: 'rgba(255, 255, 255, 0.6)', 
                textDecoration: 'none',
                fontSize: '0.875rem',
                transition: 'color 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.color = 'white'}
              onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.6)'}
            >
              Terms of Service
            </a>
            <a 
              href="#" 
              style={{ 
                color: 'rgba(255, 255, 255, 0.6)', 
                textDecoration: 'none',
                fontSize: '0.875rem',
                transition: 'color 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.color = 'white'}
              onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.6)'}
            >
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

