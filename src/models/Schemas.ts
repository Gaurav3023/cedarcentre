import mongoose, { Schema, model, models } from 'mongoose';

// Clear cached models in development to prevent schema versioning issues
if (process.env.NODE_ENV === 'development') {
  delete (mongoose.models as any).User;
  delete (mongoose.models as any).Lesson;
  delete (mongoose.models as any).Submission;
  delete (mongoose.models as any).SupportRequest;
}

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'educator', 'admin'], default: 'student' },
  status: { type: String, enum: ['pending', 'approved'], default: 'pending' },
  stars: { type: Number, default: 0 },
  educatorId: { type: String, default: null, index: true },
  readLessons: { type: [String], default: [] },
  resetPasswordToken: { type: String, default: null },
  resetPasswordExpires: { type: Date, default: null },
}, { timestamps: true });

const LessonSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  type: { type: String, default: 'text' }, 
  educatorId: { type: String, required: true, index: true },
  assignedStudents: { type: [String], default: ['all'], index: true }, 
  releaseDate: { type: String, default: null }, 
  deadline: { type: String, default: null },
  fileUrl: { type: String, default: null },
  fileUrls: { type: [String], default: [] },
  videoUrl: { type: String, default: null },
  resourceLinks: [String],
  weekNumber: { type: Number, default: 0 },
  weekTitle: { type: String, default: "" },
}, { timestamps: true });

const SubmissionSchema = new Schema({
  lessonId: { type: String, required: true, index: true },
  studentId: { type: String, required: true, index: true },
  content: { type: String, required: true },
  links: [String],
  fileUrl: { type: String, default: null },
  fileUrls: { type: [String], default: [] },
  status: { type: String, enum: ['pending', 'reviewed'], default: 'pending', index: true },
  rewardStars: { type: Number, default: 0 },
  feedback: { type: String, default: '' },
}, { timestamps: true });

// Compound index for the most common query: "all submissions for a student"
SubmissionSchema.index({ studentId: 1, lessonId: 1 });

const SupportRequestSchema = new Schema({
  studentId: { type: String, required: true, index: true },
  educatorId: { type: String, required: true, index: true },
  message: { type: String, required: true }, 
  status: { type: String, enum: ['open', 'resolved'], default: 'open', index: true },
  studentHasUnread: { type: Boolean, default: false },
  educatorHasUnread: { type: Boolean, default: false },
  chat: [{
    senderId: String,
    senderRole: String,
    content: String,
    timestamp: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

// Support Request Management with Auto-Cleanup (TTL)
SupportRequestSchema.index({ updatedAt: 1 }, { expireAfterSeconds: 432000 });

const NotificationSchema = new Schema({
  userId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['system', 'lesson', 'submission', 'chat', 'grade'], default: 'system' },
  link: { type: String, default: null },
  read: { type: Boolean, default: false },
  scheduledAt: { type: Date, default: Date.now },
}, { timestamps: true });

// Compound index for the most common notification query
NotificationSchema.index({ userId: 1, scheduledAt: 1 });
NotificationSchema.index({ userId: 1, read: 1 });

export const User = models.User || model('User', UserSchema);
export const Lesson = models.Lesson || model('Lesson', LessonSchema);
export const Submission = models.Submission || model('Submission', SubmissionSchema);
export const SupportRequest = models.SupportRequest || model('SupportRequest', SupportRequestSchema);
export const Notification = models.Notification || model('Notification', NotificationSchema);
