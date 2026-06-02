import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { User } from '@/models/Schemas';

export async function GET() {
  try {
    await dbConnect();
    
    // Check if admin already exists
    const adminExists = await User.findOne({ role: 'admin' });
    
    if (adminExists) {
      return NextResponse.json({ message: 'Admin already initialized', email: adminExists.email });
    }

    // Create default master admin
    const masterAdmin = await User.create({
      name: 'System Admin',
      email: 'admin@cedar.ca',
      password: 'admin', // Please change this immediately in the dashboard!
      role: 'admin',
      status: 'approved',
      stars: 0
    });

    return NextResponse.json({ 
      message: 'Admin initialized successfully', 
      email: masterAdmin.email, 
      temp_password: 'admin' 
    });
  } catch (error) {
    return NextResponse.json({ error: 'Initialization failed' }, { status: 500 });
  }
}
