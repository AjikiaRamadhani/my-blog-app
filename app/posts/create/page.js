'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreatePost() {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category_id: '',
    slug: ''
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/posts');
      } else {
        alert('Error creating post');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error creating post');
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
        <h1>Create New Post</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="slug">Slug (URL-friendly)</label>
            <input
              type="text"
              id="slug"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="excerpt">Excerpt</label>
            <textarea
              id="excerpt"
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="content">Content</label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="category_id">Category</label>
            <select
              id="category_id"
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              required
            >
              <option value="">Select a category</option>
              <option value="1">Technology</option>
              <option value="2">Programming</option>
              <option value="3">Web Development</option>
              <option value="4">Database</option>
            </select>
          </div>

          <button type="submit" className="btn" disabled={loading}>
            {loading ? 'Creating...' : 'Create Post'}
          </button>
        </form>
      </div>
    </div>
  );
}