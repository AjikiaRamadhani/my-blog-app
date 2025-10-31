import { query } from '@/lib/db';

export async function generateStaticParams() {
  try {
    const posts = await query(`
      SELECT id FROM posts WHERE published = true
    `);
    
    return posts.map((post) => ({
      id: post.id.toString(),
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}