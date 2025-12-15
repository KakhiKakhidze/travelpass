import React from 'react';
import { 
  HiStar, 
  HiFire, 
  HiSparkles,
  HiBadgeCheck,
  HiLightningBolt,
  HiHeart,
  HiShieldCheck,
  HiGift,
  HiFlag
} from 'react-icons/hi';
import { 
  GiWineGlass, 
  GiCheeseWedge, 
  GiTrophyCup,
  GiMedal,
  GiCrown
} from 'react-icons/gi';
import { 
  FaAward,
  FaGem,
  FaCrown
} from 'react-icons/fa';

const Badge = ({ type = 1, size = 80, earned = false, title, description }) => {
  const badges = [
    {
      // Badge 1: Classic Star Badge
      icon: HiStar,
      gradient: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
      borderColor: '#FFD700',
      shadowColor: 'rgba(255, 215, 0, 0.4)',
      name: 'Star Explorer'
    },
    {
      // Badge 2: Wine Connoisseur
      icon: GiWineGlass,
      gradient: 'linear-gradient(135deg, #8B0000 0%, #DC143C 100%)',
      borderColor: '#8B0000',
      shadowColor: 'rgba(139, 0, 0, 0.4)',
      name: 'Wine Master'
    },
    {
      // Badge 3: Fire Badge
      icon: HiFire,
      gradient: 'linear-gradient(135deg, #FF4500 0%, #FF6347 100%)',
      borderColor: '#FF4500',
      shadowColor: 'rgba(255, 69, 0, 0.4)',
      name: 'Fire Explorer'
    },
    {
      // Badge 4: Sparkles Badge
      icon: HiSparkles,
      gradient: 'linear-gradient(135deg, #9370DB 0%, #BA55D3 100%)',
      borderColor: '#9370DB',
      shadowColor: 'rgba(147, 112, 219, 0.4)',
      name: 'Sparkle Collector'
    },
    {
      // Badge 5: Shield Badge
      icon: HiShieldCheck,
      gradient: 'linear-gradient(135deg, #4169E1 0%, #1E90FF 100%)',
      borderColor: '#4169E1',
      shadowColor: 'rgba(65, 105, 225, 0.4)',
      name: 'Shield Guardian'
    },
    {
      // Badge 6: Lightning Badge
      icon: HiLightningBolt,
      gradient: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF6347 100%)',
      borderColor: '#FFD700',
      shadowColor: 'rgba(255, 215, 0, 0.5)',
      name: 'Lightning Fast'
    },
    {
      // Badge 7: Heart Badge
      icon: HiHeart,
      gradient: 'linear-gradient(135deg, #FF1493 0%, #FF69B4 100%)',
      borderColor: '#FF1493',
      shadowColor: 'rgba(255, 20, 147, 0.4)',
      name: 'Heart Collector'
    },
    {
      // Badge 8: Crown Badge
      icon: GiCrown,
      gradient: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%)',
      borderColor: '#FFD700',
      shadowColor: 'rgba(255, 215, 0, 0.5)',
      name: 'Royal Explorer'
    },
    {
      // Badge 9: Gem Badge
      icon: FaGem,
      gradient: 'linear-gradient(135deg, #00CED1 0%, #20B2AA 50%, #008B8B 100%)',
      borderColor: '#00CED1',
      shadowColor: 'rgba(0, 206, 209, 0.4)',
      name: 'Gem Hunter'
    },
    {
      // Badge 10: Trophy Badge
      icon: GiTrophyCup,
      gradient: 'linear-gradient(135deg, #FF6347 0%, #FF4500 50%, #DC143C 100%)',
      borderColor: '#FF6347',
      shadowColor: 'rgba(255, 99, 71, 0.4)',
      name: 'Champion'
    }
  ];

  const badge = badges[(type - 1) % badges.length];
  const IconComponent = badge.icon;

  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        opacity: earned ? 1 : 0.5,
        filter: earned ? 'none' : 'grayscale(100%)'
      }}
      onMouseEnter={(e) => {
        if (earned) {
          e.currentTarget.style.transform = 'scale(1.1) translateY(-5px)';
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1) translateY(0)';
      }}
    >
      {/* Badge Circle */}
      <div
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          background: earned 
            ? badge.gradient 
            : 'linear-gradient(135deg, #e0e0e0 0%, #bdbdbd 100%)',
          border: `4px solid ${earned ? badge.borderColor : '#9e9e9e'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: earned 
            ? `0 8px 24px ${badge.shadowColor}, inset 0 2px 4px rgba(255, 255, 255, 0.3)` 
            : '0 4px 12px rgba(0, 0, 0, 0.1)',
          position: 'relative',
          transition: 'all 0.3s ease'
        }}
      >
        {/* Inner glow effect */}
        {earned && (
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
        
        {/* Icon */}
        <IconComponent 
          size={size * 0.5} 
          style={{ 
            color: earned ? 'white' : '#9e9e9e',
            filter: earned ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' : 'none',
            zIndex: 1,
            position: 'relative'
          }} 
        />

        {/* Shine effect */}
        {earned && (
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

      {/* Badge Label */}
      {(title || badge.name) && (
        <div
          style={{
            marginTop: '12px',
            textAlign: 'center',
            maxWidth: size + 40
          }}
        >
          <div
            style={{
              fontSize: size * 0.2,
              fontWeight: '700',
              color: earned ? '#212529' : '#9e9e9e',
              marginBottom: '4px'
            }}
          >
            {title || badge.name}
          </div>
          {description && (
            <div
              style={{
                fontSize: size * 0.15,
                color: earned ? '#6c757d' : '#bdbdbd',
                lineHeight: '1.4'
              }}
            >
              {description}
            </div>
          )}
        </div>
      )}

      {/* Earned indicator */}
      {earned && (
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
            boxShadow: '0 2px 8px rgba(6, 214, 160, 0.4)',
            animation: 'pulse 2s infinite'
          }}
        >
          <div style={{ fontSize: '12px' }}>✓</div>
        </div>
      )}
    </div>
  );
};

// Badge Showcase Component
export const BadgeShowcase = () => {
  const badges = [
    { type: 1, title: 'Star Explorer', description: 'Complete 5 challenges' },
    { type: 2, title: 'Wine Master', description: 'Visit 10 wineries' },
    { type: 3, title: 'Fire Explorer', description: 'Complete combo challenge' },
    { type: 4, title: 'Sparkle Collector', description: 'Collect 20 stamps' },
    { type: 5, title: 'Shield Guardian', description: 'Perfect attendance' },
    { type: 6, title: 'Lightning Fast', description: 'Complete in 1 day' },
    { type: 7, title: 'Heart Collector', description: 'Favorite 5 venues' },
    { type: 8, title: 'Royal Explorer', description: 'Reach status 5' },
    { type: 9, title: 'Gem Hunter', description: 'Find hidden gems' },
    { type: 10, title: 'Champion', description: 'Complete all challenges' }
  ];

  return (
    <div style={{
      padding: '40px 24px',
      background: '#f8f9fa'
    }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{
          fontSize: '2.5rem',
          fontWeight: '800',
          textAlign: 'center',
          marginBottom: '16px',
          color: '#212529'
        }}>
          Achievement Badges
        </h2>
        <p style={{
          fontSize: '1.125rem',
          textAlign: 'center',
          color: '#6c757d',
          marginBottom: '48px',
          maxWidth: '600px',
          margin: '0 auto 48px'
        }}>
          Unlock these amazing badges as you explore Georgia's treasures
        </p>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '40px',
          marginBottom: '40px'
        }}>
          {badges.map((badge, index) => (
            <div key={index} style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '24px',
              background: 'white',
              borderRadius: '16px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
            }}
            >
              <Badge 
                type={badge.type} 
                size={100} 
                earned={index < 3} 
                title={badge.title}
                description={badge.description}
              />
            </div>
          ))}
        </div>

        {/* Legend */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '32px',
          flexWrap: 'wrap',
          padding: '24px',
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
              border: '2px solid #FFD700'
            }} />
            <span style={{ fontSize: '0.875rem', color: '#6c757d' }}>Earned</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #e0e0e0 0%, #bdbdbd 100%)',
              border: '2px solid #9e9e9e',
              filter: 'grayscale(100%)'
            }} />
            <span style={{ fontSize: '0.875rem', color: '#6c757d' }}>Locked</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  );
};

export default Badge;

