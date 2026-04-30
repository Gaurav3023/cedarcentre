import dbConnect from '@/lib/dbConnect';
import { Notification } from '@/models/Schemas';

export async function createNotification({ userId, title, message, type, link, scheduledAt }: {
  userId: string;
  title: string;
  message: string;
  type: 'system' | 'lesson' | 'submission' | 'chat' | 'grade';
  link?: string;
  scheduledAt?: Date;
}) {
  try {
    await dbConnect();
    await Notification.create({
      userId,
      title,
      message,
      type,
      link,
      scheduledAt: scheduledAt || new Date()
    });
  } catch (error) {
    console.error("Failed to create notification:", error);
  }
}
