import Link from 'next/link'; // ✅ TAMBAH INI
import { query } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import UserProfile from '@/components/UserProfile';

async function getUserProfile(username) {
  try {
    const users = await query(`
      SELECT id, username, name, bio, avatar_url, website, location, 
             reputation_points, social_facebook, social_twitter, social_instagram,
             created_at
      FROM users WHERE username = ?
    `, [username]);

    if (users.length === 0) {
      return null;
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

    return {
      user: user,
      stats: stats || {
        total_stories: 0,
        total_comments: 0,
        total_likes_received: 0,
        total_comments_received: 0
      },
      achievements: achievements
    };
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}

export default async function PublicProfilePage({ params }) {
  const { username } = await params;
  const profileData = await getUserProfile(username);
  const currentUser = await getCurrentUser();

  if (!profileData) {
    return (
      <div className="container">
        <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <h1>User Tidak Ditemukan</h1>
          <p>User dengan username "{username}" tidak ditemukan.</p>
          <Link href="/" className="btn" style={{ marginTop: '1rem' }}>
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  const isOwnProfile = currentUser && currentUser.username === username;

  return (
    <div className="container">
      <UserProfile 
        profileData={profileData}
        isOwnProfile={isOwnProfile}
        currentUser={currentUser}
      />
    </div>
  );
}