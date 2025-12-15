import React, { createContext, useContext, useState, useEffect } from 'react';

const AccessibilityContext = createContext();

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
};

export const AccessibilityProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    // Load from localStorage or use defaults
    const saved = localStorage.getItem('accessibilitySettings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse accessibility settings:', e);
      }
    }
    return {
      fontSize: 'normal', // 'small', 'normal', 'large', 'xlarge'
      contrast: 'normal', // 'normal', 'high'
      reducedMotion: false,
      keyboardNavigation: true,
      screenReader: false,
      focusVisible: true,
      colorblind: 'none', // 'none', 'protanopia', 'deuteranopia', 'tritanopia', 'achromatopsia'
      dyslexia: false // Enable dyslexia-friendly formatting
    };
  });

  useEffect(() => {
    // Save to localStorage whenever settings change
    localStorage.setItem('accessibilitySettings', JSON.stringify(settings));
    
    // Apply settings to document
    applySettings(settings);
  }, [settings]);

  const applySettings = (newSettings) => {
    const root = document.documentElement;
    
    // Font size
    const fontSizeMap = {
      small: '14px',
      normal: '16px',
      large: '18px',
      xlarge: '20px'
    };
    root.style.fontSize = fontSizeMap[newSettings.fontSize] || fontSizeMap.normal;
    
    // High contrast
    if (newSettings.contrast === 'high') {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    // Reduced motion
    if (newSettings.reducedMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }
    
    // Focus visible
    if (newSettings.focusVisible) {
      root.classList.add('focus-visible');
    } else {
      root.classList.remove('focus-visible');
    }
    
    // Colorblind mode
    // Remove all colorblind classes first
    root.classList.remove('colorblind-protanopia', 'colorblind-deuteranopia', 'colorblind-tritanopia', 'colorblind-achromatopsia');
    
    if (newSettings.colorblind && newSettings.colorblind !== 'none') {
      root.classList.add(`colorblind-${newSettings.colorblind}`);
    }
    
    // Dyslexia mode
    if (newSettings.dyslexia) {
      root.classList.add('dyslexia-friendly');
    } else {
      root.classList.remove('dyslexia-friendly');
    }
  };

  const updateSetting = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const resetSettings = () => {
    const defaultSettings = {
      fontSize: 'normal',
      contrast: 'normal',
      reducedMotion: false,
      keyboardNavigation: true,
      screenReader: false,
      focusVisible: true,
      colorblind: 'none',
      dyslexia: false
    };
    setSettings(defaultSettings);
    applySettings(defaultSettings);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Alt + A: Open accessibility menu
      if (e.altKey && e.key === 'a') {
        e.preventDefault();
        // Toggle accessibility panel (will be handled by AccessibilityControls)
        const event = new CustomEvent('toggleAccessibility');
        window.dispatchEvent(event);
      }
      
      // Alt + S: Skip to main content
      if (e.altKey && e.key === 's') {
        e.preventDefault();
        const mainContent = document.querySelector('main, [role="main"]');
        if (mainContent) {
          mainContent.focus();
          mainContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
      
      // Escape: Close modals/menus
      if (e.key === 'Escape') {
        const modals = document.querySelectorAll('[role="dialog"]');
        modals.forEach(modal => {
          if (modal.style.display !== 'none') {
            const closeButton = modal.querySelector('[aria-label*="close" i], [aria-label*="Close" i]');
            if (closeButton) {
              closeButton.click();
            }
          }
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <AccessibilityContext.Provider value={{
      settings,
      updateSetting,
      resetSettings
    }}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export default AccessibilityContext;

