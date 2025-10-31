export default function AchievementBadge({ type, name, date }) {
  const getAchievementIcon = (type) => {
    const icons = {
      writer: '📝',
      commentator: '💬',
      popular: '🔥',
      veteran: '⭐',
      social: '👥',
      quality: '🏆'
    };
    return icons[type] || '🎖️';
  };

  const getAchievementColor = (type) => {
    const colors = {
      writer: '#3498db',
      commentator: '#2ecc71',
      popular: '#e74c3c',
      veteran: '#f39c12',
      social: '#9b59b6',
      quality: '#e67e22'
    };
    return colors[type] || '#95a5a6';
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      padding: '0.75rem',
      background: '#f8f9fa',
      borderRadius: '8px',
      borderLeft: `4px solid ${getAchievementColor(type)}`
    }}>
      <div style={{ fontSize: '1.5rem' }}>
        {getAchievementIcon(type)}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 'bold', color: '#2c3e50' }}>
          {name}
        </div>
        <div style={{ fontSize: '0.8rem', color: '#666' }}>
          Dicapai pada {new Date(date).toLocaleDateString('id-ID')}
        </div>
      </div>
    </div>
  );
}