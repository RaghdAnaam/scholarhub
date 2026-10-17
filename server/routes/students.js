const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// ─────────────────────────────────────────────────────────────────────────────
// IMPORTANT: /stats MUST be defined before /:id
// Otherwise Express will try to match the string "stats" as a MongoDB ObjectId
// ─────────────────────────────────────────────────────────────────────────────

// GET /api/students/stats — dashboard numbers
router.get('/stats', async (req, res, next) => {
  try {
    // Run all count queries in parallel for speed
    const [total, active, inactive, graduated, gradeData, recent] = await Promise.all([
      Student.countDocuments(),
      Student.countDocuments({ status: 'Active' }),
      Student.countDocuments({ status: 'Inactive' }),
      Student.countDocuments({ status: 'Graduated' }),
      Student.aggregate([
        { $group: { _id: '$grade', count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
      Student.find().sort({ createdAt: -1 }).limit(5).select('name studentId grade status'),
    ]);

    res.json({ total, active, inactive, graduated, gradeData, recent });
  } catch (err) {
    next(err);
  }
});

// GET /api/students — fetch all with optional search & filters
router.get('/', async (req, res, next) => {
  try {
    const { search, grade, status, gender } = req.query;
    const query = {};

    // Search across name, ID, and email (case-insensitive)
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { studentId: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    // Exact-match filters
    if (grade) query.grade = grade;
    if (status) query.status = status;
    if (gender) query.gender = gender;

    const students = await Student.find(query).sort({ createdAt: -1 });
    res.json(students);
  } catch (err) {
    next(err);
  }
});

// GET /api/students/:id — fetch a single student
router.get('/:id', async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (err) {
    next(err);
  }
});

// POST /api/students — create a new student
router.post('/', async (req, res, next) => {
  try {
    const student = new Student(req.body);
    const saved = await student.save(); // Triggers the pre-save hook for studentId
    res.status(201).json(saved);
  } catch (err) {
    // Handle duplicate email gracefully
    if (err.code === 11000) {
      return res.status(400).json({ message: 'A student with this email already exists.' });
    }
    next(err);
  }
});

// PUT /api/students/:id — update an existing student
router.put('/:id', async (req, res, next) => {
  try {
    // $set ensures only provided fields are updated (partial update)
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true } // new: return updated doc; runValidators: enforce schema rules
    );
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/students/:id — permanently remove a student
router.delete('/:id', async (req, res, next) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json({ message: `${student.name} has been deleted successfully.` });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
