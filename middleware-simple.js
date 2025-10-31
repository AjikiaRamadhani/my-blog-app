import { NextResponse } from 'next/server';

// Simple token verification tanpa library external
function verifyTokenSimple(token) {
  try {
    // Decode base64 token (format: userId:timestamp:signature)
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
    
    // Cek expiration
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      return null;
    }
    
    return payload;
  } catch (error) {
    return null;
  }
}

export async function middleware(request) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  console.log(`Middleware: ${request.method} ${pathname}`);

  // Routes yang butuh authentication
  const protectedRoutes = [
    '/dashboard',
    '/posts/create', 
  ];
  
  // Routes auth
  const authRoutes = ['/auth/login', '/auth/register'];

  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );

  const isAuthRoute = authRoutes.includes(pathname);

  if (isProtectedRoute) {
    if (!token) {
      console.log('No token found, redirecting to login');
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Simple token check - hanya cek jika token ada
    // Verifikasi lengkap dilakukan di API routes
    if (!token || token.length < 10) {
      const response = NextResponse.redirect(new URL('/auth/login', request.url));
      response.cookies.delete('token');
      return response;
    }

    // Lanjutkan request, verifikasi lengkap di API
    return NextResponse.next();
  }

  if (isAuthRoute && token) {
    // Jika ada token, redirect ke dashboard
    // Tidak perlu verify di middleware, biarkan API yang handle
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/posts/create/:path*', 
    '/auth/login',
    '/auth/register',
  ],
};