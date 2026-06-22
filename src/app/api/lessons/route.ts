import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { Lesson, User } from '@/models/Schemas';
import { sendEmailBackground } from '@/lib/email';
import { createNotification } from '@/lib/notifications';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    await dbConnect();
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    // Students only see lessons through the sync API usually, but if they use this, 
    // we should filter it. For now, keep it simple as sync handles visibility.
    const lessons = await Lesson.find({}).sort({ createdAt: -1 });
    return NextResponse.json(lessons);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const session = await getSession();
    if (!session || (session.user.role !== 'educator' && session.user.role !== 'admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const lessonData = await request.json();
    // Force educatorId to match session for educators
    if (session.user.role === 'educator') {
      lessonData.educatorId = session.user.id;
    }
    
    const newLesson = await Lesson.create(lessonData);

    const { origin } = new URL(request.url);

    // ── Fire-and-forget: notifications + emails send in background ──────────
    // We do NOT await this block — the response is returned immediately after
    // saving the lesson so the coach UI is never blocked waiting for emails.
    (async () => {
      try {
        const educator = await User.findById(lessonData.educatorId);
        let studentQuery: any = { role: 'student' };

        if (lessonData.assignedStudents && !lessonData.assignedStudents.includes('all')) {
          studentQuery._id = { $in: lessonData.assignedStudents };
        } else {
          studentQuery.educatorId = lessonData.educatorId;
        }

        const students = await User.find(studentQuery);
        const weekLabel = newLesson.weekNumber ? `Week ${newLesson.weekNumber}` : '';
        const releaseDate = newLesson.releaseDate ? new Date(newLesson.releaseDate) : new Date(Date.now() - 1000);
        const isFutureRelease = newLesson.releaseDate && new Date(newLesson.releaseDate) > new Date();
        const statusText = isFutureRelease ? "Upcoming Content Assigned!" : "New Content Posted!";
        const actionText = isFutureRelease
          ? "Log in to view your upcoming Journey Path schedule."
          : "Log in to your dashboard to view the new material and start your journey.";

        // Create all notifications in parallel
        await Promise.all(students.map(student =>
          createNotification({
            userId: student._id.toString(),
            title: 'New Content Posted',
            message: `Your educator has posted: ${newLesson.title}${weekLabel ? ` under ${weekLabel}` : ''}`,
            type: 'lesson',
            link: '/student',
            scheduledAt: releaseDate
          })
        ));

        // Send all emails in parallel
        await Promise.all(students.map(student =>
          sendEmailBackground({
            to: student.email,
            subject: `${isFutureRelease ? 'Upcoming' : 'New'} Content: ${newLesson.title}${weekLabel ? ` (${weekLabel})` : ''}`,
            html: `
              <h2 style="color: #1e293b; margin-top: 0;">${statusText}</h2>
              <p>Hi ${student.name},</p>
              <p>Your Coach, <strong>${educator?.name || 'a Coach'}</strong>, has assigned content to your path.</p>
              <div style="background-color: #f1f5f9; padding: 20px; border-radius: 12px; margin: 25px 0;">
                <h3 style="margin-top: 0; color: #0d9488;">${newLesson.title}</h3>
                ${newLesson.weekNumber ? `<p style="margin-bottom: 0;"><strong>${newLesson.weekTitle || `Week ${newLesson.weekNumber}`}</strong></p>` : ''}
                ${isFutureRelease ? `<p style="margin-top: 10px; color: #64748b; font-size: 14px;"><em>Unlocks on ${releaseDate.toLocaleDateString()}</em></p>` : ''}
              </div>
              <p>${actionText}</p>
              <div style="text-align: center; margin: 35px 0;">
                <a href="${origin}/student" class="button">View Dashboard</a>
              </div>
              <p style="color: #64748b; font-size: 14px;">Happy learning!</p>
            `
          })
        ));
      } catch (bgError) {
        console.error("Background notification error:", bgError);
      }
    })();
    // ────────────────────────────────────────────────────────────────────────

    return NextResponse.json(newLesson);
  } catch (error: any) {
    console.error("Lesson Creation Error:", error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
