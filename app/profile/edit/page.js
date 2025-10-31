'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EditProfilePage() {
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    website: '',
    location: '',
    social_facebook: '',
    social_twitter: '',
    social_instagram: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profile');
      if (response.ok) {
        const data = await response.json();
        setFormData({
          name: data.user.name || '',
          bio: data.user.bio || '',
          website: data.user.website || '',
          location: data.user.location || '',
          social_facebook: data.user.social_facebook || '',
          social_twitter: data.user.social_twitter || '',
          social_instagram: data.user.social_instagram || ''
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage('Profil berhasil diupdate!');
        setTimeout(() => {
          router.push(`/profile/${formData.name || 'user'}`);
        }, 1500);
      } else {
        const error = await response.json();
        setMessage(error.error || 'Error mengupdate profil');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('Error mengupdate profil');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return (
      <div className="container">
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p>Memuat profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="form-container">
        <h1>Edit Profil</h1>
        
        {message && (
          <div style={{
            background: message.includes('berhasil') ? '#d4edda' : '#f8d7da',
            color: message.includes('berhasil') ? '#155724' : '#721c24',
            padding: '1rem',
            borderRadius: '4px',
            marginBottom: '1rem'
          }}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Nama Lengkap</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nama lengkap Anda"
            />
          </div>

          <div className="form-group">
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows="4"
              placeholder="Ceritakan sedikit tentang diri Anda..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="website">Website</label>
            <input
              type="url"
              id="website"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://website-anda.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">Lokasi</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Kota, Negara"
            />
          </div>

          <h3 style={{ margin: '2rem 0 1rem 0', color: '#2c3e50' }}>Media Sosial</h3>

          <div className="form-group">
            <label htmlFor="social_facebook">Facebook</label>
            <input
              type="url"
              id="social_facebook"
              name="social_facebook"
              value={formData.social_facebook}
              onChange={handleChange}
              placeholder="https://facebook.com/username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="social_twitter">Twitter</label>
            <input
              type="url"
              id="social_twitter"
              name="social_twitter"
              value={formData.social_twitter}
              onChange={handleChange}
              placeholder="https://twitter.com/username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="social_instagram">Instagram</label>
            <input
              type="url"
              id="social_instagram"
              name="social_instagram"
              value={formData.social_instagram}
              onChange={handleChange}
              placeholder="https://instagram.com/username"
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button type="submit" className="btn" disabled={saving}>
              {saving ? 'Menyimpan...' : 'Update Profil'}
            </button>
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => router.back()}
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}