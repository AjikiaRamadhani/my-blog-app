import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { hashPassword, generateToken, setTokenCookie } from '@/lib/auth';

export async function POST(request) {
  try {
    const { username, email, password, name } = await request.json();

    if (!username || !email || !password || !name) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Cek jika username/email sudah ada
    const existingUsers = await query(
      'SELECT id FROM users WHERE username = ? OR email = ?',
      [username, email]
    );

    if (existingUsers.length > 0) {
      return NextResponse.json(
        { error: 'Username or email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Insert user baru
    const result = await query(
      'INSERT INTO users (username, email, password, name) VALUES (?, ?, ?, ?)',
      [username, email, hashedPassword, name]
    );

    // Get user data
    const users = await query('SELECT * FROM users WHERE id = ?', [result.insertId]);
    const user = users[0];

    // Generate token
    const token = generateToken(user);

    // Buat response
    const response = NextResponse.json({
      message: 'Registration successful',
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

    // Set cookie
    setTokenCookie(response, token);

    return response;
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}