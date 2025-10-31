'use client';
import Link from 'next/link';
import AchievementBadge from './AchievementBadge';
import UserStats from './UserStats';

export default function UserProfile({ profileData, isOwnProfile, currentUser }) {
  const { user, stats, achievements } = profileData;

  const getReputationLevel = (points) => {
    if (points >= 1000) return { level: 'Legend', color: '#e74c3c' };
    if (points >= 500) return { level: 'Expert', color: '#9b59b6' };
    if (points >= 200) return { level: 'Pro', color: '#3498db' };
    if (points >= 50) return { level: 'Contributor', color: '#2ecc71' };
    return { level: 'Newcomer', color: '#95a5a6' };
  };

  const reputation = getReputationLevel(user.reputation_points);

  return (
    <div className="user-profile">
      {/* Profile Header */}
      <div className="profile-header" style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '12px',
        padding: '2rem',
        color: 'white',
        marginBottom: '2rem',
        position: 'relative'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '2rem', flexWrap: 'wrap' }}>
          {/* Avatar Section */}
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '3rem',
              marginBottom: '1rem',
              border: '4px solid rgba(255,255,255,0.3)'
            }}>
              👤
            </div>
            <div style={{
              background: reputation.color,
              color: 'white',
              padding: '0.3rem 1rem',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: 'bold'
            }}>
              {reputation.level}
            </div>
          </div>

          {/* User Info */}
          <div style={{ flex: 1 }}>
            <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '2.5rem' }}>
              {user.name}
            </h1>
            <p style={{ 
              margin: '0 0 1rem 0', 
              opacity: 0.9,
              fontSize: '1.1rem'
            }}>
              @{user.username}
            </p>
            
            {user.bio && (
              <p style={{ 
                margin: '0 0 1rem 0',
                fontSize: '1rem',
                lineHeight: '1.5'
              }}>
                {user.bio}
              </p>
            )}

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {user.location && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  📍 {user.location}
                </span>
              )}
              {user.website && (
                <a href={user.website} target="_blank" rel="noopener noreferrer"
                  style={{ color: 'white', textDecoration: 'none' }}>
                  🌐 Website
                </a>
              )}
            </div>

            {/* Social Links */}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              {user.social_facebook && (
                <a href={user.social_facebook} target="_blank" rel="noopener noreferrer"
                  style={{ color: 'white', textDecoration: 'none', fontSize: '1.2rem' }}>
                  📘
                </a>
              )}
              {user.social_twitter && (
                <a href={user.social_twitter} target="_blank" rel="noopener noreferrer"
                  style={{ color: 'white', textDecoration: 'none', fontSize: '1.2rem' }}>
                  🐦
                </a>
              )}
              {user.social_instagram && (
                <a href={user.social_instagram} target="_blank" rel="noopener noreferrer"
                  style={{ color: 'white', textDecoration: 'none', fontSize: '1.2rem' }}>
                  📷
                </a>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '0.5rem', flexDirection: 'column' }}>
            {isOwnProfile ? (
              <>
                <Link href="/profile/edit" className="btn" 
                  style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid white' }}>
                  ✏️ Edit Profil
                </Link>
                <Link href="/dashboard" className="btn btn-secondary">
                  📊 Dashboard
                </Link>
              </>
            ) : currentUser && (
              <button className="btn" style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid white' }}>
                👥 Follow
              </button>
            )}
          </div>
        </div>

        {/* Reputation Points */}
        <div style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          background: 'rgba(255,255,255,0.2)',
          padding: '0.5rem 1rem',
          borderRadius: '20px',
          fontSize: '0.9rem'
        }}>
          🏆 {user.reputation_points} Reputasi
        </div>
      </div>

      {/* Stats & Achievements */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '2rem',
        marginBottom: '2rem'
      }}>
        {/* User Stats */}
        <UserStats stats={stats} />

        {/* Achievements */}
        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ marginBottom: '1rem', color: '#2c3e50' }}>Pencapaian</h3>
          {achievements.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {achievements.map((achievement, index) => (
                <AchievementBadge 
                  key={index}
                  type={achievement.achievement_type}
                  name={achievement.achievement_name}
                  date={achievement.achieved_at}
                />
              ))}
            </div>
          ) : (
            <p style={{ color: '#666', textAlign: 'center', padding: '1rem' }}>
              Belum ada pencapaian. Mulai menulis dan berinteraksi untuk mendapatkan achievement!
            </p>
          )}
        </div>
      </div>

      {/* Member Since */}
      <div style={{
        background: '#f8f9fa',
        padding: '1rem',
        borderRadius: '8px',
        textAlign: 'center',
        color: '#666'
      }}>
        Anggota sejak {new Date(user.created_at).toLocaleDateString('id-ID', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}
      </div>
    </div>
  );
}