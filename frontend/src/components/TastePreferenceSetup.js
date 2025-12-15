import React, { useState } from 'react';
import api from '../services/api';

const TastePreferenceSetup = ({ onComplete, onSkip }) => {
  const [step, setStep] = useState(1);
  const [preferences, setPreferences] = useState({
    flavorPreferences: [],
    dietaryRestrictions: [],
    dietaryPreferences: [],
    allergies: []
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const flavorOptions = [
    { id: 'spicy', label: 'Spicy', icon: '🌶️' },
    { id: 'sweet', label: 'Sweet', icon: '🍯' },
    { id: 'savory', label: 'Savory', icon: '🍖' },
    { id: 'sour', label: 'Sour', icon: '🍋' },
    { id: 'bitter', label: 'Bitter', icon: '☕' },
    { id: 'aromatic', label: 'Aromatic', icon: '🌿' },
    { id: 'cheesy', label: 'Cheesy', icon: '🧀' },
    { id: 'buttery', label: 'Buttery', icon: '🧈' },
    { id: 'smoky', label: 'Smoky', icon: '🔥' },
    { id: 'fresh', label: 'Fresh', icon: '🥗' },
    { id: 'creamy', label: 'Creamy', icon: '🥛' },
    { id: 'tangy', label: 'Tangy', icon: '🍊' }
  ];

  const dietaryRestrictions = [
    { id: 'vegetarian', label: 'Vegetarian', icon: '🥬' },
    { id: 'vegan', label: 'Vegan', icon: '🌱' },
    { id: 'gluten-free', label: 'Gluten-Free', icon: '🌾' },
    { id: 'dairy-free', label: 'Dairy-Free', icon: '🥛' },
    { id: 'nut-free', label: 'Nut-Free', icon: '🥜' },
    { id: 'halal', label: 'Halal', icon: '🕌' },
    { id: 'kosher', label: 'Kosher', icon: '✡️' }
  ];

  const dietaryPreferences = [
    { id: 'low-carb', label: 'Low Carb', icon: '🥑' },
    { id: 'low-fat', label: 'Low Fat', icon: '🥗' },
    { id: 'high-protein', label: 'High Protein', icon: '🍗' },
    { id: 'keto', label: 'Keto', icon: '🥓' },
    { id: 'paleo', label: 'Paleo', icon: '🥩' },
    { id: 'pescatarian', label: 'Pescatarian', icon: '🐟' }
  ];

  const allergies = [
    { id: 'peanuts', label: 'Peanuts', icon: '🥜' },
    { id: 'tree-nuts', label: 'Tree Nuts', icon: '🌰' },
    { id: 'shellfish', label: 'Shellfish', icon: '🦐' },
    { id: 'fish', label: 'Fish', icon: '🐟' },
    { id: 'eggs', label: 'Eggs', icon: '🥚' },
    { id: 'soy', label: 'Soy', icon: '🫘' },
    { id: 'wheat', label: 'Wheat', icon: '🌾' },
    { id: 'dairy', label: 'Dairy', icon: '🥛' },
    { id: 'sesame', label: 'Sesame', icon: '🌰' }
  ];

  const toggleSelection = (category, id) => {
    setPreferences(prev => ({
      ...prev,
      [category]: prev[category].includes(id)
        ? prev[category].filter(item => item !== id)
        : [...prev[category], id]
    }));
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setError('');

      await api.post('/taste/profile/setup', {
        flavorPreferences: preferences.flavorPreferences,
        dietaryRestrictions: preferences.dietaryRestrictions,
        dietaryPreferences: preferences.dietaryPreferences,
        allergies: preferences.allergies
      });

      if (onComplete) {
        onComplete();
      }
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to save preferences');
    } finally {
      setSubmitting(false);
    }
  };

  const canProceed = () => {
    if (step === 1) return preferences.flavorPreferences.length > 0;
    if (step === 2) return true; // Dietary restrictions are optional
    if (step === 3) return true; // Dietary preferences are optional
    if (step === 4) return true; // Allergies are optional
    return false;
  };

  return (
    <div className="taste-setup-mobile" style={{
      background: 'white',
      borderRadius: '24px',
      padding: '40px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      border: '1px solid #e9ecef',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{ 
          fontSize: '64px', 
          marginBottom: '16px',
          display: 'inline-block',
          background: 'linear-gradient(135deg, #2d5016 0%, #1e6b7f 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          ✨
        </div>
        <h2 style={{ 
          fontSize: '1.75rem', 
          fontWeight: '700', 
          marginBottom: '8px',
          color: '#212529'
        }}>
          Set Up Your Taste Profile
        </h2>
        <p style={{ fontSize: '1rem', color: '#6c757d', margin: 0 }}>
          Help us personalize your travel journey
        </p>
      </div>

      {/* Progress Indicator */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          marginBottom: '8px'
        }}>
          {[1, 2, 3, 4].map((s) => (
            <div key={s} style={{
              flex: 1,
              height: '4px',
              background: s <= step ? '#2d5016' : '#e9ecef',
              marginRight: s < 4 ? '8px' : '0',
              borderRadius: '2px',
              transition: 'background 0.3s ease'
            }} />
          ))}
        </div>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          fontSize: '0.75rem',
          color: '#6c757d'
        }}>
          <span>Flavors</span>
          <span>Restrictions</span>
          <span>Preferences</span>
          <span>Allergies</span>
        </div>
      </div>

      {error && (
        <div style={{
          padding: '12px 16px',
          background: '#f8d7da',
          color: '#721c24',
          borderRadius: '8px',
          marginBottom: '24px',
          fontSize: '0.875rem'
        }}>
          {error}
        </div>
      )}

      {/* Step 1: Flavor Preferences */}
      {step === 1 && (
        <div>
          <h3 style={{ 
            fontSize: '1.25rem', 
            fontWeight: '600', 
            marginBottom: '16px',
            color: '#212529'
          }}>
            What flavors do you enjoy? *
          </h3>
          <p style={{ 
            fontSize: '0.875rem', 
            color: '#6c757d',
            marginBottom: '24px'
          }}>
            Select all flavors you like (you can select multiple)
          </p>
          <div className="taste-options-grid-mobile" style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', 
            gap: '12px',
            marginBottom: '32px'
          }}>
            {flavorOptions.map((flavor) => (
              <button
                key={flavor.id}
                onClick={() => toggleSelection('flavorPreferences', flavor.id)}
                style={{
                  padding: '16px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  background: preferences.flavorPreferences.includes(flavor.id)
                    ? 'linear-gradient(135deg, #2d5016 0%, #1e6b7f 100%)'
                    : '#f8f9fa',
                  color: preferences.flavorPreferences.includes(flavor.id) ? 'white' : '#495057',
                  border: `2px solid ${preferences.flavorPreferences.includes(flavor.id) ? '#2d5016' : '#e9ecef'}`,
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  if (!preferences.flavorPreferences.includes(flavor.id)) {
                    e.target.style.borderColor = '#2d5016';
                    e.target.style.color = '#2d5016';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!preferences.flavorPreferences.includes(flavor.id)) {
                    e.target.style.borderColor = '#e9ecef';
                    e.target.style.color = '#495057';
                  }
                }}
              >
                <span style={{ fontSize: '24px' }}>{flavor.icon}</span>
                <span>{flavor.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Dietary Restrictions */}
      {step === 2 && (
        <div>
          <h3 style={{ 
            fontSize: '1.25rem', 
            fontWeight: '600', 
            marginBottom: '16px',
            color: '#212529'
          }}>
            Any dietary restrictions?
          </h3>
          <p style={{ 
            fontSize: '0.875rem', 
            color: '#6c757d',
            marginBottom: '24px'
          }}>
            Select any dietary restrictions you follow (optional)
          </p>
          <div className="taste-options-grid-mobile" style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', 
            gap: '12px',
            marginBottom: '32px'
          }}>
            {dietaryRestrictions.map((restriction) => (
              <button
                key={restriction.id}
                onClick={() => toggleSelection('dietaryRestrictions', restriction.id)}
                style={{
                  padding: '16px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  background: preferences.dietaryRestrictions.includes(restriction.id)
                    ? 'linear-gradient(135deg, #28a745 0%, #20c997 100%)'
                    : '#f8f9fa',
                  color: preferences.dietaryRestrictions.includes(restriction.id) ? 'white' : '#495057',
                  border: `2px solid ${preferences.dietaryRestrictions.includes(restriction.id) ? '#28a745' : '#e9ecef'}`,
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <span style={{ fontSize: '24px' }}>{restriction.icon}</span>
                <span>{restriction.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Dietary Preferences */}
      {step === 3 && (
        <div>
          <h3 style={{ 
            fontSize: '1.25rem', 
            fontWeight: '600', 
            marginBottom: '16px',
            color: '#212529'
          }}>
            Dietary preferences?
          </h3>
          <p style={{ 
            fontSize: '0.875rem', 
            color: '#6c757d',
            marginBottom: '24px'
          }}>
            Select any dietary preferences you follow (optional)
          </p>
          <div className="taste-options-grid-mobile" style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', 
            gap: '12px',
            marginBottom: '32px'
          }}>
            {dietaryPreferences.map((pref) => (
              <button
                key={pref.id}
                onClick={() => toggleSelection('dietaryPreferences', pref.id)}
                style={{
                  padding: '16px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  background: preferences.dietaryPreferences.includes(pref.id)
                    ? 'linear-gradient(135deg, #17a2b8 0%, #138496 100%)'
                    : '#f8f9fa',
                  color: preferences.dietaryPreferences.includes(pref.id) ? 'white' : '#495057',
                  border: `2px solid ${preferences.dietaryPreferences.includes(pref.id) ? '#17a2b8' : '#e9ecef'}`,
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <span style={{ fontSize: '24px' }}>{pref.icon}</span>
                <span>{pref.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 4: Allergies */}
      {step === 4 && (
        <div>
          <h3 style={{ 
            fontSize: '1.25rem', 
            fontWeight: '600', 
            marginBottom: '16px',
            color: '#212529'
          }}>
            Any food allergies?
          </h3>
          <p style={{ 
            fontSize: '0.875rem', 
            color: '#6c757d',
            marginBottom: '24px'
          }}>
            Select any allergies you have (optional)
          </p>
          <div className="taste-options-grid-mobile" style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', 
            gap: '12px',
            marginBottom: '32px'
          }}>
            {allergies.map((allergy) => (
              <button
                key={allergy.id}
                onClick={() => toggleSelection('allergies', allergy.id)}
                style={{
                  padding: '16px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  background: preferences.allergies.includes(allergy.id)
                    ? 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)'
                    : '#f8f9fa',
                  color: preferences.allergies.includes(allergy.id) ? 'white' : '#495057',
                  border: `2px solid ${preferences.allergies.includes(allergy.id) ? '#dc3545' : '#e9ecef'}`,
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <span style={{ fontSize: '24px' }}>{allergy.icon}</span>
                <span>{allergy.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="taste-setup-buttons-mobile" style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        gap: '16px',
        marginTop: '32px',
        flexWrap: 'wrap'
      }}>
        {step > 1 ? (
          <button
            onClick={() => setStep(step - 1)}
            style={{
              padding: '12px 24px',
              fontSize: '1rem',
              fontWeight: '600',
              background: 'white',
              color: '#495057',
              border: '2px solid #e9ecef',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = '#2d5016';
              e.target.style.color = '#2d5016';
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = '#e9ecef';
              e.target.style.color = '#495057';
            }}
          >
            ← Back
          </button>
        ) : (
          <div />
        )}

        <div style={{ display: 'flex', gap: '12px' }}>
          {onSkip && (
            <button
              onClick={onSkip}
              style={{
                padding: '12px 24px',
                fontSize: '1rem',
                fontWeight: '500',
                background: 'transparent',
                color: '#6c757d',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.color = '#212529';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = '#6c757d';
              }}
            >
              Skip
            </button>
          )}
          
          {step < 4 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={!canProceed()}
              style={{
                padding: '12px 32px',
                fontSize: '1rem',
                fontWeight: '600',
                background: canProceed() 
                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  : '#e9ecef',
                color: canProceed() ? 'white' : '#adb5bd',
                border: 'none',
                borderRadius: '12px',
                cursor: canProceed() ? 'pointer' : 'not-allowed',
                boxShadow: canProceed() ? '0 4px 12px rgba(102, 126, 234, 0.3)' : 'none',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                if (canProceed()) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (canProceed()) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
                }
              }}
            >
              Next →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting || !canProceed()}
              style={{
                padding: '12px 32px',
                fontSize: '1rem',
                fontWeight: '600',
                background: (submitting || !canProceed())
                  ? '#e9ecef'
                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: (submitting || !canProceed()) ? '#adb5bd' : 'white',
                border: 'none',
                borderRadius: '12px',
                cursor: (submitting || !canProceed()) ? 'not-allowed' : 'pointer',
                boxShadow: (!submitting && canProceed()) ? '0 4px 12px rgba(102, 126, 234, 0.3)' : 'none',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                if (!submitting && canProceed()) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (!submitting && canProceed()) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
                }
              }}
            >
              {submitting ? 'Saving...' : 'Complete Setup'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TastePreferenceSetup;

