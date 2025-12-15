import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(formData.email, formData.password);
    if (result.success) {
      navigate('/map');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px'
    }}>
      <div className="login-container" style={{ 
        maxWidth: '500px', 
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
            🍷
          </div>
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: '800', 
            marginBottom: '12px',
            color: '#212529',
            letterSpacing: '-1px'
          }}>
            Welcome Back
          </h1>
          <p style={{ 
            fontSize: '1.125rem', 
            color: '#6c757d',
            margin: 0
          }}>
            Sign in to continue your travel journey
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

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '24px' }}>
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

          <div style={{ marginBottom: '32px' }}>
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
              autoComplete="current-password"
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
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <p style={{ 
            textAlign: 'center', 
            fontSize: '0.9375rem',
            color: '#6c757d',
            margin: 0
          }}>
            Don't have an account?{' '}
            <Link 
              to="/register" 
              style={{ 
                color: '#2d5016', 
                textDecoration: 'none',
                fontWeight: '600'
              }}
            >
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
