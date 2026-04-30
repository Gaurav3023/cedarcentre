import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { SupportRequest, User } from '@/models/Schemas';
import { sendEmail } from '@/lib/email';
import { createNotification } from '@/lib/notifications';

export async function GET() {
  try {
    await dbConnect();
    
    // Proactive cleanup of requests older than 5 days
    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
    await SupportRequest.deleteMany({ updatedAt: { $lt: fiveDaysAgo } });

    const requests = await SupportRequest.find({});
    return NextResponse.json(requests);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const data = await request.json();
    const newRequest = await SupportRequest.create({
      ...data,
      educatorHasUnread: true // New request should alert educator
    });

    // Notify educator about new support request
    try {
      const student = await User.findById(data.studentId);
      const educator = await User.findById(data.educatorId);

      if (student && educator) {
        await createNotification({
          userId: educator._id.toString(),
          title: 'New Assistance Request',
          message: `${student.name} needs help.`,
          type: 'chat',
          link: '/educator?tab=support'
        });

        await sendEmail({
          to: educator.email,
          subject: `New Assistance Request from ${student.name}`,
          html: `
            <h2 style="color: #1e293b; margin-top: 0;">New Assistance Request</h2>
            <p>Hi ${educator.name},</p>
            <p><strong>${student.name}</strong> has started a new assistance request.</p>
            <div style="background-color: #f1f5f9; padding: 20px; border-radius: 12px; margin: 25px 0; border-left: 4px solid #0d9488;">
              <p style="margin: 0; font-style: italic; color: #475569;">"${data.message}"</p>
            </div>
            <p>You can view and respond to this request in your educator dashboard.</p>
            <div style="text-align: center; margin: 35px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/educator" class="button">Respond Now</a>
            </div>
          `
        });
      }
    } catch (emailError) {
      console.error("Error sending support request notification email:", emailError);
    }

    return NextResponse.json(newRequest);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    await dbConnect();
    const { requestId, status, chatMessage, markReadFor } = await request.json();
    
    let update: any = {};
    if (status) {
      update.status = status;
      if (status === 'resolved') {
        update.studentHasUnread = false;
        update.educatorHasUnread = false;
      }
    }
    
    if (markReadFor === 'student') update.studentHasUnread = false;
    if (markReadFor === 'educator') update.educatorHasUnread = false;

    if (chatMessage) {
      const isEducator = chatMessage.senderRole === 'educator';
      if (!isEducator) update.status = 'open'; // Always reopen on student message
      
      const updated = await SupportRequest.findByIdAndUpdate(
        requestId, 
        { 
          $push: { chat: chatMessage },
          $set: { 
            studentHasUnread: isEducator,
            educatorHasUnread: !isEducator,
            ...update
          }
        }, 
        { new: true }
      );

      // Send email notification for the message
      try {
        const recipientRole = isEducator ? 'student' : 'educator';
        const recipientId = isEducator ? updated.studentId : updated.educatorId;
        const senderId = chatMessage.senderId;
        
        const recipient = await User.findById(recipientId);
        const sender = await User.findById(senderId);

        if (recipient && sender) {
          await createNotification({
            userId: recipient._id.toString(),
            title: `New Message from ${sender.name}`,
            message: chatMessage.content.length > 50 ? chatMessage.content.substring(0, 50) + '...' : chatMessage.content,
            type: 'chat',
            link: `/${recipientRole}?tab=support`
          });

          await sendEmail({
            to: recipient.email,
            subject: `New Message from ${sender.name}`,
            html: `
              <h2 style="color: #1e293b; margin-top: 0;">New Message Received</h2>
              <p>Hi ${recipient.name},</p>
              <p>You have received a new message from <strong>${sender.name}</strong> on the Cedar Centre STAIR Platform.</p>
              <div style="background-color: #f1f5f9; padding: 20px; border-radius: 12px; margin: 25px 0; border-left: 4px solid #0d9488;">
                <p style="margin: 0; font-style: italic; color: #475569;">"${chatMessage.content}"</p>
              </div>
              <p>Log in to your dashboard to reply.</p>
              <div style="text-align: center; margin: 35px 0;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/${recipientRole}" class="button">View Message</a>
              </div>
            `
          });
        }
      } catch (emailError) {
        console.error("Error sending chat notification email:", emailError);
      }

      return NextResponse.json(updated);
    }

    const updated = await SupportRequest.findByIdAndUpdate(requestId, { $set: update }, { new: true });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
