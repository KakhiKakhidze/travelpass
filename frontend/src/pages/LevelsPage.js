import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import LevelBadge from '../components/LevelBadge';

const LevelsPage = () => {
  const { user } = useAuth();
  const currentLevel = user?.level || 1;

  const levelInfo = [
    { level: 1, name: 'Beginner', xpRequired: 0, description: 'Start your travel journey', rewards: ['Access to basic venues', 'Basic challenges'] },
    { level: 2, name: 'Explorer', xpRequired: 50, description: 'Discover new flavors', rewards: ['Access to wine venues', 'Wine tasting challenges'] },
    { level: 3, name: 'Adventurer', xpRequired: 150, description: 'Embark on adventures', rewards: ['Access to village restaurants', 'Regional challenges'] },
    { level: 4, name: 'Enthusiast', xpRequired: 300, description: 'Passionate explorer', rewards: ['Exclusive venue access', 'Combo challenges'] },
    { level: 5, name: 'Connoisseur', xpRequired: 500, description: 'Refined taste', rewards: ['VIP venue access', 'Premium challenges'] },
    { level: 6, name: 'Expert', xpRequired: 750, description: 'Master of flavors', rewards: ['Expert challenges', 'Special discounts'] },
    { level: 7, name: 'Master', xpRequired: 1050, description: 'Travel master', rewards: ['Master challenges', 'Exclusive events'] },
    { level: 8, name: 'Grand Master', xpRequired: 1400, description: 'Elite explorer', rewards: ['Grand Master badge', 'Priority support'] },
    { level: 9, name: 'Legend', xpRequired: 1800, description: 'Living legend', rewards: ['Legend status', 'Exclusive content'] },
    { level: 10, name: 'Champion', xpRequired: 2250, description: 'Ultimate champion', rewards: ['Champion badge', 'All features unlocked'] }
  ];

  return (
    <div style={{ background: '#ffffff', minHeight: '100vh' }}>
      {/* Hero Section */}
      <section style={{ 
        padding: '120px 24px 80px',
        background: 'linear-gradient(135deg, #e63946 0%, #457b9d 50%, #06d6a0 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.3)',
          zIndex: 0
        }}></div>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <h1 style={{ 
            fontSize: '3.5rem', 
            fontWeight: '800', 
            lineHeight: '1.2', 
            marginBottom: '24px',
            color: 'white',
            letterSpacing: '-1px',
            textShadow: '2px 2px 8px rgba(0, 0, 0, 0.5), 0 0 20px rgba(0, 0, 0, 0.3)'
          }}>
            Status System
          </h1>
          <p style={{ 
            fontSize: '1.25rem', 
            color: 'white', 
            marginBottom: '40px',
            maxWidth: '700px',
            margin: '0 auto 40px',
            textShadow: '1px 1px 4px rgba(0, 0, 0, 0.5)'
          }}>
            Progress through 10 status levels and unlock exclusive rewards as you explore and share your travel experiences
          </p>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '16px',
            padding: '16px 32px',
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
            backdropFilter: 'blur(10px)'
          }}>
            <LevelBadge level={currentLevel} size={80} currentLevel={currentLevel} showLabel={false} />
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'white' }}>
                Status {currentLevel}
              </div>
              <div style={{ fontSize: '1rem', color: 'rgba(255, 255, 255, 0.9)' }}>
                {levelInfo[currentLevel - 1]?.name}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* All Levels Grid */}
      <section style={{ padding: '80px 24px' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: '800',
            textAlign: 'center',
            marginBottom: '16px',
            color: '#212529'
          }}>
            All Status Levels
          </h2>
          <p style={{
            fontSize: '1.125rem',
            textAlign: 'center',
            color: '#6c757d',
            marginBottom: '48px',
            maxWidth: '600px',
            margin: '0 auto 48px'
          }}>
            Unlock new status levels by earning experience points through check-ins, reviews, and community engagement
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '32px',
            marginBottom: '64px'
          }}>
            {levelInfo.map((info) => {
              const isUnlocked = info.level <= currentLevel;
              const isCurrentLevel = info.level === currentLevel;
              
              return (
                <div
                  key={info.level}
                  style={{
                    background: 'white',
                    borderRadius: '20px',
                    padding: '32px',
                    border: isCurrentLevel 
                      ? '3px solid #06d6a0' 
                      : isUnlocked 
                        ? '2px solid #e63946' 
                        : '1px solid #e9ecef',
                    boxShadow: isCurrentLevel
                      ? '0 8px 24px rgba(6, 214, 160, 0.2)'
                      : isUnlocked
                        ? '0 4px 12px rgba(230, 57, 70, 0.15)'
                        : '0 4px 12px rgba(0,0,0,0.08)',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden',
                    opacity: isUnlocked ? 1 : 0.7
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = isCurrentLevel
                      ? '0 12px 32px rgba(6, 214, 160, 0.3)'
                      : '0 8px 24px rgba(0,0,0,0.12)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = isCurrentLevel
                      ? '0 8px 24px rgba(6, 214, 160, 0.2)'
                      : isUnlocked
                        ? '0 4px 12px rgba(230, 57, 70, 0.15)'
                        : '0 4px 12px rgba(0,0,0,0.08)';
                  }}
                >
                  {/* Current Level Badge */}
                  {isCurrentLevel && (
                    <div style={{
                      position: 'absolute',
                      top: '20px',
                      right: '20px',
                      padding: '6px 12px',
                      background: 'linear-gradient(135deg, #06d6a0 0%, #118ab2 100%)',
                      color: 'white',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      boxShadow: '0 2px 8px rgba(6, 214, 160, 0.4)'
                    }}>
                      CURRENT
                    </div>
                  )}

                  {/* Level Badge Display */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginBottom: '24px'
                  }}>
                    <LevelBadge 
                      level={info.level} 
                      size={120} 
                      currentLevel={currentLevel} 
                      showLabel={false}
                    />
                  </div>

                  <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    marginBottom: '8px',
                    color: '#212529',
                    textAlign: 'center'
                  }}>
                    Status {info.level} - {info.name}
                  </h3>

                  <p style={{
                    fontSize: '1rem',
                    color: '#6c757d',
                    marginBottom: '20px',
                    textAlign: 'center',
                    lineHeight: '1.6'
                  }}>
                    {info.description}
                  </p>

                  <div style={{
                    padding: '16px',
                    background: isUnlocked ? '#e8f5e9' : '#f5f5f5',
                    borderRadius: '12px',
                    border: `1px solid ${isUnlocked ? '#06d6a0' : '#e0e0e0'}`
                  }}>
                    <div style={{
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      color: isUnlocked ? '#06d6a0' : '#9e9e9e',
                      marginBottom: '8px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      XP Required: {info.xpRequired}
                    </div>
                    <div style={{
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      color: isUnlocked ? '#06d6a0' : '#9e9e9e',
                      marginBottom: '8px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      Rewards:
                    </div>
                    <ul style={{
                      margin: 0,
                      paddingLeft: '20px',
                      fontSize: '0.875rem',
                      color: isUnlocked ? '#2e7d32' : '#757575',
                      lineHeight: '1.8'
                    }}>
                      {info.rewards.map((reward, idx) => (
                        <li key={idx}>{reward}</li>
                      ))}
                    </ul>
                  </div>

                  {isUnlocked && !isCurrentLevel && (
                    <div style={{
                      marginTop: '16px',
                      padding: '8px 16px',
                      background: 'linear-gradient(135deg, #e63946 0%, #c1121f 100%)',
                      color: 'white',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      textAlign: 'center'
                    }}>
                      ✓ Unlocked
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Progress Summary */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(230, 57, 70, 0.08) 0%, rgba(69, 123, 157, 0.08) 100%)',
            borderRadius: '20px',
            padding: '48px',
            textAlign: 'center'
          }}>
            <h2 style={{
              fontSize: '2rem',
              fontWeight: '800',
              marginBottom: '24px',
              color: '#212529'
            }}>
              Your Progress
            </h2>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '16px',
              flexWrap: 'wrap',
              marginBottom: '32px'
            }}>
              {levelInfo.map((info) => (
                <div
                  key={info.level}
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '12px',
                    background: info.level <= currentLevel
                      ? (info.level === currentLevel 
                          ? 'linear-gradient(135deg, #06d6a0 0%, #118ab2 100%)'
                          : 'linear-gradient(135deg, #e63946 0%, #c1121f 100%)')
                      : 'linear-gradient(135deg, #e0e0e0 0%, #bdbdbd 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '1.5rem',
                    fontWeight: '800',
                    boxShadow: info.level === currentLevel
                      ? '0 4px 12px rgba(6, 214, 160, 0.4)'
                      : '0 2px 8px rgba(0,0,0,0.1)',
                    opacity: info.level <= currentLevel ? 1 : 0.5
                  }}
                >
                  {info.level}
                </div>
              ))}
            </div>
            <p style={{
              fontSize: '1.125rem',
              color: '#6c757d',
              margin: 0
            }}>
              {currentLevel === 10 
                ? '🎉 Congratulations! You\'ve reached the maximum status!' 
                : `Keep exploring! You're ${10 - currentLevel} status levels away from becoming a Champion.`
              }
            </p>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes pulse-ring {
          0% {
            transform: scale(1);
            opacity: 0.6;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.3;
          }
          100% {
            transform: scale(1);
            opacity: 0.6;
          }
        }
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.9;
          }
        }
      `}</style>
    </div>
  );
};

export default LevelsPage;

