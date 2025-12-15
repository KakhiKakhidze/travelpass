import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AccessibilityProvider } from './contexts/AccessibilityContext';
import ErrorBoundary from './components/ErrorBoundary';
import PrivateRoute from './components/PrivateRoute';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import AccessibilityControls from './components/AccessibilityControls';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import ChallengesPage from './pages/ChallengesPage';
import QRScanPage from './pages/QRScanPage';
import StatusPage from './pages/LevelsPage';
import FeedPage from './pages/FeedPage';
import CommunitiesPage from './pages/CommunitiesPage';
import CommunityDetailPage from './pages/CommunityDetailPage';
import MessagesPage from './pages/MessagesPage';
import StoriesPage from './pages/StoriesPage';
import CollectionsPage from './pages/CollectionsPage';
import TasteMemoryPage from './pages/TasteMemoryPage';

function App() {
  return (
    <ErrorBoundary>
      <AccessibilityProvider>
      <AuthProvider>
        <Router>
            {/* Skip to main content link */}
            <a href="#main-content" className="skip-link">
              Skip to main content
            </a>
          <Navigation />
            <main id="main-content" role="main" tabIndex={-1} style={{ minHeight: 'calc(100vh - 200px)' }}>
            <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/feed"
            element={
              <PrivateRoute>
                <FeedPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/communities"
            element={
              <PrivateRoute>
                <CommunitiesPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/communities/:id"
            element={
              <PrivateRoute>
                <CommunityDetailPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/messages"
            element={
              <PrivateRoute>
                <MessagesPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/stories"
            element={
              <PrivateRoute>
                <StoriesPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/collections"
            element={
              <PrivateRoute>
                <CollectionsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/challenges"
            element={
              <PrivateRoute>
                <ChallengesPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/status"
            element={
              <PrivateRoute>
                <StatusPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/scan"
            element={
              <PrivateRoute>
                <QRScanPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/taste-memory"
            element={
              <PrivateRoute>
                <TasteMemoryPage />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            </main>
          <Footer />
            <AccessibilityControls />
        </Router>
      </AuthProvider>
      </AccessibilityProvider>
    </ErrorBoundary>
  );
}

export default App;

