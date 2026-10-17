/**
 * Seed Script — pre-populates ScholarHub with sample students
 * Run with: npm run seed
 * This clears existing students and inserts fresh sample data
 */
require('dotenv').config();
const mongoose = require('mongoose');
const Student = require('./models/Student');

const sampleStudents = [
  {
    name: 'Fatima Al-Rashid', email: 'fatima.alrashid@scholar.hub',
    phone: '+966 50 111 2233', gender: 'Female', grade: '12th', section: 'A',
    subjects: ['Math', 'Physics', 'Chemistry'], gpa: 3.9, status: 'Active',
    guardianName: 'Ahmad Al-Rashid', guardianPhone: '+966 50 111 2234',
    address: 'Riyadh, Saudi Arabia', dateOfBirth: new Date('2007-03-15'),
  },
  {
    name: 'Omar Hassan', email: 'omar.hassan@scholar.hub',
    phone: '+966 50 222 3344', gender: 'Male', grade: '11th', section: 'B',
    subjects: ['Biology', 'Chemistry', 'English'], gpa: 3.6, status: 'Active',
    guardianName: 'Hassan Omar', guardianPhone: '+966 50 222 3345',
    address: 'Jeddah, Saudi Arabia', dateOfBirth: new Date('2007-08-22'),
  },
  {
    name: 'Layla Mahmoud', email: 'layla.mahmoud@scholar.hub',
    phone: '+966 50 333 4455', gender: 'Female', grade: '10th', section: 'A',
    subjects: ['Art', 'History', 'English', 'Math'], gpa: 3.7, status: 'Active',
    guardianName: 'Mahmoud Hassan', guardianPhone: '+966 50 333 4456',
    address: 'Dammam, Saudi Arabia', dateOfBirth: new Date('2008-11-05'),
  },
  {
    name: 'Khalid Al-Saeed', email: 'khalid.alsaeed@scholar.hub',
    phone: '+966 50 444 5566', gender: 'Male', grade: '12th', section: 'C',
    subjects: ['Computer Science', 'Math', 'Physics'], gpa: 3.8, status: 'Graduated',
    guardianName: 'Saeed Al-Saeed', guardianPhone: '+966 50 444 5567',
    address: 'Riyadh, Saudi Arabia', dateOfBirth: new Date('2006-05-18'),
  },
  {
    name: 'Nora Al-Ghamdi', email: 'nora.alghamdi@scholar.hub',
    phone: '+966 50 555 6677', gender: 'Female', grade: '9th', section: 'D',
    subjects: ['Math', 'Science', 'Arabic'], gpa: 3.4, status: 'Active',
    guardianName: 'Ghamdi Al-Ghamdi', guardianPhone: '+966 50 555 6678',
    address: 'Mecca, Saudi Arabia', dateOfBirth: new Date('2009-01-30'),
  },
  {
    name: 'Yousef Al-Otaibi', email: 'yousef.alotaibi@scholar.hub',
    phone: '+966 50 666 7788', gender: 'Male', grade: '10th', section: 'B',
    subjects: ['Physical Education', 'Math', 'Science'], gpa: 2.8, status: 'Inactive',
    guardianName: 'Otaibi Al-Otaibi', guardianPhone: '+966 50 666 7789',
    address: 'Medina, Saudi Arabia', dateOfBirth: new Date('2008-07-14'),
  },
  {
    name: 'Sara Al-Zahrani', email: 'sara.alzahrani@scholar.hub',
    phone: '+966 50 777 8899', gender: 'Female', grade: '11th', section: 'A',
    subjects: ['Literature', 'History', 'Art', 'English'], gpa: 3.95, status: 'Active',
    guardianName: 'Zahrani Al-Zahrani', guardianPhone: '+966 50 777 8890',
    address: 'Taif, Saudi Arabia', dateOfBirth: new Date('2007-12-09'),
  },
  {
    name: 'Abdulrahman Qasim', email: 'abdulrahman.qasim@scholar.hub',
    phone: '+966 50 888 9900', gender: 'Male', grade: '9th', section: 'C',
    subjects: ['Math', 'Physics', 'Computer Science'], gpa: 3.2, status: 'Active',
    guardianName: 'Qasim Abdullah', guardianPhone: '+966 50 888 9901',
    address: 'Abha, Saudi Arabia', dateOfBirth: new Date('2009-04-22'),
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    await Student.deleteMany({});
    // Also reset the counter so IDs start fresh
    await mongoose.connection.collection('counters').deleteMany({});
    console.log('🗑  Cleared existing students and ID counter');

    for (const data of sampleStudents) {
      const student = new Student(data);
      await student.save();
      console.log(`   ✓ Added ${student.studentId} — ${student.name}`);
    }

    console.log(`\n🎓 Seeded ${sampleStudents.length} students successfully!`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
}

seed();
