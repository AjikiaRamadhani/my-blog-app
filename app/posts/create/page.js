'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CreatePost() {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category_id: ''
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Fetch categories
    async function fetchCategories() {
      try {
        const response = await fetch('/api/categories');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    }
    
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Generate slug dari title
    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    // Buat excerpt dari 150 karakter pertama content
    const excerpt = formData.content.substring(0, 150) + '...';

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          slug: slug,
          excerpt: excerpt
        }),
      });

      if (response.ok) {
        router.push('/posts');
      } else {
        alert('Error membuat cerita');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error membuat cerita');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="container">
      <div className="form-container">
        <h1>Tulis Cerita Baru</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Judul Cerita *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Masukkan judul cerita Anda..."
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="content">Isi Cerita *</label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              rows="12"
              placeholder="Tulis cerita Anda di sini..."
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="category_id">Kategori *</label>
            <select
              id="category_id"
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              required
              disabled={loading}
            >
              <option value="">Pilih kategori</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button type="submit" className="btn" disabled={loading}>
              {loading ? 'Menyimpan...' : 'Publikasikan Cerita'}
            </button>
            
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => router.back()}
              disabled={loading}
            >
              Batal
            </button>
            
            {loading && <span style={{ color: '#666' }}>Menyimpan cerita...</span>}
          </div>
        </form>
      </div>
    </div>
  );
}