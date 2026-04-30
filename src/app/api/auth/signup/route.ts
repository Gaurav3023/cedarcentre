import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { User } from '@/models/Schemas';
import bcrypt from 'bcryptjs';
import { sendEmail } from '@/lib/email';

import { rateLimit } from '@/lib/rateLimit';

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
  if (!rateLimit(ip, 3, 300000)) { // Limit to 3 signups per 5 minutes per IP
    return NextResponse.json({ error: 'Too many signup attempts. Please try again later.' }, { status: 429 });
  }

  try {
    await dbConnect();
    const { name, email, password, role } = await request.json();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      status: role === 'admin' ? 'approved' : 'pending', // Admin auto-approved
    });

    // Send confirmation email
    if (newUser.status === 'pending') {
      await sendEmail({
        to: newUser.email,
        subject: 'Welcome to Cedar Centre - Account Pending Approval',
        html: `
          <h2 style="color: #1e293b; margin-top: 0;">Welcome, ${newUser.name}!</h2>
          <p>Thank you for signing up for the Cedar Centre STAIR Platform.</p>
          <p>Your account has been created successfully and is currently <strong>pending admin approval</strong>.</p>
          <p>You will receive another email as soon as your account is approved and ready to use. This usually takes less than 24 hours.</p>
          <div class="divider"></div>
          <p style="color: #64748b; font-size: 14px;">If you have any questions, please feel free to contact us.</p>
        `
      });
    }

    return NextResponse.json({ 
      id: newUser._id, 
      name: newUser.name, 
      email: newUser.email, 
      role: newUser.role, 
      status: newUser.status 
    });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
