import React from 'react';
import { 
  HiStar, 
  HiFire, 
  HiSparkles,
  HiLightningBolt,
  HiShieldCheck,
  HiBadgeCheck,
  HiCrown,
  HiTrophy
} from 'react-icons/hi';
import { 
  GiTrophyCup,
  GiCrown,
  GiMedal
} from 'react-icons/gi';
import { 
  FaCrown,
  FaGem,
  FaAward
} from 'react-icons/fa';

const LevelBadge = ({ level, size = 100, currentLevel = 1, showLabel = true }) => {
  const levelConfigs = [
    {
      // Level 1: Beginner
      icon: HiStar,
      gradient: 'linear-gradient(135deg, #E0E0E0 0%, #BDBDBD 100%)',
      borderColor: '#9E9E9E',
      shadowColor: 'rgba(158, 158, 158, 0.3)',
      name: 'Beginner',
      color: '#757575'
    },
    {
      // Level 2: Explorer
      icon: HiStar,
      gradient: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
      borderColor: '#FFD700',
      shadowColor: 'rgba(255, 215, 0, 0.4)',
      name: 'Explorer',
      color: '#FF8F00'
    },
    {
      // Level 3: Adventurer
      icon: HiFire,
      gradient: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
      borderColor: '#FF6B35',
      shadowColor: 'rgba(255, 107, 53, 0.4)',
      name: 'Adventurer',
      color: '#E65100'
    },
    {
      // Level 4: Enthusiast
      icon: HiSparkles,
      gradient: 'linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%)',
      borderColor: '#9C27B0',
      shadowColor: 'rgba(156, 39, 176, 0.4)',
      name: 'Enthusiast',
      color: '#6A1B9A'
    },
    {
      // Level 5: Connoisseur
      icon: HiShieldCheck,
      gradient: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
      borderColor: '#2196F3',
      shadowColor: 'rgba(33, 150, 243, 0.4)',
      name: 'Connoisseur',
      color: '#1565C0'
    },
    {
      // Level 6: Expert
      icon: HiLightningBolt,
      gradient: 'linear-gradient(135deg, #FFC107 0%, #FF8F00 100%)',
      borderColor: '#FFC107',
      shadowColor: 'rgba(255, 193, 7, 0.4)',
      name: 'Expert',
      color: '#F57C00'
    },
    {
      // Level 7: Master
      icon: GiMedal,
      gradient: 'linear-gradient(135deg, #00BCD4 0%, #0097A7 100%)',
      borderColor: '#00BCD4',
      shadowColor: 'rgba(0, 188, 212, 0.4)',
      name: 'Master',
      color: '#00838F'
    },
    {
      // Level 8: Grand Master
      icon: FaGem,
      gradient: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)',
      borderColor: '#4CAF50',
      shadowColor: 'rgba(76, 175, 80, 0.4)',
      name: 'Grand Master',
      color: '#1B5E20'
    },
    {
      // Level 9: Legend
      icon: GiTrophyCup,
      gradient: 'linear-gradient(135deg, #FF5722 0%, #D84315 100%)',
      borderColor: '#FF5722',
      shadowColor: 'rgba(255, 87, 34, 0.4)',
      name: 'Legend',
      color: '#BF360C'
    },
    {
      // Level 10: Champion
      icon: GiCrown,
      gradient: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF6B35 100%)',
      borderColor: '#FFD700',
      shadowColor: 'rgba(255, 215, 0, 0.5)',
      name: 'Champion',
      color: '#E65100'
    }
  ];

  const config = levelConfigs[level - 1] || levelConfigs[0];
  const IconComponent = config.icon;
  const isUnlocked = level <= currentLevel;
  const isCurrentLevel = level === currentLevel;

  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        opacity: isUnlocked ? 1 : 0.6,
        filter: isUnlocked ? 'none' : 'grayscale(80%)'
      }}
      onMouseEnter={(e) => {
        if (isUnlocked) {
          e.currentTarget.style.transform = 'scale(1.1) translateY(-5px)';
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1) translateY(0)';
      }}
    >
      {/* Level Badge Circle */}
      <div
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          background: isUnlocked 
            ? config.gradient 
            : 'linear-gradient(135deg, #e0e0e0 0%, #bdbdbd 100%)',
          border: `5px solid ${isUnlocked ? config.borderColor : '#9e9e9e'}`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: isUnlocked 
            ? `0 8px 24px ${config.shadowColor}, inset 0 2px 4px rgba(255, 255, 255, 0.3)` 
            : '0 4px 12px rgba(0, 0, 0, 0.1)',
          position: 'relative',
          transition: 'all 0.3s ease',
          overflow: 'hidden'
        }}
      >
        {/* Animated ring for current level */}
        {isCurrentLevel && (
          <div
            style={{
              position: 'absolute',
              top: '-5px',
              left: '-5px',
              right: '-5px',
              bottom: '-5px',
              borderRadius: '50%',
              border: `3px solid ${config.borderColor}`,
              animation: 'pulse-ring 2s infinite',
              opacity: 0.6
            }}
          />
        )}

        {/* Inner glow effect */}
        {isUnlocked && (
          <div
            style={{
              position: 'absolute',
              top: '10%',
              left: '10%',
              width: '30%',
              height: '30%',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.4)',
              filter: 'blur(8px)'
            }}
          />
        )}
        
        {/* Level Number */}
        <div style={{
          fontSize: size * 0.35,
          fontWeight: '900',
          color: isUnlocked ? 'white' : '#9e9e9e',
          textShadow: isUnlocked ? '0 2px 8px rgba(0,0,0,0.4)' : 'none',
          lineHeight: 1,
          marginBottom: size * 0.1,
          zIndex: 2,
          position: 'relative'
        }}>
          {level}
        </div>

        {/* Icon */}
        <IconComponent 
          size={size * 0.3} 
          style={{ 
            color: isUnlocked ? 'white' : '#9e9e9e',
            filter: isUnlocked ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' : 'none',
            zIndex: 2,
            position: 'relative'
          }} 
        />

        {/* Shine effect */}
        {isUnlocked && (
          <div
            style={{
              position: 'absolute',
              top: '15%',
              left: '15%',
              width: '20%',
              height: '20%',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.6)',
              filter: 'blur(4px)'
            }}
          />
        )}
      </div>

      {/* Level Label */}
      {showLabel && (
        <div
          style={{
            marginTop: '12px',
            textAlign: 'center',
            maxWidth: size + 40
          }}
        >
          <div
            style={{
              fontSize: size * 0.18,
              fontWeight: '700',
              color: isUnlocked ? config.color : '#9e9e9e',
              marginBottom: '4px'
            }}
          >
            {config.name}
          </div>
          {isCurrentLevel && (
            <div
              style={{
                fontSize: size * 0.14,
                color: '#06d6a0',
                fontWeight: '600',
                padding: '2px 8px',
                background: 'rgba(6, 214, 160, 0.1)',
                borderRadius: '4px',
                display: 'inline-block'
              }}
            >
              Current Level
            </div>
          )}
        </div>
      )}

      {/* Unlocked indicator */}
      {isUnlocked && !isCurrentLevel && (
        <div
          style={{
            position: 'absolute',
            top: '-8px',
            right: '-8px',
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            background: '#06d6a0',
            border: '3px solid white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(6, 214, 160, 0.4)'
          }}
        >
          <div style={{ fontSize: '12px', color: 'white' }}>✓</div>
        </div>
      )}

      {/* Current Level Indicator */}
      {isCurrentLevel && (
        <div
          style={{
            position: 'absolute',
            top: '-12px',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '4px 12px',
            background: 'linear-gradient(135deg, #06d6a0 0%, #118ab2 100%)',
            color: 'white',
            borderRadius: '12px',
            fontSize: size * 0.12,
            fontWeight: '700',
            boxShadow: '0 4px 12px rgba(6, 214, 160, 0.4)',
            whiteSpace: 'nowrap',
            animation: 'pulse 2s infinite'
          }}
        >
          CURRENT
        </div>
      )}
    </div>
  );
};

// Level Progress Component
export const LevelProgress = ({ currentLevel = 1, xp = 0, xpForNextLevel = 50 }) => {
  const levelConfigs = [
    { level: 1, xpRequired: 0, name: 'Beginner' },
    { level: 2, xpRequired: 50, name: 'Explorer' },
    { level: 3, xpRequired: 150, name: 'Adventurer' },
    { level: 4, xpRequired: 300, name: 'Enthusiast' },
    { level: 5, xpRequired: 500, name: 'Connoisseur' },
    { level: 6, xpRequired: 750, name: 'Expert' },
    { level: 7, xpRequired: 1050, name: 'Master' },
    { level: 8, xpRequired: 1400, name: 'Grand Master' },
    { level: 9, xpRequired: 1800, name: 'Legend' },
    { level: 10, xpRequired: 2250, name: 'Champion' }
  ];

  const currentLevelConfig = levelConfigs[currentLevel - 1] || levelConfigs[0];
  const nextLevelConfig = levelConfigs[currentLevel] || levelConfigs[levelConfigs.length - 1];
  const xpForCurrentLevel = currentLevelConfig.xpRequired;
  const xpProgress = xp - xpForCurrentLevel;
  const xpNeeded = nextLevelConfig.xpRequired - xpForCurrentLevel;
  const xpPercentage = Math.min((xpProgress / xpNeeded) * 100, 100);

  return (
    <div style={{
      background: 'white',
      borderRadius: '20px',
      padding: '32px',
      border: '1px solid #e9ecef',
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <div>
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            marginBottom: '8px',
            color: '#212529'
          }}>
            Status {currentLevel} - {currentLevelConfig.name}
          </h3>
          <p style={{
            fontSize: '0.875rem',
            color: '#6c757d',
            margin: 0
          }}>
            {xpProgress} / {xpNeeded} XP to Status {currentLevel + 1}
          </p>
        </div>
        <LevelBadge level={currentLevel} size={80} currentLevel={currentLevel} showLabel={false} />
      </div>

      {/* XP Progress Bar */}
      <div style={{
        width: '100%',
        height: '16px',
        background: '#e9ecef',
        borderRadius: '8px',
        overflow: 'hidden',
        marginBottom: '16px',
        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          width: `${xpPercentage}%`,
          height: '100%',
          background: 'linear-gradient(90deg, #2d5016 0%, #1e6b7f 50%, #4a9b8e 100%)',
          borderRadius: '8px',
          transition: 'width 0.5s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          paddingRight: '8px',
          color: 'white',
          fontSize: '0.75rem',
          fontWeight: '700'
        }}>
          {xpPercentage > 15 && `${Math.round(xpPercentage)}%`}
        </div>
      </div>

      {/* All Levels Preview */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '8px',
        flexWrap: 'wrap'
      }}>
        {levelConfigs.map((config) => (
          <div
            key={config.level}
            style={{
              flex: '1',
              minWidth: '60px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              opacity: config.level <= currentLevel ? 1 : 0.4
            }}
          >
            <div style={{
              width: config.level <= currentLevel ? '8px' : '6px',
              height: config.level <= currentLevel ? '8px' : '6px',
              borderRadius: '50%',
              background: config.level <= currentLevel 
                ? (config.level === currentLevel ? '#4a9b8e' : '#2d5016')
                : '#9e9e9e',
              marginBottom: '4px',
              boxShadow: config.level === currentLevel 
                ? '0 0 8px rgba(74, 155, 142, 0.6)' 
                : 'none'
            }} />
            <div style={{
              fontSize: '0.625rem',
              color: config.level <= currentLevel ? '#212529' : '#9e9e9e',
              fontWeight: config.level === currentLevel ? '700' : '400'
            }}>
              {config.level}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LevelBadge;

// Add CSS animations
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
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
  `;
  if (!document.head.querySelector('style[data-level-badge]')) {
    style.setAttribute('data-level-badge', 'true');
    document.head.appendChild(style);
  }
}

