import { query } from '@/lib/db';
import { NextResponse } from 'next/server';
import { getCurrentUserFromRequest } from '@/lib/auth';

// GET current user profile
export async function GET(request) {
  try {
    const user = await getCurrentUserFromRequest(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Silakan login untuk mengakses profil' },
        { status: 401 }
      );
    }

    const users = await query(`
      SELECT id, username, email, name, bio, avatar_url, website, location, 
             reputation_points, social_facebook, social_twitter, social_instagram,
             created_at
      FROM users WHERE id = ?
    `, [user.userId]);

    if (users.length === 0) {
      return NextResponse.json(
        { error: 'User tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({ user: users[0] });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { error: 'Error mengambil data profil' },
      { status: 500 }
    );
  }
}

// UPDATE user profile
export async function PUT(request) {
  try {
    const user = await getCurrentUserFromRequest(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Silakan login untuk mengupdate profil' },
        { status: 401 }
      );
    }

    const { name, bio, website, location, social_facebook, social_twitter, social_instagram } = await request.json();

    await query(
      `UPDATE users 
       SET name = ?, bio = ?, website = ?, location = ?, 
           social_facebook = ?, social_twitter = ?, social_instagram = ?
       WHERE id = ?`,
      [name, bio, website, location, social_facebook, social_twitter, social_instagram, user.userId]
    );

    return NextResponse.json({ message: 'Profil berhasil diupdate' });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'Error mengupdate profil' },
      { status: 500 }
    );
  }
}