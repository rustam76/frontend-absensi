import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  
  // Routes yang tidak perlu middleware check
  const publicRoutes = ['/auth', '/auth/login'];
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  );
  
  // Jika akses root path (/), biarkan client-side routing yang handle
  if (pathname === '/') {

    return NextResponse.next();
  }

  // Jika akses public route, izinkan
  if (isPublicRoute) {

    return NextResponse.next();
  }

  // Protected routes yang perlu token check
  const protectedRoutes = ['/admin', '/employee'];
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    // Cek token dari cookie (jika Anda set cookie juga)
    const token = req.cookies.get('token')?.value;
    
    // Jika tidak ada token di cookie, redirect ke auth
    // Client-side akan handle lebih detail dengan localStorage
    if (!token) {

      return NextResponse.redirect(new URL('/auth', req.url));
    }

    try {
      // Basic token validation
      const payload = JSON.parse(atob(token.split('.')[1]));
      const role = payload.departement?.toLowerCase();
      
      // Cek token expired
      const currentTime = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < currentTime) {

        const response = NextResponse.redirect(new URL('/auth', req.url));
        response.cookies.delete('token');
        return response;
      }

      // Basic role check - hanya untuk mencegah akses yang jelas salah
      if (pathname.startsWith('/admin') && role !== 'admin') {

        return NextResponse.redirect(new URL('/employee', req.url));
      }

      if (pathname.startsWith('/employee') && role === 'admin') {
     
        return NextResponse.redirect(new URL('/admin', req.url));
      }

    
      return NextResponse.next();

    } catch (err) {
  
      const response = NextResponse.redirect(new URL('/auth', req.url));
      response.cookies.delete('token');
      return response;
    }
  }


  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/employee/:path*',
  ],
};