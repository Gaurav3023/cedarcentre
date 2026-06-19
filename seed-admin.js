const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Manually pulling from env format for standalone script
const MONGODB_URI = "mongodb+srv://ccstairprogram_db_user:cedarcentre2026@cedarcentre.gma0fuf.mongodb.net/cedar_centre?retryWrites=true&w=majority";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'educator', 'admin'], default: 'student' },
  status: { type: String, enum: ['pending', 'approved'], default: 'pending' },
  stars: { type: Number, default: 0 },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function seedAdmin() {
  try {
    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected!");

    const email = "c.maxwell@cedarcentre.ca";
    const password = "Ced@r2026!!";
    const adminName = "C. Maxwell";
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Find by new email, or fall back to any existing admin account
    const existing = await User.findOne({ email }) || await User.findOne({ role: 'admin' });

    if (existing) {
      await User.updateOne({ _id: existing._id }, {
        name: adminName,
        email: email,
        password: hashedPassword,
        role: 'admin',
        status: 'approved'
      });
      console.log(`✅ Admin account updated → ${email}`);
    } else {
      await User.create({
        name: adminName,
        email: email,
        password: hashedPassword,
        role: 'admin',
        status: 'approved'
      });
      console.log(`✅ Admin account created: ${email}`);
    }

    console.log("Done!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seedAdmin();
