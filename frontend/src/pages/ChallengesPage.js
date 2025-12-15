import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { 
  HiStar, 
  HiFire, 
  HiSparkles,
  HiShieldCheck,
  HiLightningBolt,
  HiBadgeCheck,
  HiLocationMarker
} from 'react-icons/hi';
import { 
  GiTrophyCup,
  GiWineGlass
} from 'react-icons/gi';

const ChallengesPage = () => {
  const navigate = useNavigate();
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      setLoading(true);
      const response = await api.get('/challenges');
      setChallenges(response.data.data.challenges);
    } catch (error) {
      console.error('Failed to fetch challenges:', error);
    } finally {
      setLoading(false);
    }
  };

  // Separate challenges by type
  const specialChallenges = challenges.filter(challenge => challenge.isSpecial === true);
  const regularChallenges = challenges.filter(challenge => 
    challenge.type !== 'combo' && 
    !challenge.requirements?.menuCombo &&
    (!challenge.requirements?.requiredVenues || challenge.requirements.requiredVenues.length === 0) &&
    !challenge.isSpecial
  );
  const comboChallenges = challenges.filter(challenge => challenge.type === 'combo' && !challenge.isSpecial);
  const menuComboChallenges = challenges.filter(challenge => 
    challenge.requirements?.menuCombo && 
    challenge.requirements.menuCombo.items &&
    !challenge.isSpecial
  );
  const restaurantChallenges = challenges.filter(challenge => 
    challenge.requirements?.requiredVenues && 
    challenge.requirements.requiredVenues.length > 0 &&
    !challenge.requirements?.menuCombo &&
    !challenge.isSpecial
  );

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh' 
      }}>
        <div className="progress-circular"></div>
      </div>
    );
  }

  const getChallengeIcon = (challenge) => {
    if (challenge.isSpecial) {
      if (challenge.eventType === 'halloween') return HiFire;
      if (challenge.eventType === 'new_year') return HiSparkles;
      return HiStar;
    }
    if (challenge.type === 'combo') return GiTrophyCup;
    if (challenge.requirements?.menuCombo) return HiSparkles;
    if (challenge.requirements?.requiredVenues?.length > 0) return HiLocationMarker;
    if (challenge.type === 'wine_challenge') return GiWineGlass;
    if (challenge.type === 'khachapuri_trail') return HiStar;
    if (challenge.type === 'regional') return HiLocationMarker;
    return HiBadgeCheck;
  };

  const getChallengeGradient = (challenge) => {
    if (challenge.isSpecial) {
      if (challenge.eventType === 'halloween') return 'linear-gradient(135deg, #ff6b35 0%, #8b0000 100%)';
      if (challenge.eventType === 'new_year') return 'linear-gradient(135deg, #ffd700 0%, #ff8c00 50%, #ff4500 100%)';
      return 'linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)';
    }
    if (challenge.type === 'combo') return 'linear-gradient(135deg, #f77f00 0%, #d62828 100%)';
    if (challenge.requirements?.menuCombo) return 'linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)';
    if (challenge.requirements?.requiredVenues?.length > 0) return 'linear-gradient(135deg, #457b9d 0%, #1d3557 100%)';
    if (challenge.progress.percentage === 100) return 'linear-gradient(135deg, #06d6a0 0%, #118ab2 100%)';
    return 'linear-gradient(135deg, #e63946 0%, #c1121f 100%)';
  };

  const getEventBadgeColor = (eventType) => {
    if (eventType === 'halloween') return { bg: 'rgba(255, 107, 53, 0.2)', color: '#ff6b35', border: 'rgba(255, 107, 53, 0.4)' };
    if (eventType === 'new_year') return { bg: 'rgba(255, 215, 0, 0.2)', color: '#ffd700', border: 'rgba(255, 215, 0, 0.4)' };
    return { bg: 'rgba(156, 39, 176, 0.2)', color: '#9c27b0', border: 'rgba(156, 39, 176, 0.4)' };
  };

  const formatEventDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const renderChallengeCard = (challenge) => {
    const IconComponent = getChallengeIcon(challenge);
    const isCompleted = challenge.progress.percentage === 100;
    const isCombo = challenge.type === 'combo';
    const isMenuCombo = challenge.requirements?.menuCombo && challenge.requirements.menuCombo.items;
    const isRestaurantChallenge = challenge.requirements?.requiredVenues && challenge.requirements.requiredVenues.length > 0 && !isMenuCombo;
    const isSpecial = challenge.isSpecial === true;
    const eventBadge = isSpecial ? getEventBadgeColor(challenge.eventType) : null;

  return (
      <div 
        key={challenge.id} 
        style={{
          background: 'white',
          borderRadius: '24px',
          border: isSpecial
            ? `3px solid ${eventBadge?.color || '#9c27b0'}`
            : isCombo 
              ? '3px solid #f77f00' 
              : isMenuCombo
                ? '3px solid #9c27b0'
                : isRestaurantChallenge
                  ? '3px solid #457b9d'
                  : isCompleted
                    ? '2px solid #06d6a0'
                    : '1px solid #e9ecef',
          padding: '0',
          transition: 'all 0.3s ease',
          cursor: 'pointer',
          boxShadow: isCompleted
            ? '0 8px 24px rgba(6, 214, 160, 0.2)'
            : '0 4px 12px rgba(0,0,0,0.08)',
          position: 'relative',
          overflow: 'hidden'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-8px)';
          e.currentTarget.style.boxShadow = isCompleted
            ? '0 12px 32px rgba(6, 214, 160, 0.3)'
            : '0 8px 24px rgba(0,0,0,0.15)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = isCompleted
            ? '0 8px 24px rgba(6, 214, 160, 0.2)'
            : '0 4px 12px rgba(0,0,0,0.08)';
        }}
      >
        {/* Header with gradient */}
        <div style={{
          background: getChallengeGradient(challenge),
          padding: '24px',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Decorative circles */}
          <div style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
            filter: 'blur(20px)'
          }} />
          <div style={{
            position: 'absolute',
            bottom: '-30px',
            left: '-30px',
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
            filter: 'blur(15px)'
          }} />

          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-start',
            position: 'relative',
            zIndex: 1
          }}>
            <div style={{ flex: 1 }}>
              {isSpecial && (
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                  <span style={{ 
                    display: 'inline-block',
                    padding: '6px 12px',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    color: 'white',
                    borderRadius: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.5)'
                  }}>
                    ⭐ Special Event
                  </span>
                  <span style={{ 
                    display: 'inline-block',
                    padding: '6px 12px',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    backgroundColor: 'rgba(255, 255, 255, 0.25)',
                    color: 'white',
                    borderRadius: '12px',
                    textTransform: 'capitalize',
                    letterSpacing: '0.5px',
                    backdropFilter: 'blur(10px)'
                  }}>
                    {challenge.eventType?.replace('_', ' ') || 'Special'}
                  </span>
                  {(challenge.startDate || challenge.endDate) && (
                    <span style={{ 
                      display: 'inline-block',
                      padding: '6px 12px',
                      fontSize: '0.7rem',
                      fontWeight: '600',
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      borderRadius: '12px',
                      backdropFilter: 'blur(10px)'
                    }}>
                      {challenge.startDate && formatEventDate(challenge.startDate)} - {challenge.endDate && formatEventDate(challenge.endDate)}
                    </span>
                  )}
                </div>
              )}
              {isCombo && !isSpecial && (
                <span style={{ 
                  display: 'inline-block',
                  padding: '6px 12px',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  backgroundColor: 'rgba(255, 255, 255, 0.25)',
                  color: 'white',
                  borderRadius: '12px',
                  marginBottom: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  backdropFilter: 'blur(10px)'
                }}>
                  Combo Challenge
                </span>
              )}
              {isMenuCombo && !isSpecial && (
                <span style={{ 
                  display: 'inline-block',
                  padding: '6px 12px',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  backgroundColor: 'rgba(255, 255, 255, 0.25)',
                  color: 'white',
                  borderRadius: '12px',
                  marginBottom: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  backdropFilter: 'blur(10px)'
                }}>
                  Menu Combo
                </span>
              )}
              {isRestaurantChallenge && !isSpecial && (
                <span style={{ 
                  display: 'inline-block',
                  padding: '6px 12px',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  backgroundColor: 'rgba(255, 255, 255, 0.25)',
                  color: 'white',
                  borderRadius: '12px',
                  marginBottom: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  backdropFilter: 'blur(10px)'
                }}>
                  Restaurant Challenge
                </span>
              )}
              <h3 style={{ 
                margin: 0, 
                fontSize: '1.5rem', 
                fontWeight: '800',
                color: 'white',
                marginBottom: '8px',
                textShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }}>
                {challenge.name}
              </h3>
            </div>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
            }}>
              <IconComponent size={32} style={{ color: 'white' }} />
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '24px' }}>
          <p style={{ 
            fontSize: '1rem', 
            color: '#6c757d',
            marginBottom: '24px',
            lineHeight: '1.6'
          }}>
            {challenge.description}
          </p>
          
          {isCombo && challenge.requirements.requiredChallenges && challenge.requirements.requiredChallenges.length > 0 && (
            <div style={{ 
              padding: '16px',
              background: 'linear-gradient(135deg, rgba(247, 127, 0, 0.1) 0%, rgba(214, 40, 40, 0.1) 100%)',
              borderRadius: '12px',
              marginBottom: '20px',
              border: '1px solid rgba(247, 127, 0, 0.2)'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center',
                gap: '8px',
                marginBottom: '12px'
              }}>
                <HiSparkles size={20} style={{ color: '#f77f00' }} />
                <p style={{ 
                  fontSize: '0.875rem', 
                  fontWeight: '700', 
                  margin: 0, 
                  color: '#f77f00'
                }}>
                  Required Challenges:
                </p>
        </div>
              <div style={{ 
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px'
              }}>
                {challenge.requirements.requiredChallenges.map((reqChallenge, idx) => (
                  <span key={idx} style={{
                    padding: '6px 12px',
                    background: 'white',
                    borderRadius: '8px',
                    fontSize: '0.8125rem',
                    color: '#495057',
                    fontWeight: '600',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                  }}>
                    {reqChallenge.name}
                  </span>
                ))}
              </div>
                </div>
          )}

          {isMenuCombo && challenge.requirements.menuCombo && (
            <div style={{ 
              padding: '16px',
              background: 'linear-gradient(135deg, rgba(156, 39, 176, 0.1) 0%, rgba(123, 31, 162, 0.1) 100%)',
              borderRadius: '12px',
              marginBottom: '20px',
              border: '1px solid rgba(156, 39, 176, 0.2)'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center',
                gap: '8px',
                marginBottom: '12px'
              }}>
                <HiSparkles size={20} style={{ color: '#9c27b0' }} />
                <p style={{ 
                  fontSize: '0.875rem', 
                  fontWeight: '700', 
                  margin: 0, 
                  color: '#9c27b0'
                }}>
                  Menu Combo Required ({challenge.requirements.menuCombo.requiredCount} items):
                </p>
              </div>
              <div style={{ 
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px'
              }}>
                {challenge.requirements.menuCombo.items.map((item, idx) => (
                  <span key={idx} style={{
                    padding: '8px 14px',
                    background: 'white',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    color: '#9c27b0',
                    fontWeight: '700',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                    textTransform: 'capitalize'
                  }}>
                    {item.replace('_', ' ')}
                  </span>
                ))}
              </div>
            </div>
          )}

          {challenge.requirements.requiredVenues && challenge.requirements.requiredVenues.length > 0 && (
            <div style={{ 
              padding: '16px',
              background: 'linear-gradient(135deg, rgba(69, 123, 157, 0.1) 0%, rgba(29, 53, 87, 0.1) 100%)',
              borderRadius: '12px',
              marginBottom: '20px',
              border: '1px solid rgba(69, 123, 157, 0.2)'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center',
                gap: '8px',
                marginBottom: '12px'
              }}>
                <HiLocationMarker size={20} style={{ color: '#457b9d' }} />
                <p style={{ 
                  fontSize: '0.875rem', 
                  fontWeight: '700', 
                  margin: 0, 
                  color: '#457b9d'
                }}>
                  Required Venue:
                    </p>
                  </div>
              {challenge.requirements.requiredVenues.map((venue, idx) => (
                <div key={idx} style={{
                  padding: '8px 12px',
                  background: 'white',
                  borderRadius: '8px',
                  marginBottom: idx < challenge.requirements.requiredVenues.length - 1 ? '8px' : 0
                }}>
                  <div style={{ 
                    fontSize: '0.875rem', 
                    fontWeight: '700',
                    color: '#212529',
                    marginBottom: '4px'
                  }}>
                    {venue.name}
                  </div>
                  {venue.location && venue.location.address && (
                    <div style={{ 
                      fontSize: '0.75rem', 
                      color: '#6c757d',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <HiLocationMarker size={14} />
                      {venue.location.address}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Progress Section */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '12px'
            }}>
              <span style={{ 
                fontSize: '0.875rem', 
                color: '#495057',
                fontWeight: '600'
              }}>
                {isCombo ? 'Completed Challenges' : 'Progress'}
              </span>
              <span style={{ 
                fontSize: '1rem', 
                fontWeight: '800', 
                color: isCompleted ? '#06d6a0' : '#e63946',
                background: isCompleted 
                  ? 'rgba(6, 214, 160, 0.1)' 
                  : 'rgba(230, 57, 70, 0.1)',
                padding: '4px 12px',
                borderRadius: '12px'
              }}>
                {challenge.progress.percentage}%
              </span>
            </div>
            <div style={{
              width: '100%',
              height: '16px',
              background: '#e9ecef',
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <div style={{
                width: `${challenge.progress.percentage}%`,
                height: '100%',
                background: isCompleted
                  ? 'linear-gradient(90deg, #06d6a0 0%, #118ab2 100%)'
                  : 'linear-gradient(90deg, #e63946 0%, #f77f7f 100%)',
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
                {challenge.progress.percentage > 15 && `${challenge.progress.current}/${challenge.progress.required}`}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '20px',
            borderTop: '1px solid #e9ecef'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                padding: '6px 12px',
                background: 'linear-gradient(135deg, rgba(230, 57, 70, 0.1) 0%, rgba(193, 18, 31, 0.1) 100%)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <HiStar size={16} style={{ color: '#e63946' }} />
                <span style={{ 
                  fontSize: '0.875rem', 
                  color: '#e63946',
                  fontWeight: '700'
                }}>
                  {challenge.xpReward} XP
                </span>
              </div>
              <div style={{
                padding: '6px 12px',
                background: 'linear-gradient(135deg, rgba(247, 127, 0, 0.1) 0%, rgba(214, 40, 40, 0.1) 100%)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <GiTrophyCup size={16} style={{ color: '#f77f00' }} />
                <span style={{ 
                  fontSize: '0.875rem', 
                  color: '#f77f00',
                  fontWeight: '700'
                }}>
                  {challenge.reward.value}
                </span>
              </div>
            </div>
            {isCompleted && (
              <div style={{
                padding: '8px 16px',
                background: 'linear-gradient(135deg, #06d6a0 0%, #118ab2 100%)',
                color: 'white',
                borderRadius: '12px',
                fontSize: '0.875rem',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 4px 12px rgba(6, 214, 160, 0.3)'
              }}>
                <HiBadgeCheck size={18} />
                Completed
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const completedCount = challenges.filter(c => c.progress.percentage === 100).length;
  const totalCount = challenges.length;

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
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              marginBottom: '24px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
            }}>
              <GiTrophyCup size={60} style={{ color: 'white' }} />
            </div>
            <h1 style={{ 
              fontSize: '3.5rem', 
              fontWeight: '800', 
              marginBottom: '24px',
              color: 'white',
              letterSpacing: '-1px',
              textShadow: '2px 2px 8px rgba(0, 0, 0, 0.5), 0 0 20px rgba(0, 0, 0, 0.3)'
            }}>
              Challenges
            </h1>
            <p style={{ 
              fontSize: '1.25rem', 
              color: 'white', 
              marginBottom: '32px',
              maxWidth: '700px',
              margin: '0 auto 32px',
              textShadow: '1px 1px 4px rgba(0, 0, 0, 0.5)'
            }}>
              Complete challenges to unlock rewards, badges, and exclusive experiences
            </p>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '32px',
              flexWrap: 'wrap'
            }}>
              <div style={{
                padding: '16px 32px',
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.3)'
              }}>
                <div style={{ fontSize: '2rem', fontWeight: '800', color: 'white', marginBottom: '4px' }}>
                  {totalCount}
                </div>
                <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.9)' }}>
                  Total Challenges
                </div>
              </div>
              <div style={{
                padding: '16px 32px',
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.3)'
              }}>
                <div style={{ fontSize: '2rem', fontWeight: '800', color: 'white', marginBottom: '4px' }}>
                  {completedCount}
                </div>
                <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.9)' }}>
                  Completed
                </div>
              </div>
              <div style={{
                padding: '16px 32px',
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.3)'
              }}>
                <div style={{ fontSize: '2rem', fontWeight: '800', color: 'white', marginBottom: '4px' }}>
                  {Math.round((completedCount / totalCount) * 100) || 0}%
                </div>
                <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.9)' }}>
                  Completion Rate
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Challenges Content */}
      <section style={{ padding: '80px 24px' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>

          {challenges.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '80px 24px',
              background: 'linear-gradient(135deg, rgba(230, 57, 70, 0.08) 0%, rgba(69, 123, 157, 0.08) 100%)',
              borderRadius: '24px',
              border: '1px solid #e9ecef'
            }}>
              <div style={{ 
                fontSize: '80px', 
                marginBottom: '24px',
                filter: 'grayscale(100%)',
                opacity: 0.5
              }}>
                <GiTrophyCup size={80} style={{ color: '#9e9e9e' }} />
              </div>
              <h2 style={{ 
                fontSize: '1.75rem', 
                fontWeight: '700', 
                marginBottom: '12px',
                color: '#212529'
              }}>
                No challenges available
              </h2>
              <p style={{ 
                fontSize: '1.125rem', 
                color: '#6c757d'
              }}>
                Check back soon for new challenges!
              </p>
            </div>
          ) : (
            <>
              {/* Special Challenges Section */}
              {specialChallenges.length > 0 && (
                <div style={{ marginBottom: '64px' }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '32px',
                    flexWrap: 'wrap',
                    gap: '16px'
                  }}>
                    <div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        marginBottom: '8px'
                      }}>
                        <div style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '12px',
                          background: 'linear-gradient(135deg, #ff6b35 0%, #ffd700 50%, #8b0000 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 4px 12px rgba(255, 107, 53, 0.4)',
                          animation: 'pulse 2s infinite'
                        }}>
                          <HiSparkles size={24} style={{ color: 'white' }} />
                        </div>
                        <h2 style={{ 
                          fontSize: '2.25rem', 
                          fontWeight: '800', 
                          margin: 0,
                          color: '#212529',
                          letterSpacing: '-0.5px'
                        }}>
                          Special Event Challenges
                        </h2>
                      </div>
                      <p style={{ 
                        fontSize: '1rem', 
                        color: '#6c757d',
                        margin: 0,
                        paddingLeft: '60px'
                      }}>
                        Limited-time seasonal challenges with exclusive rewards and bonus XP
                      </p>
                    </div>
                    <div style={{
                      padding: '12px 24px',
                      background: 'linear-gradient(135deg, #ff6b35 0%, #ffd700 50%, #8b0000 100%)',
                      color: 'white',
                      borderRadius: '16px',
                      fontSize: '0.9375rem',
                      fontWeight: '700',
                      boxShadow: '0 4px 12px rgba(255, 107, 53, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <HiSparkles size={20} />
                      {specialChallenges.length} Active
                    </div>
                  </div>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', 
                    gap: '32px' 
                  }}>
                    {specialChallenges.map((challenge) => renderChallengeCard(challenge))}
                  </div>
                </div>
              )}

              {/* Menu Combo Challenges Section */}
              {menuComboChallenges.length > 0 && (
                <div style={{ marginBottom: '64px' }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '32px',
                    flexWrap: 'wrap',
                    gap: '16px'
                  }}>
                    <div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        marginBottom: '8px'
                      }}>
                        <div style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '12px',
                          background: 'linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 4px 12px rgba(156, 39, 176, 0.3)'
                        }}>
                          <HiSparkles size={24} style={{ color: 'white' }} />
                        </div>
                        <h2 style={{ 
                          fontSize: '2.25rem', 
                          fontWeight: '800', 
                          margin: 0,
                          color: '#212529',
                          letterSpacing: '-0.5px'
                        }}>
                          Menu Combo Challenges
                        </h2>
                      </div>
                      <p style={{ 
                        fontSize: '1rem', 
                        color: '#6c757d',
                        margin: 0,
                        paddingLeft: '60px'
                      }}>
                        Order specific menu items together to unlock bonus XP rewards
                      </p>
                    </div>
                    <div style={{
                      padding: '12px 24px',
                      background: 'linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)',
                      color: 'white',
                      borderRadius: '16px',
                      fontSize: '0.9375rem',
                      fontWeight: '700',
                      boxShadow: '0 4px 12px rgba(156, 39, 176, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <HiSparkles size={20} />
                      {menuComboChallenges.length} Available
                    </div>
                  </div>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', 
                    gap: '32px' 
                  }}>
                    {menuComboChallenges.map((challenge) => renderChallengeCard(challenge))}
                  </div>
                </div>
              )}

              {/* Restaurant Challenges Section */}
              {restaurantChallenges.length > 0 && (
                <div style={{ marginBottom: '64px' }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '32px',
                    flexWrap: 'wrap',
                    gap: '16px'
                  }}>
                    <div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        marginBottom: '8px'
                      }}>
                        <div style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '12px',
                          background: 'linear-gradient(135deg, #457b9d 0%, #1d3557 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 4px 12px rgba(69, 123, 157, 0.3)'
                        }}>
                          <HiLocationMarker size={24} style={{ color: 'white' }} />
                        </div>
                        <h2 style={{ 
                          fontSize: '2.25rem', 
                          fontWeight: '800', 
                          margin: 0,
                          color: '#212529',
                          letterSpacing: '-0.5px'
                        }}>
                          Restaurant Challenges
                        </h2>
                      </div>
                      <p style={{ 
                        fontSize: '1rem', 
                        color: '#6c757d',
                        margin: 0,
                        paddingLeft: '60px'
                      }}>
                        Visit specific restaurants to unlock unique rewards and XP
                      </p>
                    </div>
                    <div style={{
                      padding: '12px 24px',
                      background: 'linear-gradient(135deg, #457b9d 0%, #1d3557 100%)',
                      color: 'white',
                      borderRadius: '16px',
                      fontSize: '0.9375rem',
                      fontWeight: '700',
                      boxShadow: '0 4px 12px rgba(69, 123, 157, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <HiLocationMarker size={20} />
                      {restaurantChallenges.length} Available
                    </div>
                  </div>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', 
                    gap: '32px' 
                  }}>
                    {restaurantChallenges.map((challenge) => renderChallengeCard(challenge))}
                  </div>
                </div>
              )}

              {/* Combo Challenges Section */}
              {comboChallenges.length > 0 && (
                <div style={{ marginBottom: '64px' }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '32px',
                    flexWrap: 'wrap',
                    gap: '16px'
                  }}>
                    <div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        marginBottom: '8px'
                      }}>
                        <div style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '12px',
                          background: 'linear-gradient(135deg, #f77f00 0%, #d62828 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 4px 12px rgba(247, 127, 0, 0.3)'
                        }}>
                          <HiSparkles size={24} style={{ color: 'white' }} />
                        </div>
                        <h2 style={{ 
                          fontSize: '2.25rem', 
                          fontWeight: '800', 
                          margin: 0,
                          color: '#212529',
                          letterSpacing: '-0.5px'
                        }}>
                          Combo Challenges
                        </h2>
                      </div>
                      <p style={{ 
                        fontSize: '1rem', 
                        color: '#6c757d',
                        margin: 0,
                        paddingLeft: '60px'
                      }}>
                        Complete multiple challenges to unlock these special rewards
                      </p>
                    </div>
                    <div style={{
                      padding: '12px 24px',
                      background: 'linear-gradient(135deg, #f77f00 0%, #d62828 100%)',
                      color: 'white',
                      borderRadius: '16px',
                      fontSize: '0.9375rem',
                      fontWeight: '700',
                      boxShadow: '0 4px 12px rgba(247, 127, 0, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <GiTrophyCup size={20} />
                      {comboChallenges.length} Available
                    </div>
                  </div>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', 
                    gap: '32px' 
                  }}>
                    {comboChallenges.map((challenge) => renderChallengeCard(challenge))}
                  </div>
                </div>
              )}

              {/* Regular Challenges Section */}
              {regularChallenges.length > 0 && (
                <div>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '32px',
                    flexWrap: 'wrap',
                    gap: '16px'
                  }}>
                    <div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        marginBottom: '8px'
                      }}>
                        <div style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '12px',
                          background: 'linear-gradient(135deg, #e63946 0%, #c1121f 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 4px 12px rgba(230, 57, 70, 0.3)'
                        }}>
                          <HiBadgeCheck size={24} style={{ color: 'white' }} />
                        </div>
                        <h2 style={{ 
                          fontSize: '2.25rem', 
                          fontWeight: '800', 
                          margin: 0,
                          color: '#212529',
                          letterSpacing: '-0.5px'
                        }}>
                          Regular Challenges
                        </h2>
                      </div>
                      <p style={{ 
                        fontSize: '1rem', 
                        color: '#6c757d',
                        margin: 0,
                        paddingLeft: '60px'
                      }}>
                        Complete individual challenges to progress and earn rewards
                      </p>
                    </div>
                    <div style={{
                      padding: '12px 24px',
                      background: 'linear-gradient(135deg, #e63946 0%, #c1121f 100%)',
                      color: 'white',
                      borderRadius: '16px',
                      fontSize: '0.9375rem',
                      fontWeight: '700',
                      boxShadow: '0 4px 12px rgba(230, 57, 70, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <HiBadgeCheck size={20} />
                      {regularChallenges.length} Available
                    </div>
                  </div>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', 
                    gap: '32px' 
                  }}>
                    {regularChallenges.map((challenge) => renderChallengeCard(challenge))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <style>{`
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

export default ChallengesPage;
