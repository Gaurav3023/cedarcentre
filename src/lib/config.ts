import { headers } from 'next/headers';

export const getAppUrl = () => {
  // Use headers to dynamically get the host (works in API routes and Server Components)
  try {
    const headersList = headers();
    const host = headersList.get('host');
    if (host) {
      const protocol = host.includes('localhost') || host.includes('127.0.0.1') ? 'http' : 'https';
      return `${protocol}://${host}`;
    }
  } catch (e) {
    // Fallback if headers() is called outside of a request context
    console.warn('getAppUrl called outside of request context, falling back to environment variables');
  }

  // If the user has explicitly set the APP_URL, use it as fallback
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, '');
  }
  
  // Vercel project production URL
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }

  // Vercel deployment URL
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // Ultimate fallback
  return 'http://localhost:3000';
};
