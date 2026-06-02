import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { User } from '@/models/Schemas';
import bcrypt from 'bcryptjs';
import { login } from '@/lib/auth';
import { rateLimit } from '@/lib/rateLimit';

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
  if (!rateLimit(ip, 5, 60000)) {
    return NextResponse.json({ error: 'Too many login attempts. Please try again in a minute.' }, { status: 429 });
  }

  try {
    await dbConnect();
    const { email, password } = await request.json();

    const user = await User.findOne({ email });
    
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const userData = { 
      id: user._id.toString(), 
      name: user.name, 
      email: user.email, 
      role: user.role, 
      status: user.status,
      stars: user.stars,
      educatorId: user.educatorId?.toString()
    };

    // Sign and set JWT cookie
    await login(userData);

    return NextResponse.json(userData);
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
