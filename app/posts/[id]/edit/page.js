'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EditPost({ params }) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category_id: ''
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        const { id } = await params;
        
        // Fetch post data
        const postRes = await fetch(`/api/posts/${id}`);
        if (!postRes.ok) throw new Error('Gagal mengambil data cerita');
        const postData = await postRes.json();
        
        // Fetch categories
        const catRes = await fetch('/api/categories');
        const catData = await catRes.json();
        
        setFormData({
          title: postData.title || '',
          content: postData.content || '',
          category_id: postData.category_id?.toString() || ''
        });
        setCategories(catData);
      } catch (error) {
        console.error('Error fetching data:', error);
        alert('Error loading data cerita');
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [params]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { id } = await params;
      
      // Generate slug baru dari title
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');

      // Update excerpt
      const excerpt = formData.content.substring(0, 150) + '...';

      const response = await fetch(`/api/posts/${id}`, {
        method: 'PUT',
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
        router.push(`/posts/${id}`);
      } else {
        const error = await response.json();
        alert(error.error || 'Error mengupdate cerita');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error mengupdate cerita');
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
        <div className="form-container">
          <p>Memuat data cerita...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="form-container">
        <h1>Edit Cerita</h1>
        
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
              disabled={saving}
              placeholder="Masukkan judul cerita Anda..."
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
              disabled={saving}
              placeholder="Tulis cerita Anda di sini..."
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
              disabled={saving}
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
            <button 
              type="submit" 
              className="btn" 
              disabled={saving || loading}
            >
              {saving ? 'Menyimpan...' : 'Update Cerita'}
            </button>
            
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => router.back()}
              disabled={saving}
            >
              Batal
            </button>
            
            {saving && <span style={{ color: '#666' }}>Menyimpan perubahan...</span>}
          </div>
        </form>
      </div>
    </div>
  );
}