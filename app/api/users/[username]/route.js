import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const { username } = await params;
    
    // Get user data
    const users = await query(`
      SELECT id, username, name, bio, avatar_url, website, location, 
             reputation_points, social_facebook, social_twitter, social_instagram,
             created_at
      FROM users WHERE username = ?
    `, [username]);

    if (users.length === 0) {
      return NextResponse.json(
        { error: 'User tidak ditemukan' },
        { status: 404 }
      );
    }

    const user = users[0];

    // Get user stats
    const [stats] = await query(`
      SELECT 
        COUNT(DISTINCT p.id) as total_stories,
        COUNT(DISTINCT c.id) as total_comments,
        COALESCE(SUM(cl.likes_count), 0) as total_likes_received,
        COUNT(DISTINCT pc.id) as total_comments_received
      FROM users u
      LEFT JOIN posts p ON u.id = p.user_id AND p.published = true
      LEFT JOIN comments c ON u.id = c.user_id
      LEFT JOIN (
        SELECT p2.id, COALESCE(SUM(c2.likes_count), 0) as likes_count
        FROM posts p2 
        LEFT JOIN comments c2 ON p2.id = c2.post_id
        WHERE p2.published = true
        GROUP BY p2.id
      ) cl ON p.id = cl.id
      LEFT JOIN comments pc ON p.id = pc.post_id
      WHERE u.id = ?
      GROUP BY u.id
    `, [user.id]);

    // Get user achievements
    const achievements = await query(`
      SELECT achievement_type, achievement_name, achieved_at
      FROM user_achievements 
      WHERE user_id = ?
      ORDER BY achieved_at DESC
    `, [user.id]);

    return NextResponse.json({
      user: user,
      stats: stats || {
        total_stories: 0,
        total_comments: 0,
        total_likes_received: 0,
        total_comments_received: 0
      },
      achievements: achievements
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { error: 'Error mengambil data profil user' },
      { status: 500 }
    );
  }
}