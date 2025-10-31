'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EditPostPage({ params }) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category_id: '',
    slug: ''
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  // ✅ Fungsi untuk fetch data
  const fetchData = async () => {
    try {
      // Tunggu params dulu
      const { id } = await params;
      
      // Fetch post data
      const postRes = await fetch(`/api/posts/${id}`);
      if (!postRes.ok) throw new Error('Failed to fetch post');
      const postData = await postRes.json();
      
      // Fetch categories
      const catRes = await fetch('/api/categories');
      const catData = await catRes.json();
      
      setFormData({
        title: postData.title || '',
        content: postData.content || '',
        excerpt: postData.excerpt || '',
        category_id: postData.category_id?.toString() || '',
        slug: postData.slug || ''
      });
      setCategories(catData);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Error loading post data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { id } = await params;
      const response = await fetch(`/api/posts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          category_id: parseInt(formData.category_id)
        }),
      });

      if (response.ok) {
        router.push(`/posts/${id}`);
        router.refresh();
      } else {
        const error = await response.json();
        alert(error.error || 'Error updating post');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error updating post');
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
          <p>Loading post data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="form-container">
        <h1>Edit Post</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              disabled={saving}
            />
          </div>

          <div className="form-group">
            <label htmlFor="slug">Slug *</label>
            <input
              type="text"
              id="slug"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              required
              disabled={saving}
              placeholder="url-friendly-slug"
            />
          </div>

          <div className="form-group">
            <label htmlFor="excerpt">Excerpt *</label>
            <textarea
              id="excerpt"
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              required
              rows="3"
              disabled={saving}
              placeholder="Brief description of the post..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="content">Content *</label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              rows="12"
              disabled={saving}
              placeholder="Write your post content here..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="category_id">Category *</label>
            <select
              id="category_id"
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              required
              disabled={saving}
            >
              <option value="">Select a category</option>
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
              {saving ? 'Updating...' : 'Update Post'}
            </button>
            
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => router.back()}
              disabled={saving}
            >
              Cancel
            </button>
            
            {saving && <span style={{ color: '#666' }}>Saving changes...</span>}
          </div>
        </form>
      </div>
    </div>
  );
}