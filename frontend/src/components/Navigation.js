import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  HiStar, 
  HiUser, 
  HiLogout,
  HiCamera,
  HiSparkles,
  HiMenu,
  HiX
} from 'react-icons/hi';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  if (!isAuthenticated) {
    return (
      <>
        <nav className="app-bar" role="navigation" aria-label="Main navigation">
          <div className="toolbar">
            <Link to="/" className="toolbar-title" aria-label="TravelPass home">
              TravelPass
            </Link>
            {isMobile ? (
              <button
                className="mobile-menu-btn"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
              </button>
            ) : (
              <div className="toolbar-actions" style={{ display: 'flex', gap: '8px', alignItems: 'center' }} role="menubar">
                <Link to="/" className="btn btn-text" style={{ color: 'white' }} role="menuitem" aria-label="Home page">Home</Link>
                <Link to="/about" className="btn btn-text" style={{ color: 'white' }} role="menuitem" aria-label="About us">About</Link>
                <Link to="/contact" className="btn btn-text" style={{ color: 'white' }} role="menuitem" aria-label="Contact us">Contact</Link>
                <Link to="/login" className="btn btn-text" style={{ color: 'white' }} role="menuitem" aria-label="Sign in to your account">Sign In</Link>
                <Link 
                  to="/register" 
                  className="btn" 
                  role="menuitem"
                  aria-label="Register for a free account"
                  style={{ 
                  background: 'white', 
                    color: '#2d5016',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontWeight: '600',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 4px 12px rgba(255, 255, 255, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
                >Try Free</Link>
              </div>
            )}
          </div>
        </nav>
        {isMobile && mobileMenuOpen && (
          <div className="mobile-menu-overlay" onClick={() => setMobileMenuOpen(false)}>
            <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
              <Link to="/" className="mobile-menu-item" onClick={handleLinkClick}>Home</Link>
              <Link to="/about" className="mobile-menu-item" onClick={handleLinkClick}>About</Link>
              <Link to="/contact" className="mobile-menu-item" onClick={handleLinkClick}>Contact</Link>
              <Link to="/login" className="mobile-menu-item" onClick={handleLinkClick}>Sign In</Link>
              <Link to="/register" className="mobile-menu-item mobile-menu-item-primary" onClick={handleLinkClick}>Try Free</Link>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <nav className={`app-bar ${isMobile ? 'hide-on-mobile' : ''}`} role="navigation" aria-label="Main navigation">
        <div className="toolbar">
          <Link to="/" className="toolbar-title" aria-label="TravelPass home" onClick={handleLinkClick}>
            TravelPass
          </Link>
          {!isMobile && (
            <div className="toolbar-actions" style={{ 
              display: 'flex', 
              gap: '8px', 
              alignItems: 'center',
              flexWrap: 'wrap'
            }} role="menubar">
              <Link
                to="/"
                className={`btn ${location.pathname === '/' ? 'btn-outlined' : 'btn-text'}`}
                style={{ color: 'white' }}
                role="menuitem"
                aria-label="Home page"
                aria-current={location.pathname === '/' ? 'page' : undefined}
              >
                Home
              </Link>
              <Link
                to="/about"
                className={`btn ${location.pathname === '/about' ? 'btn-outlined' : 'btn-text'}`}
                style={{ color: 'white' }}
                role="menuitem"
                aria-label="About us"
                aria-current={location.pathname === '/about' ? 'page' : undefined}
              >
                About
              </Link>
              <Link
                to="/contact"
                className={`btn ${location.pathname === '/contact' ? 'btn-outlined' : 'btn-text'}`}
                style={{ color: 'white' }}
                role="menuitem"
                aria-label="Contact us"
                aria-current={location.pathname === '/contact' ? 'page' : undefined}
              >
                Contact
              </Link>
              <Link
                to="/feed"
                className={`btn ${location.pathname === '/feed' ? 'btn-outlined' : 'btn-text'}`}
                style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}
                role="menuitem"
                aria-label="View feed"
                aria-current={location.pathname === '/feed' ? 'page' : undefined}
              >
                Feed
              </Link>
              <Link
                to="/stories"
                className={`btn ${location.pathname === '/stories' ? 'btn-outlined' : 'btn-text'}`}
                style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}
                role="menuitem"
                aria-label="View stories"
                aria-current={location.pathname === '/stories' ? 'page' : undefined}
              >
                Stories
              </Link>
              <Link
                to="/collections"
                className={`btn ${location.pathname === '/collections' ? 'btn-outlined' : 'btn-text'}`}
                style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}
                role="menuitem"
                aria-label="View collections"
                aria-current={location.pathname === '/collections' ? 'page' : undefined}
              >
                Collections
              </Link>
              <Link
                to="/scan"
                className={`btn ${location.pathname === '/scan' ? 'btn-outlined' : 'btn-text'}`}
                style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}
                role="menuitem"
                aria-label="Scan QR code"
                aria-current={location.pathname === '/scan' ? 'page' : undefined}
              >
                <HiCamera size={20} aria-hidden="true" />
                <span className="sr-only">Scan QR Code</span>
              </Link>
              <Link
                to="/communities"
                className={`btn ${location.pathname === '/communities' ? 'btn-outlined' : 'btn-text'}`}
                style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}
                role="menuitem"
                aria-label="View communities"
                aria-current={location.pathname === '/communities' ? 'page' : undefined}
              >
                Communities
              </Link>
              <Link
                to="/messages"
                className={`btn ${location.pathname === '/messages' ? 'btn-outlined' : 'btn-text'}`}
                style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}
                role="menuitem"
                aria-label="View messages"
                aria-current={location.pathname === '/messages' ? 'page' : undefined}
              >
                Messages
              </Link>
              <Link
                to="/challenges"
                className={`btn ${location.pathname === '/challenges' ? 'btn-outlined' : 'btn-text'}`}
                style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '0px', whiteSpace: 'nowrap' }}
                role="menuitem"
                aria-label="View challenges"
                aria-current={location.pathname === '/challenges' ? 'page' : undefined}
              >
                <HiStar size={20} aria-hidden="true" />
                <span className="sr-only">Challenges</span>
              </Link>
              <Link
                to="/taste-memory"
                className={`btn ${location.pathname === '/taste-memory' ? 'btn-outlined' : 'btn-text'}`}
                style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}
                role="menuitem"
                aria-label="Taste Memory profile"
                aria-current={location.pathname === '/taste-memory' ? 'page' : undefined}
              >
                <HiSparkles size={20} aria-hidden="true" />
                <span className="sr-only">Taste Memory</span>
              </Link>
              <Link
                to="/profile"
                className={`btn ${location.pathname === '/profile' ? 'btn-outlined' : 'btn-text'}`}
                style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '0px', maxWidth: '200px' }}
                role="menuitem"
                aria-label={`View profile for ${user?.name || 'user'}`}
                aria-current={location.pathname === '/profile' ? 'page' : undefined}
              >
                <HiUser size={20} aria-hidden="true" />
                <span className="sr-only">Profile</span>
              </Link>
              <button 
                className="icon-btn" 
                onClick={handleLogout} 
                aria-label="Logout"
                style={{ color: 'white' }}
              >
                <HiLogout size={20} aria-hidden="true" />
                <span className="sr-only">Logout</span>
              </button>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navigation;

