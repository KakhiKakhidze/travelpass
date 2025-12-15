import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  HiHome,
  HiCamera,
  HiStar,
  HiUser,
  HiCollection,
  HiSparkles,
  HiChat,
  HiUsers,
  HiMenu,
  HiX,
  HiLogout,
  HiInformationCircle,
  HiMail,
  HiCog
} from 'react-icons/hi';

const MobileBottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  if (!isAuthenticated) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowMoreMenu(false);
  };

  const primaryNavItems = [
    { path: '/feed', icon: HiHome, label: 'Feed' },
    { path: '/scan', icon: HiCamera, label: 'Scan' },
    { path: '/challenges', icon: HiStar, label: 'Challenges' },
    { path: '/collections', icon: HiCollection, label: 'Collections' },
    { path: '/profile', icon: HiUser, label: 'Profile' },
  ];

  const moreNavItems = [
    { path: '/stories', icon: HiSparkles, label: 'Stories' },
    { path: '/communities', icon: HiUsers, label: 'Communities' },
    { path: '/messages', icon: HiChat, label: 'Messages' },
    { path: '/taste-memory', icon: HiSparkles, label: 'Taste Memory' },
    { path: '/about', icon: HiInformationCircle, label: 'About' },
    { path: '/contact', icon: HiMail, label: 'Contact' },
  ];
  
  const handleAccessibilityClick = () => {
    setShowMoreMenu(false);
    // Trigger the accessibility panel to open
    window.dispatchEvent(new Event('toggleAccessibility'));
  };

  const isActive = (path) => {
    if (path === '/feed') {
      return location.pathname === '/' || location.pathname === '/feed';
    }
    return location.pathname === path;
  };

  return (
    <>
      <nav className="mobile-bottom-nav" role="navigation" aria-label="Bottom navigation">
        {primaryNavItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`mobile-bottom-nav-item ${active ? 'active' : ''}`}
              aria-label={item.label}
              aria-current={active ? 'page' : undefined}
            >
              <Icon size={24} aria-hidden="true" />
              <span className="mobile-bottom-nav-label">{item.label}</span>
            </Link>
          );
        })}
        <button
          className={`mobile-bottom-nav-item ${showMoreMenu ? 'active' : ''}`}
          onClick={() => setShowMoreMenu(!showMoreMenu)}
          aria-label="More options"
          aria-expanded={showMoreMenu}
        >
          <HiMenu size={24} aria-hidden="true" />
          <span className="mobile-bottom-nav-label">More</span>
        </button>
      </nav>

      {/* More Menu Overlay */}
      {showMoreMenu && (
        <div className="mobile-more-menu-overlay" onClick={() => setShowMoreMenu(false)}>
          <div className="mobile-more-menu" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-more-menu-header">
              <h3>More Options</h3>
              <button
                className="mobile-more-menu-close"
                onClick={() => setShowMoreMenu(false)}
                aria-label="Close menu"
              >
                <HiX size={24} />
              </button>
            </div>
            <div className="mobile-more-menu-items">
              {moreNavItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`mobile-more-menu-item ${active ? 'active' : ''}`}
                    onClick={() => setShowMoreMenu(false)}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              <button
                className="mobile-more-menu-item"
                onClick={handleAccessibilityClick}
              >
                <HiCog size={20} />
                <span>Accessibility Settings</span>
              </button>
              <button
                className="mobile-more-menu-item mobile-more-menu-item-danger"
                onClick={handleLogout}
              >
                <HiLogout size={20} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileBottomNav;

