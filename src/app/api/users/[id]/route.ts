import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { User, Lesson, Submission, SupportRequest } from '@/models/Schemas';

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const userId = params.id;
    const userToDelete = await User.findById(userId);
    
    if (!userToDelete) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (userToDelete.role === 'educator') {
      // Cascading delete for educator: lessons, and their submissions? 
      // Actually, let's delete lessons. Submissions for those lessons will become orphaned, so let's delete them too.
      const educatorLessons = await Lesson.find({ educatorId: userId });
      const lessonIds = educatorLessons.map(l => l._id);
      
      await Promise.all([
        Lesson.deleteMany({ educatorId: userId }),
        Submission.deleteMany({ lessonId: { $in: lessonIds } }),
        SupportRequest.deleteMany({ educatorId: userId })
      ]);
    } else if (userToDelete.role === 'student') {
      // Cascading delete for student: submissions and support requests
      await Promise.all([
        Submission.deleteMany({ studentId: userId }),
        SupportRequest.deleteMany({ studentId: userId })
      ]);
    }

    await User.findByIdAndDelete(userId);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("User Deletion Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
