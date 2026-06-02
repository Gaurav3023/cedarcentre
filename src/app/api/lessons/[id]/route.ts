import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { Lesson } from '@/models/Schemas';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const updates = await request.json();
    const updatedLesson = await Lesson.findByIdAndUpdate(params.id, updates, { new: true });
    return NextResponse.json(updatedLesson);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    await Lesson.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
