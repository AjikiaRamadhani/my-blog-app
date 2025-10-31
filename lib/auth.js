import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

// ✅ Gunakan environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-development-only';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export async function hashPassword(password) {
  return await bcrypt.hash(password, 12);
}

export async function verifyPassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}

export function generateToken(user) {
  if (!JWT_SECRET || JWT_SECRET === 'fallback-secret-for-development-only') {
    console.warn('⚠️  Using default JWT secret. Please set JWT_SECRET in .env.local');
  }
  
  return jwt.sign(
    { 
      userId: user.id, 
      username: user.username, 
      email: user.email,
      role: user.role,
      iat: Math.floor(Date.now() / 1000)
    },
    JWT_SECRET,
    { 
      expiresIn: JWT_EXPIRES_IN,
      issuer: 'blog-app',
      audience: 'blog-app-users'
    }
  );
}

export function verifyToken(token) {
  return new Promise((resolve, reject) => {
    if (!JWT_SECRET) {
      reject(new Error('JWT_SECRET not configured'));
      return;
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
}

export function setTokenCookie(res, token) {
  res.cookies.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  });
}

export function clearTokenCookie(res) {
  res.cookies.set('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });
}

// ✅ HANYA SATU getCurrentUser function - untuk Server Components
export async function getCurrentUser() {
  try {
    const cookieStore = await cookies(); // ✅ TAMBAH AWAIT DI SINI
    const token = cookieStore.get('token')?.value;
    
    if (!token) return null;

    const decoded = await verifyToken(token);
    return decoded;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

// ✅ Function terpisah untuk API Routes (dengan parameter request)
export async function getCurrentUserFromRequest(request) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) return null;

    const decoded = await verifyToken(token);
    return decoded;
  } catch (error) {
    console.error('Error getting current user from request:', error);
    return null;
  }
}