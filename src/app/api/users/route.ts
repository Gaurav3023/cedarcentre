import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { User } from '@/models/Schemas';
import { sendEmail } from '@/lib/email';
import { createNotification } from '@/lib/notifications';

export async function GET() {
  try {
    await dbConnect();
    const users = await User.find({}).select('-password');
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    await dbConnect();
    const { userId, status, educatorId, addStars, readLessonId } = await request.json();
    
    if (addStars) {
      const user = await User.findByIdAndUpdate(userId, { $inc: { stars: addStars } }, { new: true });
      return NextResponse.json(user);
    }

    if (readLessonId) {
      const user = await User.findByIdAndUpdate(userId, { $addToSet: { readLessons: readLessonId } }, { new: true });
      return NextResponse.json(user);
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (educatorId) updateData.educatorId = educatorId;

    const oldUser = await User.findById(userId);
    const user = await User.findByIdAndUpdate(userId, updateData, { new: true });

    // Send approval email if status changed to approved
    if (status === 'approved' && oldUser?.status !== 'approved') {
      await createNotification({
        userId: user._id,
        title: 'Account Approved!',
        message: 'Your account has been approved. Welcome to Cedar Centre!',
        type: 'system',
        link: '/login'
      });
      
      await sendEmail({
        to: user.email,
        subject: 'Your Cedar Centre Account is Approved!',
        html: `
          <h2 style="color: #1e293b; margin-top: 0;">Great News, ${user.name}!</h2>
          <p>We are happy to inform you that your Cedar Centre account has been approved by the administrator.</p>
          <p>Your account is now ready to use. You can log in using your email and password.</p>
          <div style="text-align: center; margin: 35px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/login" class="button">Log In Now</a>
          </div>
          <div class="divider"></div>
          <p style="color: #64748b; font-size: 14px;">Welcome to our community! We look forward to supporting you on your journey.</p>
        `
      });
    }

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
