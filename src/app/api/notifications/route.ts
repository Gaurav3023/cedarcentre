import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { Notification } from '@/models/Schemas';

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'UserId is required' }, { status: 400 });
    }

    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 }).limit(20);
    return NextResponse.json(notifications);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    await dbConnect();
    const { notificationId, readAll, userId } = await request.json();

    if (readAll && userId) {
      await Notification.updateMany({ userId, read: false }, { read: true });
      return NextResponse.json({ success: true });
    }

    const notification = await Notification.findByIdAndUpdate(notificationId, { read: true }, { new: true });
    return NextResponse.json(notification);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
export async function DELETE(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'UserId is required' }, { status: 400 });
    }

    await Notification.deleteMany({ userId });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
