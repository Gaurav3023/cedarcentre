import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || 'cedar-centre-stair-super-secret-key-change-this'
);

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('4h')
    .sign(SECRET_KEY);
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, SECRET_KEY, {
    algorithms: ['HS256'],
  });
  return payload;
}

export async function login(user: any) {
  const expires = new Date(Date.now() + 4 * 60 * 60 * 1000); // 4 hours
  const session = await encrypt({ user, expires });

  // Set cookie for API routes and Middleware
  cookies().set('cedar_session', session, { 
    expires, 
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/'
  });
}

export async function logout() {
  cookies().set('cedar_session', '', { expires: new Date(0) });
}

export async function getSession() {
  const session = cookies().get('cedar_session')?.value;
  if (!session) return null;
  return await decrypt(session);
}

export async function updateSession(request: NextRequest) {
  const session = request.cookies.get('cedar_session')?.value;
  if (!session) return null;

  const parsed = await decrypt(session);
  parsed.expires = new Date(Date.now() + 4 * 60 * 60 * 1000);
  const res = NextResponse.next();
  res.cookies.set({
    name: 'cedar_session',
    value: await encrypt(parsed),
    httpOnly: true,
    expires: parsed.expires,
  });
  return res;
}
