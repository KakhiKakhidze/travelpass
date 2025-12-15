import React, { useState } from 'react';
import api from '../services/api';
import { HiStar, HiX } from 'react-icons/hi';

const TasteFeedbackModal = ({ stampId, dishName, venueName, onClose, onSuccess }) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [selectedFlavors, setSelectedFlavors] = useState([]);
  const [wouldOrderAgain, setWouldOrderAgain] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const flavorTags = [
    'spicy', 'sweet', 'savory', 'sour', 'bitter', 
    'aromatic', 'cheesy', 'buttery', 'smoky', 'fresh',
    'creamy', 'tangy', 'rich', 'light', 'hearty'
  ];

  const handleFlavorToggle = (flavor) => {
    if (selectedFlavors.includes(flavor)) {
      setSelectedFlavors(selectedFlavors.filter(f => f !== flavor));
    } else {
      setSelectedFlavors([...selectedFlavors, flavor]);
    }
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      setError('Please provide a rating');
      return;
    }
    if (selectedFlavors.length === 0) {
      setError('Please select at least one flavor note');
      return;
    }
    if (wouldOrderAgain === null) {
      setError('Please indicate if you would order again');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      
      await api.post('/taste/feedback', {
        stampId,
        rating,
        flavorNotes: selectedFlavors,
        wouldOrderAgain
      });

      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to submit feedback');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-labelledby="taste-feedback-title"
      aria-describedby="taste-feedback-description"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '24px'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          onClose();
        }
      }}
    >
      <div style={{
        background: 'white',
        borderRadius: '24px',
        padding: '32px',
        maxWidth: '600px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        position: 'relative'
      }}
      onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close feedback modal"
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'transparent',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            color: '#6c757d',
            padding: '8px',
            borderRadius: '8px',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = '#f8f9fa';
            e.target.style.color = '#212529';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'transparent';
            e.target.style.color = '#6c757d';
          }}
        >
          <HiX size={24} aria-hidden="true" />
        </button>

        {/* Header */}
        <div style={{ marginBottom: '32px', textAlign: 'center' }}>
          <div 
            role="img"
            aria-label="Sparkle icon"
            style={{ 
              fontSize: '64px', 
              marginBottom: '16px',
              display: 'inline-block',
              background: 'linear-gradient(135deg, #2d5016 0%, #1e6b7f 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            ✨
          </div>
          <h2 
            id="taste-feedback-title"
            style={{ 
              fontSize: '1.75rem', 
              fontWeight: '700', 
              marginBottom: '8px',
              color: '#212529'
            }}
          >
            Taste Memory™ Feedback
          </h2>
          <p id="taste-feedback-description" style={{ fontSize: '1rem', color: '#6c757d', margin: 0 }}>
            Help us learn your taste preferences
          </p>
          {dishName && (
            <p style={{ fontSize: '0.875rem', color: '#495057', marginTop: '8px', fontWeight: '500' }}>
              {dishName} at {venueName}
            </p>
          )}
        </div>

        {error && (
          <div 
            role="alert"
            aria-live="assertive"
            style={{
              padding: '12px 16px',
              background: '#f8d7da',
              color: '#721c24',
              borderRadius: '8px',
              marginBottom: '24px',
              fontSize: '0.875rem'
            }}
          >
            {error}
          </div>
        )}

        {/* Rating Section */}
        <div style={{ marginBottom: '32px' }}>
          <fieldset>
            <legend style={{ 
              display: 'block',
              fontSize: '1rem',
              fontWeight: '600',
              color: '#212529',
              marginBottom: '16px',
              padding: 0
            }}>
              1. How would you rate this dish? *
            </legend>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center',
            gap: '8px',
            flexWrap: 'wrap'
          }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px',
                  fontSize: '48px',
                  transition: 'transform 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)';
                }}
              >
                <HiStar 
                  size={48}
                  style={{ 
                    color: star <= (hoveredRating || rating) ? '#ffc107' : '#e9ecef',
                    transition: 'color 0.2s ease'
                  }} 
                />
              </button>
            ))}
          </div>
              {rating > 0 && (
            <p 
              role="status"
              aria-live="polite"
              style={{ 
                textAlign: 'center', 
                marginTop: '8px',
                fontSize: '0.875rem',
                color: '#6c757d'
              }}
            >
              {rating === 1 && 'Not for me'}
              {rating === 2 && 'Below average'}
              {rating === 3 && 'Average'}
              {rating === 4 && 'Good'}
              {rating === 5 && 'Excellent!'}
            </p>
          )}
          </fieldset>
        </div>

        {/* Flavor Notes Section */}
        <div style={{ marginBottom: '32px' }}>
          <label style={{ 
            display: 'block',
            fontSize: '1rem',
            fontWeight: '600',
            color: '#212529',
            marginBottom: '16px'
          }}>
            2. What flavors did you notice? (Select all that apply) *
          </label>
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '12px' 
          }}>
            {flavorTags.map((flavor) => (
              <button
                key={flavor}
                onClick={() => handleFlavorToggle(flavor)}
                style={{
                  padding: '10px 20px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  background: selectedFlavors.includes(flavor) 
                    ? 'linear-gradient(135deg, #2d5016 0%, #1e6b7f 100%)' 
                    : '#f8f9fa',
                  color: selectedFlavors.includes(flavor) ? 'white' : '#495057',
                  border: `2px solid ${selectedFlavors.includes(flavor) ? '#2d5016' : '#e9ecef'}`,
                  borderRadius: '20px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textTransform: 'capitalize'
                }}
                onMouseEnter={(e) => {
                  if (!selectedFlavors.includes(flavor)) {
                    e.target.style.borderColor = '#2d5016';
                    e.target.style.color = '#2d5016';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!selectedFlavors.includes(flavor)) {
                    e.target.style.borderColor = '#e9ecef';
                    e.target.style.color = '#495057';
                  }
                }}
              >
                {flavor}
              </button>
            ))}
          </div>
        </div>

        {/* Would Order Again Section */}
        <div style={{ marginBottom: '32px' }}>
          <label style={{ 
            display: 'block',
            fontSize: '1rem',
            fontWeight: '600',
            color: '#212529',
            marginBottom: '16px'
          }}>
            3. Would you order this again? *
          </label>
          <div style={{ 
            display: 'flex', 
            gap: '16px',
            justifyContent: 'center'
          }}>
            <button
              onClick={() => setWouldOrderAgain(true)}
              style={{
                padding: '16px 32px',
                fontSize: '1rem',
                fontWeight: '600',
                background: wouldOrderAgain === true 
                  ? 'linear-gradient(135deg, #28a745 0%, #20c997 100%)' 
                  : '#f8f9fa',
                color: wouldOrderAgain === true ? 'white' : '#495057',
                border: `2px solid ${wouldOrderAgain === true ? '#28a745' : '#e9ecef'}`,
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                flex: 1
              }}
            >
              ✓ Yes
            </button>
            <button
              onClick={() => setWouldOrderAgain(false)}
              style={{
                padding: '16px 32px',
                fontSize: '1rem',
                fontWeight: '600',
                background: wouldOrderAgain === false 
                  ? 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)' 
                  : '#f8f9fa',
                color: wouldOrderAgain === false ? 'white' : '#495057',
                border: `2px solid ${wouldOrderAgain === false ? '#dc3545' : '#e9ecef'}`,
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                flex: 1
              }}
            >
              ✗ No
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={submitting}
          style={{
            width: '100%',
            padding: '16px',
            fontSize: '1rem',
            fontWeight: '600',
            background: submitting 
              ? '#6c757d' 
              : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            cursor: submitting ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            if (!submitting) {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.4)';
            }
          }}
          onMouseLeave={(e) => {
            if (!submitting) {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
            }
          }}
        >
          {submitting ? 'Saving...' : 'Save Taste Memory'}
        </button>

        {/* Skip Option */}
        <button
          onClick={onClose}
          style={{
            width: '100%',
            padding: '12px',
            fontSize: '0.875rem',
            fontWeight: '500',
            background: 'transparent',
            color: '#6c757d',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            marginTop: '12px',
            transition: 'color 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.color = '#212529';
          }}
          onMouseLeave={(e) => {
            e.target.style.color = '#6c757d';
          }}
        >
          Skip for now
        </button>
      </div>
    </div>
  );
};

export default TasteFeedbackModal;

