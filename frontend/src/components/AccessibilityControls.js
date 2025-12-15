import React, { useState, useEffect } from 'react';
import { useAccessibility } from '../contexts/AccessibilityContext';
import { HiX, HiCog, HiSun, HiMoon, HiChevronDown, HiChevronUp } from 'react-icons/hi';

const AccessibilityControls = () => {
  const { settings, updateSetting, resetSettings } = useAccessibility();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleToggle = () => {
      setIsOpen(prev => !prev);
    };
    
    window.addEventListener('toggleAccessibility', handleToggle);
    return () => window.removeEventListener('toggleAccessibility', handleToggle);
  }, []);
  
  // Close panel when clicking outside on mobile (handled by overlay click)
  // No need for separate click outside handler since overlay handles it

  // On mobile, don't show floating button - it's in the bottom nav
  if (!isOpen) {
    if (isMobile) {
      return null; // Mobile users access via bottom nav
    }
    return (
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Open accessibility settings"
        className="accessibility-floating-btn"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #2d5016 0%, #1e6b7f 100%)',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          transition: 'all 0.3s ease',
          outline: 'none'
        }}
        onFocus={(e) => {
          e.target.style.outline = '3px solid #2d5016';
          e.target.style.outlineOffset = '2px';
        }}
        onBlur={(e) => {
          e.target.style.outline = 'none';
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'scale(1.1)';
          e.target.style.boxShadow = '0 6px 16px rgba(0,0,0,0.4)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'scale(1)';
          e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
        }}
      >
        <HiCog size={24} />
      </button>
    );
  }

  // Mobile version - slide up panel
  if (isMobile && isOpen) {
    return (
      <>
        <div 
          className="mobile-accessibility-overlay"
          onClick={() => setIsOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1001,
            animation: 'fadeIn 0.2s ease-out'
          }}
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="accessibility-title"
          className="mobile-accessibility-panel"
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'white',
            borderRadius: '24px 24px 0 0',
            boxShadow: '0 -4px 24px rgba(0, 0, 0, 0.15)',
            zIndex: 1002,
            padding: '20px 16px',
            paddingBottom: 'calc(20px + env(safe-area-inset-bottom))',
            maxHeight: '85vh',
            overflowY: 'auto',
            animation: 'slideUp 0.3s ease-out'
          }}
        >
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            paddingBottom: '16px',
            borderBottom: '1px solid #e9ecef',
            position: 'sticky',
            top: 0,
            background: 'white',
            zIndex: 10
          }}>
            <h2
              id="accessibility-title"
              style={{
                fontSize: '1.25rem',
                fontWeight: '700',
                margin: 0,
                color: '#212529'
              }}
            >
              Accessibility Settings
            </h2>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close accessibility settings"
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '8px',
                color: '#6c757d',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '44px',
                minHeight: '44px'
              }}
            >
              <HiX size={24} />
            </button>
          </div>
          {!isMinimized && (
            <>
              {/* Font Size */}
              <div style={{ marginBottom: '20px' }}>
                <label
                  htmlFor="font-size-mobile"
                  style={{
                    display: 'block',
                    fontSize: '0.9375rem',
                    fontWeight: '600',
                    color: '#212529',
                    marginBottom: '8px'
                  }}
                >
                  Font Size
                </label>
                <select
                  id="font-size-mobile"
                  value={settings.fontSize}
                  onChange={(e) => updateSetting('fontSize', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '2px solid #e9ecef',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    minHeight: '48px'
                  }}
                >
                  <option value="small">Small</option>
                  <option value="normal">Normal</option>
                  <option value="large">Large</option>
                  <option value="xlarge">Extra Large</option>
                </select>
              </div>

              {/* Contrast */}
              <div style={{ marginBottom: '24px' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.9375rem',
                    fontWeight: '600',
                    color: '#212529',
                    marginBottom: '8px'
                  }}
                >
                  Contrast Mode
                </label>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={() => updateSetting('contrast', 'normal')}
                    aria-pressed={settings.contrast === 'normal'}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '8px',
                      border: `2px solid ${settings.contrast === 'normal' ? '#2d5016' : '#e9ecef'}`,
                      background: settings.contrast === 'normal' ? '#f0f4ff' : 'white',
                      color: '#212529',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      minHeight: '48px'
                    }}
                  >
                    <HiSun size={18} />
                    Normal
                  </button>
                  <button
                    onClick={() => updateSetting('contrast', 'high')}
                    aria-pressed={settings.contrast === 'high'}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '8px',
                      border: `2px solid ${settings.contrast === 'high' ? '#2d5016' : '#e9ecef'}`,
                      background: settings.contrast === 'high' ? '#f0f4ff' : 'white',
                      color: '#212529',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      minHeight: '48px'
                    }}
                  >
                    <HiMoon size={18} />
                    High
                  </button>
                </div>
              </div>

              {/* Colorblind Mode */}
              <div style={{ marginBottom: '24px' }}>
                <label
                  htmlFor="colorblind-mobile"
                  style={{
                    display: 'block',
                    fontSize: '0.9375rem',
                    fontWeight: '600',
                    color: '#212529',
                    marginBottom: '8px'
                  }}
                >
                  Colorblind Mode
                </label>
                <select
                  id="colorblind-mobile"
                  value={settings.colorblind || 'none'}
                  onChange={(e) => updateSetting('colorblind', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '2px solid #e9ecef',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    minHeight: '48px'
                  }}
                >
                  <option value="none">None</option>
                  <option value="protanopia">Protanopia (Red-Blind)</option>
                  <option value="deuteranopia">Deuteranopia (Green-Blind)</option>
                  <option value="tritanopia">Tritanopia (Blue-Blind)</option>
                  <option value="achromatopsia">Achromatopsia (Complete)</option>
                </select>
              </div>

              {/* Dyslexia Friendly */}
              <div style={{ marginBottom: '24px' }}>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    cursor: 'pointer',
                    fontSize: '0.9375rem',
                    color: '#212529',
                    minHeight: '48px'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={settings.dyslexia || false}
                    onChange={(e) => updateSetting('dyslexia', e.target.checked)}
                    style={{
                      width: '20px',
                      height: '20px',
                      cursor: 'pointer'
                    }}
                  />
                  <span>Dyslexia Friendly</span>
                </label>
              </div>

              {/* Reduced Motion */}
              <div style={{ marginBottom: '24px' }}>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    cursor: 'pointer',
                    fontSize: '0.9375rem',
                    color: '#212529',
                    minHeight: '48px'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={settings.reducedMotion}
                    onChange={(e) => updateSetting('reducedMotion', e.target.checked)}
                    style={{
                      width: '20px',
                      height: '20px',
                      cursor: 'pointer'
                    }}
                  />
                  <span>Reduce Motion</span>
                </label>
              </div>

              {/* Focus Visible */}
              <div style={{ marginBottom: '24px' }}>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    cursor: 'pointer',
                    fontSize: '0.9375rem',
                    color: '#212529',
                    minHeight: '48px'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={settings.focusVisible}
                    onChange={(e) => updateSetting('focusVisible', e.target.checked)}
                    style={{
                      width: '20px',
                      height: '20px',
                      cursor: 'pointer'
                    }}
                  />
                  <span>Show Focus Indicators</span>
                </label>
              </div>

              {/* Reset Button */}
              <button
                onClick={resetSettings}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '8px',
                  border: '2px solid #e9ecef',
                  background: 'white',
                  color: '#6c757d',
                  cursor: 'pointer',
                  fontSize: '0.9375rem',
                  fontWeight: '600',
                  transition: 'all 0.2s ease',
                  minHeight: '48px',
                  marginTop: '8px'
                }}
              >
                Reset to Defaults
              </button>
            </>
          )}
        </div>
      </>
    );
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="accessibility-title"
      className="accessibility-panel-mobile"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        width: '280px',
        maxWidth: 'calc(100vw - 48px)',
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
        zIndex: 1001,
        padding: '16px',
        border: '2px solid #e9ecef'
      }}
    >
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '12px'
      }}>
        <h2
          id="accessibility-title"
          style={{
            fontSize: '1rem',
            fontWeight: '700',
            margin: 0,
            color: '#212529'
          }}
        >
          Accessibility Settings
        </h2>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            aria-label={isMinimized ? "Expand accessibility settings" : "Minimize accessibility settings"}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '4px',
              color: '#6c757d',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onFocus={(e) => {
              e.target.style.outline = '2px solid #2d5016';
              e.target.style.outlineOffset = '2px';
            }}
            onBlur={(e) => {
              e.target.style.outline = 'none';
            }}
          >
            {isMinimized ? <HiChevronUp size={20} /> : <HiChevronDown size={20} />}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Close accessibility settings"
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '4px',
              color: '#6c757d',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onFocus={(e) => {
              e.target.style.outline = '2px solid #2d5016';
              e.target.style.outlineOffset = '2px';
            }}
            onBlur={(e) => {
              e.target.style.outline = 'none';
            }}
          >
            <HiX size={20} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>

      {/* Font Size */}
      <div style={{ marginBottom: '16px' }}>
        <label
          htmlFor="font-size"
          style={{
            display: 'block',
            fontSize: '0.8125rem',
            fontWeight: '600',
            color: '#212529',
            marginBottom: '6px'
          }}
        >
          Font Size
        </label>
        <select
          id="font-size"
          value={settings.fontSize}
          onChange={(e) => updateSetting('fontSize', e.target.value)}
          style={{
            width: '100%',
            padding: '6px 10px',
            borderRadius: '6px',
            border: '1px solid #e9ecef',
            fontSize: '0.8125rem',
            cursor: 'pointer'
          }}
          aria-label="Select font size"
        >
          <option value="small">Small</option>
          <option value="normal">Normal</option>
          <option value="large">Large</option>
          <option value="xlarge">Extra Large</option>
        </select>
      </div>

      {/* Contrast */}
      <div style={{ marginBottom: '24px' }}>
        <label
          htmlFor="contrast"
          style={{
            display: 'block',
            fontSize: '0.8125rem',
            fontWeight: '600',
            color: '#212529',
            marginBottom: '6px'
          }}
        >
          Contrast Mode
        </label>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            id="contrast-normal"
            onClick={() => updateSetting('contrast', 'normal')}
            aria-pressed={settings.contrast === 'normal'}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '6px',
              border: `2px solid ${settings.contrast === 'normal' ? '#2d5016' : '#e9ecef'}`,
              background: settings.contrast === 'normal' ? '#f0f4ff' : 'white',
              color: '#212529',
              cursor: 'pointer',
              fontSize: '0.8125rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px'
            }}
          >
            <HiSun size={16} />
            Normal
          </button>
          <button
            id="contrast-high"
            onClick={() => updateSetting('contrast', 'high')}
            aria-pressed={settings.contrast === 'high'}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '6px',
              border: `2px solid ${settings.contrast === 'high' ? '#2d5016' : '#e9ecef'}`,
              background: settings.contrast === 'high' ? '#f0f4ff' : 'white',
              color: '#212529',
              cursor: 'pointer',
              fontSize: '0.8125rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px'
            }}
          >
            <HiMoon size={16} />
            High
          </button>
        </div>
      </div>

      {/* Colorblind Mode */}
      <div style={{ marginBottom: '24px' }}>
        <label
          htmlFor="colorblind"
          style={{
            display: 'block',
            fontSize: '0.8125rem',
            fontWeight: '600',
            color: '#212529',
            marginBottom: '6px'
          }}
        >
          Colorblind Mode
        </label>
        <select
          id="colorblind"
          value={settings.colorblind || 'none'}
          onChange={(e) => updateSetting('colorblind', e.target.value)}
          style={{
            width: '100%',
            padding: '6px 10px',
            borderRadius: '6px',
            border: '1px solid #e9ecef',
            fontSize: '0.8125rem',
            cursor: 'pointer'
          }}
          aria-label="Select colorblind mode"
        >
          <option value="none">None</option>
          <option value="protanopia">Protanopia (Red-Blind)</option>
          <option value="deuteranopia">Deuteranopia (Green-Blind)</option>
          <option value="tritanopia">Tritanopia (Blue-Blind)</option>
          <option value="achromatopsia">Achromatopsia (Complete)</option>
        </select>
        <p style={{
          fontSize: '0.6875rem',
          color: '#6c757d',
          marginTop: '4px',
          marginBottom: 0
        }}>
          Simulates color vision deficiencies to improve accessibility
        </p>
      </div>

      {/* Dyslexia Friendly */}
      <div style={{ marginBottom: '24px' }}>
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer',
            fontSize: '0.8125rem',
            color: '#212529'
          }}
        >
          <input
            type="checkbox"
            checked={settings.dyslexia || false}
            onChange={(e) => updateSetting('dyslexia', e.target.checked)}
            aria-label="Enable dyslexia-friendly formatting"
            style={{
              width: '18px',
              height: '18px',
              cursor: 'pointer'
            }}
          />
          <span>Dyslexia Friendly</span>
        </label>
        <p style={{
          fontSize: '0.6875rem',
          color: '#6c757d',
          marginTop: '4px',
          marginLeft: '30px',
          marginBottom: 0
        }}>
          Increases letter spacing, word spacing, and line height for easier reading
        </p>
      </div>

      {/* Reduced Motion */}
      <div style={{ marginBottom: '24px' }}>
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer',
            fontSize: '0.8125rem',
            color: '#212529'
          }}
        >
          <input
            type="checkbox"
            checked={settings.reducedMotion}
            onChange={(e) => updateSetting('reducedMotion', e.target.checked)}
            aria-label="Reduce motion"
            style={{
              width: '18px',
              height: '18px',
              cursor: 'pointer'
            }}
          />
          <span>Reduce Motion</span>
        </label>
      </div>

      {/* Focus Visible */}
      <div style={{ marginBottom: '16px' }}>
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer',
            fontSize: '0.8125rem',
            color: '#212529'
          }}
        >
          <input
            type="checkbox"
            checked={settings.focusVisible}
            onChange={(e) => updateSetting('focusVisible', e.target.checked)}
            aria-label="Show focus indicators"
            style={{
              width: '18px',
              height: '18px',
              cursor: 'pointer'
            }}
          />
          <span>Show Focus Indicators</span>
        </label>
      </div>

      {/* Keyboard Shortcuts Info */}
      <div style={{
        padding: '8px',
        background: '#f8f9fa',
        borderRadius: '6px',
        marginBottom: '12px',
        fontSize: '0.6875rem',
        color: '#6c757d'
      }}>
        <strong style={{ display: 'block', marginBottom: '3px', color: '#212529', fontSize: '0.75rem' }}>
          Keyboard Shortcuts:
        </strong>
        <div>Alt + A: Open menu</div>
        <div>Alt + S: Skip content</div>
        <div>Esc: Close dialogs</div>
      </div>

      {/* Reset Button */}
      <button
        onClick={resetSettings}
        style={{
          width: '100%',
          padding: '8px',
          borderRadius: '6px',
          border: '1px solid #e9ecef',
          background: 'white',
          color: '#6c757d',
          cursor: 'pointer',
          fontSize: '0.8125rem',
          fontWeight: '600',
          transition: 'all 0.2s ease'
        }}
        onFocus={(e) => {
          e.target.style.outline = '2px solid #2d5016';
          e.target.style.outlineOffset = '2px';
        }}
        onBlur={(e) => {
          e.target.style.outline = 'none';
        }}
        onMouseEnter={(e) => {
          e.target.style.background = '#f8f9fa';
          e.target.style.borderColor = '#2d5016';
        }}
        onMouseLeave={(e) => {
          e.target.style.background = 'white';
          e.target.style.borderColor = '#e9ecef';
        }}
      >
        Reset to Defaults
      </button>
        </>
      )}
    </div>
  );
};

export default AccessibilityControls;

