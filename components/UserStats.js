export default function UserStats({ stats }) {
  const statItems = [
    { label: 'Total Cerita', value: stats.total_stories, icon: '📝' },
    { label: 'Total Komentar', value: stats.total_comments, icon: '💬' },
    { label: 'Like Diterima', value: stats.total_likes_received, icon: '❤️' },
    { label: 'Komentar Diterima', value: stats.total_comments_received, icon: '👥' }
  ];

  return (
    <div style={{
      background: 'white',
      padding: '1.5rem',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <h3 style={{ marginBottom: '1rem', color: '#2c3e50' }}>Statistik</h3>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1rem'
      }}>
        {statItems.map((item, index) => (
          <div key={index} style={{
            textAlign: 'center',
            padding: '1rem',
            background: '#f8f9fa',
            borderRadius: '8px'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
              {item.icon}
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2c3e50' }}>
              {item.value}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#666' }}>
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}