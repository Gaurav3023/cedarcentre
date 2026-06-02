import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { Submission, User, Lesson } from '@/models/Schemas';
import { sendEmail } from '@/lib/email';
import { createNotification } from '@/lib/notifications';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    await dbConnect();
    const session = await getSession();
    if (!session || session.user.role === 'student') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const submissions = await Submission.find({}).sort({ createdAt: -1 });
    return NextResponse.json(submissions);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const subData = await request.json();
    // Force studentId to match session for students
    if (session.user.role === 'student') {
      subData.studentId = session.user.id;
    }

    const newSubmission = await Submission.create(subData);

    // Notify educator about new submission
    try {
      const student = await User.findById(subData.studentId);
      const lesson = await Lesson.findById(subData.lessonId);
      
      if (student && student.educatorId) {
        const educator = await User.findById(student.educatorId);
        if (educator) {
          await createNotification({
            userId: educator._id.toString(),
            title: 'New Work Submission',
            message: `${student.name} submitted work for ${lesson?.title || 'a lesson'}`,
            type: 'submission',
            link: '/educator'
          });

          const weekInfo = lesson?.weekNumber ? `Week ${lesson.weekNumber}` : '';
          await sendEmail({
            to: educator.email,
            subject: `New Work Submission: ${student.name}`,
            html: `
              <h2 style="color: #1e293b; margin-top: 0;">New Work Submission</h2>
              <p>Hi ${educator.name},</p>
              <p><strong>${student.name}</strong> has just submitted work for <strong>${lesson?.title || 'a lesson'}</strong> ${weekInfo ? `(${weekInfo})` : ''}.</p>
              <div style="background-color: #f1f5f9; padding: 20px; border-radius: 12px; margin: 25px 0;">
                <p style="margin: 0;"><strong>Lesson:</strong> ${lesson?.title || 'N/A'}</p>
                <p style="margin: 5px 0 0 0;"><strong>Student:</strong> ${student.name}</p>
              </div>
              <p>You can review and grade this submission in your educator dashboard.</p>
              <div style="text-align: center; margin: 35px 0;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/educator" class="button">Review Submission</a>
              </div>
            `
          });
        }
      }
    } catch (emailError) {
      console.error("Error sending submission notification email:", emailError);
    }

    return NextResponse.json(newSubmission);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    await dbConnect();
    const session = await getSession();
    if (!session || (session.user.role !== 'educator' && session.user.role !== 'admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { submissionId, stars, feedback, studentId } = await request.json();
    
    // Find the existing submission to calculate star difference (for updates)
    const existingSubmission = await Submission.findById(submissionId);
    if (!existingSubmission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    const oldStars = existingSubmission.rewardStars || 0;
    const diff = stars - oldStars;

    // Update submission
    const updatedSubmission = await Submission.findByIdAndUpdate(
      submissionId, 
      { status: 'reviewed', rewardStars: stars, feedback: feedback || '' },
      { new: true }
    );

    // Update student's star count by the difference
    // This handles both new rewards and adjustments to previous rewards
    const targetId = studentId || existingSubmission.studentId;
    if (targetId) {
      const student = await User.findByIdAndUpdate(targetId, { $inc: { stars: diff } }, { new: true });
      
      // Notify student about graded work
      if (student) {
        const lesson = await Lesson.findById(existingSubmission.lessonId);
        await createNotification({
          userId: student._id.toString(),
          title: 'Work Graded!',
          message: `Your work for ${lesson?.title || 'your lesson'} has been reviewed and graded.`,
          type: 'grade',
          link: '/student'
        });

        try {
          await sendEmail({
            to: student.email,
            subject: 'Your Work Has Been Graded!',
            html: `
              <h2 style="color: #1e293b; margin-top: 0;">Work Graded!</h2>
              <p>Hi ${student.name},</p>
              <p>Your work for <strong>${lesson?.title || 'your lesson'}</strong> has been reviewed and graded.</p>
              <div style="background-color: #f0fdf4; border-left: 4px solid #16a34a; padding: 20px; border-radius: 0 12px 12px 0; margin: 25px 0;">
                <p style="margin: 0; font-weight: bold; color: #166534;">Reward: ${stars} Stars ⭐</p>
                ${feedback ? `<div style="margin-top: 10px; color: #1e293b;"><strong>Feedback:</strong><br/>${feedback}</div>` : ''}
              </div>
              <p>Check your dashboard to see your updated star count and feedback.</p>
              <div style="text-align: center; margin: 35px 0;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/student" class="button">View Dashboard</a>
              </div>
            `
          });
        } catch (emailError) {
          console.error("Error sending grading notification email:", emailError);
        }
      }
    }

    return NextResponse.json(updatedSubmission);
  } catch (error) {
    console.error("Submission Patch Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
