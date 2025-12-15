import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  HiSparkles, 
  HiUserGroup, 
  HiOfficeBuilding 
} from 'react-icons/hi';


const DISCOVERY_TYPES = [
  {
    id: 'food',
    name: 'Food & Culture',
    icon: HiSparkles,
    description: 'Explore authentic cuisine, local food, and traditional experiences',
    color: '#2d5016'
  },
  {
    id: 'community',
    name: 'Community Discoveries',
    icon: HiUserGroup,
    description: 'Connect with local communities and experience authentic cultural exchanges',
    color: '#1e6b7f'
  },
  {
    id: 'architectural',
    name: 'Architectural Discoveries',
    icon: HiOfficeBuilding,
    description: 'Discover Georgia\'s rich architectural heritage and historic landmarks',
    color: '#8b6f47'
  }
];

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [step, setStep] = useState(1); // Step 1: Discovery type, Step 2: Registration form
  const [discoveryType, setDiscoveryType] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);


  const handleDiscoveryTypeSelect = (typeId) => {
    setDiscoveryType(typeId);
    setStep(2); // Move to registration form
  };

  const handleBackToDiscovery = () => {
    setStep(1);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!discoveryType) {
      setError('Please select a discovery type');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const result = await register(
      formData.email,
      formData.password,
      formData.name,
      [],
      discoveryType // Pass discovery type to registration
    );
    if (result.success) {
      navigate('/map');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  // Step 1: Discovery Type Selection
  if (step === 1) {
    return (
      <div style={{ 
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px'
      }}>
        <div style={{ 
          maxWidth: '800px', 
          width: '100%',
          background: 'white',
          borderRadius: '24px',
          padding: '48px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.1)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{ 
              fontSize: '64px', 
              marginBottom: '24px',
              display: 'inline-block'
            }}>
              🧀
            </div>
            <h1 style={{ 
              fontSize: '2.5rem', 
              fontWeight: '800', 
              marginBottom: '12px',
              color: '#212529',
              letterSpacing: '-1px'
            }}>
              Choose Your Discovery Path
            </h1>
            <p style={{ 
              fontSize: '1.125rem', 
              color: '#6c757d',
              margin: 0
            }}>
              Select your primary interest to personalize your experience
            </p>
          </div>

          {error && (
            <div style={{
              padding: '16px',
              background: '#fee',
              border: '1px solid #fcc',
              borderRadius: '12px',
              marginBottom: '24px',
              color: '#c33'
            }}>
              {error}
            </div>
          )}

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '20px',
            marginBottom: '32px'
          }}>
            {DISCOVERY_TYPES.map((type) => {
              const Icon = type.icon;
              const isSelected = discoveryType === type.id;
              return (
                <div
                  key={type.id}
                  onClick={() => handleDiscoveryTypeSelect(type.id)}
                  style={{
                    padding: '32px 24px',
                    borderRadius: '16px',
                    border: `3px solid ${isSelected ? type.color : '#e9ecef'}`,
                    background: isSelected ? `${type.color}10` : '#f8f9fa',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    textAlign: 'center',
                    transform: isSelected ? 'translateY(-4px)' : 'translateY(0)',
                    boxShadow: isSelected ? `0 8px 24px ${type.color}30` : '0 2px 8px rgba(0,0,0,0.05)'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = type.color;
                      e.currentTarget.style.background = `${type.color}08`;
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = '#e9ecef';
                      e.currentTarget.style.background = '#f8f9fa';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }
                  }}
                >
                  <div style={{
                    fontSize: '48px',
                    marginBottom: '16px',
                    color: type.color
                  }}>
                    <Icon size={48} />
                  </div>
                  <h3 style={{
                    fontSize: '1.25rem',
                    fontWeight: '700',
                    marginBottom: '8px',
                    color: '#212529'
                  }}>
                    {type.name}
                  </h3>
                  <p style={{
                    fontSize: '0.875rem',
                    color: '#6c757d',
                    margin: 0,
                    lineHeight: '1.5'
                  }}>
                    {type.description}
                  </p>
                  {isSelected && (
                    <div style={{
                      marginTop: '16px',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: type.color
                    }}>
                      ✓ Selected
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <p style={{ 
            textAlign: 'center', 
            fontSize: '0.9375rem',
            color: '#6c757d',
            margin: 0
          }}>
            Already have an account?{' '}
            <Link 
              to="/login" 
              style={{ 
                color: '#2d5016', 
                textDecoration: 'none',
                fontWeight: '600'
              }}
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    );
  }

  // Step 2: Registration Form
  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      <div style={{ 
        maxWidth: '600px', 
        width: '100%',
        background: 'white',
        borderRadius: '24px',
        padding: '48px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.1)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ 
            fontSize: '64px', 
            marginBottom: '24px',
            display: 'inline-block'
          }}>
            🧀
          </div>
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: '800', 
            marginBottom: '12px',
            color: '#212529',
            letterSpacing: '-1px'
          }}>
            Create Account
          </h1>
          <p style={{ 
            fontSize: '1.125rem', 
            color: '#6c757d',
            margin: 0
          }}>
            {DISCOVERY_TYPES.find(t => t.id === discoveryType)?.name || 'Start your adventure in Georgia'}
          </p>
        </div>

        {error && (
          <div style={{
            padding: '16px',
            background: '#fee',
            border: '1px solid #fcc',
            borderRadius: '12px',
            marginBottom: '24px',
            color: '#c33'
          }}>
            {error}
          </div>
        )}

        <button
          onClick={handleBackToDiscovery}
          style={{
            marginBottom: '24px',
            padding: '8px 16px',
            background: 'transparent',
            border: '2px solid #e9ecef',
            borderRadius: '8px',
            color: '#6c757d',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.borderColor = '#2d5016';
            e.target.style.color = '#2d5016';
          }}
          onMouseLeave={(e) => {
            e.target.style.borderColor = '#e9ecef';
            e.target.style.color = '#6c757d';
          }}
        >
          ← Back to Discovery Types
        </button>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '0.9375rem', 
              fontWeight: '600',
              marginBottom: '8px',
              color: '#212529'
            }}>
              Full Name
            </label>
            <input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              style={{
                width: '100%',
                padding: '14px 16px',
                fontSize: '1rem',
                border: '2px solid #e9ecef',
                borderRadius: '12px',
                transition: 'all 0.3s ease',
                outline: 'none'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#2d5016';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e9ecef';
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '0.9375rem', 
              fontWeight: '600',
              marginBottom: '8px',
              color: '#212529'
            }}>
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              autoComplete="email"
              style={{
                width: '100%',
                padding: '14px 16px',
                fontSize: '1rem',
                border: '2px solid #e9ecef',
                borderRadius: '12px',
                transition: 'all 0.3s ease',
                outline: 'none'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#2d5016';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e9ecef';
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '0.9375rem', 
              fontWeight: '600',
              marginBottom: '8px',
              color: '#212529'
            }}>
              Password
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              autoComplete="new-password"
              style={{
                width: '100%',
                padding: '14px 16px',
                fontSize: '1rem',
                border: '2px solid #e9ecef',
                borderRadius: '12px',
                transition: 'all 0.3s ease',
                outline: 'none'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#2d5016';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e9ecef';
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '0.9375rem', 
              fontWeight: '600',
              marginBottom: '8px',
              color: '#212529'
            }}>
              Confirm Password
            </label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              required
              style={{
                width: '100%',
                padding: '14px 16px',
                fontSize: '1rem',
                border: '2px solid #e9ecef',
                borderRadius: '12px',
                transition: 'all 0.3s ease',
                outline: 'none'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#2d5016';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e9ecef';
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '16px',
              fontSize: '1rem',
              fontWeight: '600',
              background: loading ? '#ccc' : '#2d5016',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: loading ? 'none' : '0 4px 12px rgba(25, 118, 210, 0.3)',
              transition: 'all 0.3s ease',
              marginBottom: '24px'
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 16px rgba(25, 118, 210, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 12px rgba(25, 118, 210, 0.3)';
              }
            }}
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>

          <p style={{ 
            textAlign: 'center', 
            fontSize: '0.9375rem',
            color: '#6c757d',
            margin: 0
          }}>
            Already have an account?{' '}
            <Link 
              to="/login" 
              style={{ 
                color: '#2d5016', 
                textDecoration: 'none',
                fontWeight: '600'
              }}
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
