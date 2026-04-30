import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { User, Lesson, Submission, SupportRequest, Notification } from '@/models/Schemas';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    await dbConnect();
    const session = await getSession();
    if (!session) {
      console.log("Sync failed: No session found");
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { user } = session;
    console.log("Sync for user:", user.email, "Role:", user.role);
    const userId = user.id;
    const educatorId = user.educatorId;
    const isEducator = user.role === 'educator';
    const isAdmin = user.role === 'admin';

    // Parallel fetch with database projections to reduce data size and enforce security
    const [users, lessons, submissions, supportRequests, notifications] = await Promise.all([
      isAdmin ? User.find({}, '-password') :
      isEducator ? User.find({ $or: [{ _id: userId }, { educatorId: userId }] }, '-password') :
      User.find({ $or: [{ _id: userId }, { _id: educatorId }] }, '-password'),

      // Lessons: Students only see lessons assigned to them or 'all'
      isAdmin || isEducator ? Lesson.find({}) :
      Lesson.find({ $or: [{ assignedStudents: 'all' }, { assignedStudents: userId }] }),

      // Submissions: Students only see their own
      isAdmin || isEducator ? Submission.find({}) :
      Submission.find({ studentId: userId }),

      // Support: Only relevant requests
      SupportRequest.find(isEducator ? { educatorId: userId } : { studentId: userId }),

      // Notifications: Only for current user AND already scheduled (or no schedule set)
      Notification.find({ 
        userId, 
        $or: [
          { scheduledAt: { $lte: new Date() } },
          { scheduledAt: { $exists: false } }
        ]
      }).sort({ createdAt: -1 }).limit(20)
    ]);

    console.log(`Sync complete: ${users.length} users, ${lessons.length} lessons`);

    return NextResponse.json({
      users: users.map(u => {
        const obj = u.toObject();
        return { ...obj, id: obj._id.toString(), educatorId: obj.educatorId?.toString() };
      }),
      lessons: lessons.map(l => {
        const obj = l.toObject();
        return { ...obj, id: obj._id.toString() };
      }),
      submissions: submissions.map(s => {
        const obj = s.toObject();
        return { ...obj, id: obj._id.toString(), studentId: obj.studentId?.toString(), lessonId: obj.lessonId?.toString() };
      }),
      supportRequests: supportRequests.map(sr => {
        const obj = (sr as any).toObject ? (sr as any).toObject() : sr;
        return { ...obj, id: obj._id.toString(), studentId: obj.studentId?.toString(), educatorId: obj.educatorId?.toString() };
      }),
      notifications: notifications.map(n => {
        const obj = n.toObject();
        return { ...obj, id: obj._id.toString(), userId: obj.userId?.toString() };
      })
    });
  } catch (error) {
    console.error('Sync error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
