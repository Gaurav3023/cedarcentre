import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { Lesson, User } from '@/models/Schemas';
import { sendEmail } from '@/lib/email';
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
    
    console.log("Creating lesson with data:", lessonData);
    const newLesson = await Lesson.create(lessonData);

    // Notify students about new content
    try {
      const educator = await User.findById(lessonData.educatorId);
      let studentQuery: any = { role: 'student' };
      
      // If selective, use IDs, otherwise notify all students assigned to this educator
      if (lessonData.assignedStudents && !lessonData.assignedStudents.includes('all')) {
        studentQuery._id = { $in: lessonData.assignedStudents };
      } else {
        studentQuery.educatorId = lessonData.educatorId;
      }

      const students = await User.find(studentQuery);
      const weekLabel = newLesson.weekNumber ? `Week ${newLesson.weekNumber}` : '';
      const releaseDate = newLesson.releaseDate ? new Date(newLesson.releaseDate) : new Date(Date.now() - 1000); 
      const isFutureRelease = newLesson.releaseDate && new Date(newLesson.releaseDate) > new Date();

      for (const student of students) {
        await createNotification({
          userId: student._id.toString(),
          title: 'New Content Posted',
          message: `Your educator has posted: ${newLesson.title}${weekLabel ? ` under ${weekLabel}` : ''}`,
          type: 'lesson',
          link: `/student`, // Link to dashboard for general notification
          scheduledAt: releaseDate
        });

        // Only send email now if it's released now or in the past
        if (!isFutureRelease) {
          await sendEmail({
            to: student.email,
            subject: `New Content Available: ${newLesson.title} ${weekLabel ? `(${weekLabel})` : ''}`,
            html: `
              <h2 style="color: #1e293b; margin-top: 0;">New Content Posted!</h2>
              <p>Hi ${student.name},</p>
              <p>Your educator, <strong>${educator?.name || 'an Educator'}</strong>, has just posted new content to the platform.</p>
              <div style="background-color: #f1f5f9; padding: 20px; border-radius: 12px; margin: 25px 0;">
                <h3 style="margin-top: 0; color: #0d9488;">${newLesson.title}</h3>
                ${newLesson.weekNumber ? `<p style="margin-bottom: 0;"><strong>${newLesson.weekTitle || `Week ${newLesson.weekNumber}`}</strong></p>` : ''}
              </div>
              <p>Log in to your dashboard to view the new material and start your journey.</p>
              <div style="text-align: center; margin: 35px 0;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/student" class="button">View New Content</a>
              </div>
              <div class="divider"></div>
              <p style="color: #64748b; font-size: 14px;">Happy learning!</p>
            `
          });
        }
      }
    } catch (emailError) {
      console.error("Error sending content notification emails:", emailError);
      // Don't fail the whole request if emails fail
    }

    return NextResponse.json(newLesson);
  } catch (error: any) {
    console.error("Lesson Creation Error:", error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
