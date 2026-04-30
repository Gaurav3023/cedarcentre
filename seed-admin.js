const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Manually pulling from env format for standalone script
const MONGODB_URI = "mongodb+srv://gaurav30:%40Gaurav123@cluster0.eicxaqs.mongodb.net/cedar_centre?retryWrites=true&w=majority";

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

    const email = "admin@cedar.ca";
    const password = "admin";
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const existing = await User.findOne({ email });
    if (existing) {
      console.log(`User ${email} already exists. Updating to Admin and Hashing Password...`);
      await User.updateOne({ email }, { 
        password: hashedPassword,
        role: 'admin', 
        status: 'approved' 
      });
    } else {
      await User.create({
        name: 'Master Admin',
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
