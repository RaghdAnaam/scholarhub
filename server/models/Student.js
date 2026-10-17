const mongoose = require('mongoose');

// ─── Auto-increment counter ────────────────────────────────────────────────
// Used to generate sequential student IDs like SCH-2024-001
const counterSchema = new mongoose.Schema({ _id: String, seq: { type: Number, default: 0 } });
const Counter = mongoose.model('Counter', counterSchema);

// ─── Student Schema ────────────────────────────────────────────────────────
const studentSchema = new mongoose.Schema(
  {
    studentId: { type: String, unique: true },

    // Personal
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    phone: { type: String, trim: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: [true, 'Gender is required'] },
    dateOfBirth: { type: Date },

    // Academic
    grade: {
      type: String,
      enum: ['9th', '10th', '11th', '12th'],
      required: [true, 'Grade is required'],
    },
    section: { type: String, enum: ['A', 'B', 'C', 'D'] },
    subjects: [{ type: String, trim: true }],
    gpa: { type: Number, min: [0, 'GPA cannot be negative'], max: [4.0, 'GPA cannot exceed 4.0'] },
    enrollmentDate: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ['Active', 'Inactive', 'Graduated'],
      default: 'Active',
    },

    // Contact
    address: { type: String, trim: true },
    guardianName: { type: String, trim: true },
    guardianPhone: { type: String, trim: true },
  },
  { timestamps: true } // Adds createdAt and updatedAt automatically
);

// ─── Auto-generate studentId before first save ─────────────────────────────
studentSchema.pre('save', async function (next) {
  if (!this.isNew) return next(); // Only runs on creation, not updates
  try {
    const year = new Date().getFullYear();
    const counter = await Counter.findByIdAndUpdate(
      'studentId',
      { $inc: { seq: 1 } },
      { upsert: true, new: true }
    );
    // Format: SCH-2024-001
    this.studentId = `SCH-${year}-${String(counter.seq).padStart(3, '0')}`;
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model('Student', studentSchema);
