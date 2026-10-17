import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createStudent } from '../api/studentApi';
import '../styles/form.css';

/* ── Step Definitions ─────────────────────────────────────────── */
const STEPS = [
  { label: 'Personal',  subtitle: 'Basic information about the student' },
  { label: 'Academic',  subtitle: 'Grade, section, subjects, and GPA'   },
  { label: 'Contact',   subtitle: 'Guardian details and home address'    },
];

/* ── Empty Form State ─────────────────────────────────────────── */
const EMPTY = {
  name: '', email: '', phone: '', gender: '', dateOfBirth: '',
  grade: '', section: '', subjects: [], gpa: '', enrollmentDate: '',
  status: 'Active', address: '', guardianName: '', guardianPhone: '',
};

/**
 * AddStudent (multi-step form)
 *
 * What this page does:
 * - Walks the user through 3 steps with a progress indicator
 * - Validates each step before allowing forward navigation
 * - On final submit, calls POST /api/students via Axios
 * - On success, shows a celebration screen with the new student's ID
 */
export default function AddStudent({ showToast }) {
  const navigate = useNavigate();

  const [step,           setStep]           = useState(0);
  const [form,           setForm]           = useState(EMPTY);
  const [errors,         setErrors]         = useState({});
  const [subjectInput,   setSubjectInput]   = useState('');
  const [loading,        setLoading]        = useState(false);
  const [createdStudent, setCreatedStudent] = useState(null);

  /* ── Field Setter ─────────────────────────────────────────── */
  const set = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    // Clear the error for this field as the user fixes it
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  /* ── Validation per step ──────────────────────────────────── */
  const validate = () => {
    const e = {};
    if (step === 0) {
      if (!form.name.trim())  e.name  = 'Full name is required';
      if (!form.email.trim()) e.email = 'Email address is required';
      else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email address';
      if (!form.gender) e.gender = 'Please select a gender';
    }
    if (step === 1) {
      if (!form.grade) e.grade = 'Please select a grade';
      if (form.gpa !== '' && (isNaN(form.gpa) || +form.gpa < 0 || +form.gpa > 4))
        e.gpa = 'GPA must be a number between 0.0 and 4.0';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const nextStep = () => { if (validate()) setStep(s => s + 1); };
  const prevStep = () => setStep(s => s - 1);

  /* ── Subject Tag Handling ─────────────────────────────────── */
  const addSubject = (e) => {
    if (e.key === 'Enter' && subjectInput.trim()) {
      e.preventDefault();
      if (!form.subjects.includes(subjectInput.trim())) {
        set('subjects', [...form.subjects, subjectInput.trim()]);
      }
      setSubjectInput('');
    }
  };
  const removeSubject = (subj) =>
    set('subjects', form.subjects.filter(s => s !== subj));

  /* ── Submit ───────────────────────────────────────────────── */
  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const payload = {
        ...form,
        gpa:            form.gpa            ? parseFloat(form.gpa)            : undefined,
        dateOfBirth:    form.dateOfBirth    || undefined,
        enrollmentDate: form.enrollmentDate || undefined,
      };
      const res = await createStudent(payload);
      setCreatedStudent(res.data);
      showToast(`${res.data.name} enrolled successfully! 🎉`);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to add student. Please try again.';
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  /* ── Success Screen ───────────────────────────────────────── */
  if (createdStudent) {
    return (
      <div className="page multistep-form-page">
        <div className="glass-card form-card success-screen">
          <div className="success-icon">✓</div>
          <h2 className="success-title">Student Enrolled!</h2>
          <p className="success-subtitle">
            <strong>{createdStudent.name}</strong> has been added to ScholarHub.
          </p>
          <div className="success-id">{createdStudent.studentId}</div>
          <div className="success-actions">
            <Link to="/students" className="btn btn-secondary">
              View All Students
            </Link>
            <button
              className="btn btn-primary"
              onClick={() => { setCreatedStudent(null); setForm(EMPTY); setStep(0); }}
            >
              + Add Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Main Form ────────────────────────────────────────────── */
  return (
    <div className="page multistep-form-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-left">
          <h1>Add Student</h1>
          <p>Enroll a new student into ScholarHub — Step {step + 1} of {STEPS.length}</p>
        </div>
        <Link to="/students" className="btn btn-ghost">← Back</Link>
      </div>

      {/* Step Progress Indicator */}
      <div className="glass-card step-progress">
        {STEPS.map((s, i) => (
          <React.Fragment key={i}>
            <div className="step-item">
              <div className={`step-circle${i < step ? ' completed' : i === step ? ' active' : ''}`}>
                {i < step ? '✓' : i + 1}
              </div>
              <div className="step-label">
                <span className="step-label-num">Step {i + 1}</span>
                <span className={`step-label-text${i === step ? ' active' : ''}`}>{s.label}</span>
              </div>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`step-connector${i < step ? ' completed' : ''}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Form Card — re-animates on each step change via the key prop */}
      <div className="glass-card form-card" key={step}>
        <h2 className="form-section-title">{STEPS[step].label} Information</h2>
        <p className="form-section-subtitle">{STEPS[step].subtitle}</p>

        {/* ── Step 1: Personal ──────────────────────────────── */}
        {step === 0 && (
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input className="form-input" placeholder="e.g. Fatima Al-Rashid"
                value={form.name} onChange={e => set('name', e.target.value)} />
              {errors.name && <span className="form-error">⚠ {errors.name}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input className="form-input" type="email" placeholder="e.g. fatima@email.com"
                value={form.email} onChange={e => set('email', e.target.value)} />
              {errors.email && <span className="form-error">⚠ {errors.email}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input className="form-input" placeholder="e.g. +966 50 000 0000"
                value={form.phone} onChange={e => set('phone', e.target.value)} />
            </div>

            <div className="form-group">
              <label className="form-label">Gender *</label>
              <select className="form-select" value={form.gender} onChange={e => set('gender', e.target.value)}>
                <option value="">Select gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
              {errors.gender && <span className="form-error">⚠ {errors.gender}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Date of Birth</label>
              <input className="form-input" type="date"
                value={form.dateOfBirth} onChange={e => set('dateOfBirth', e.target.value)} />
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-select" value={form.status} onChange={e => set('status', e.target.value)}>
                <option>Active</option>
                <option>Inactive</option>
                <option>Graduated</option>
              </select>
            </div>
          </div>
        )}

        {/* ── Step 2: Academic ──────────────────────────────── */}
        {step === 1 && (
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Grade *</label>
              <select className="form-select" value={form.grade} onChange={e => set('grade', e.target.value)}>
                <option value="">Select grade</option>
                <option>9th</option>
                <option>10th</option>
                <option>11th</option>
                <option>12th</option>
              </select>
              {errors.grade && <span className="form-error">⚠ {errors.grade}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Section</label>
              <select className="form-select" value={form.section} onChange={e => set('section', e.target.value)}>
                <option value="">Select section</option>
                <option>A</option>
                <option>B</option>
                <option>C</option>
                <option>D</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">GPA (0.0 – 4.0)</label>
              <input className="form-input" type="number" step="0.1" min="0" max="4"
                placeholder="e.g. 3.8"
                value={form.gpa} onChange={e => set('gpa', e.target.value)} />
              {errors.gpa && <span className="form-error">⚠ {errors.gpa}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Enrollment Date</label>
              <input className="form-input" type="date"
                value={form.enrollmentDate} onChange={e => set('enrollmentDate', e.target.value)} />
            </div>

            <div className="form-group full-width">
              <label className="form-label">
                Subjects{' '}
                <span style={{ color: 'var(--text-muted)', fontWeight: 400, textTransform: 'none' }}>
                  — type a subject and press Enter to add
                </span>
              </label>
              <div className="tags-container">
                {form.subjects.map(subj => (
                  <span key={subj} className="tag">
                    {subj}
                    <button className="tag-remove" onClick={() => removeSubject(subj)}>×</button>
                  </span>
                ))}
                <input
                  className="tag-input"
                  placeholder={form.subjects.length === 0 ? 'e.g. Math, Physics...' : ''}
                  value={subjectInput}
                  onChange={e => setSubjectInput(e.target.value)}
                  onKeyDown={addSubject}
                />
              </div>
            </div>
          </div>
        )}

        {/* ── Step 3: Contact ───────────────────────────────── */}
        {step === 2 && (
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Guardian Name</label>
              <input className="form-input" placeholder="e.g. Ahmad Al-Rashid"
                value={form.guardianName} onChange={e => set('guardianName', e.target.value)} />
            </div>

            <div className="form-group">
              <label className="form-label">Guardian Phone</label>
              <input className="form-input" placeholder="e.g. +966 50 000 0001"
                value={form.guardianPhone} onChange={e => set('guardianPhone', e.target.value)} />
            </div>

            <div className="form-group full-width">
              <label className="form-label">Home Address</label>
              <textarea className="form-textarea" placeholder="Full home address..."
                value={form.address} onChange={e => set('address', e.target.value)} />
            </div>
          </div>
        )}

        {/* ── Navigation Buttons ────────────────────────────── */}
        <div className="form-actions">
          {step > 0
            ? <button className="btn btn-ghost" onClick={prevStep}>← Previous</button>
            : <Link to="/students" className="btn btn-ghost">Cancel</Link>
          }

          {step < STEPS.length - 1
            ? <button className="btn btn-primary" onClick={nextStep}>Continue →</button>
            : (
              <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
                {loading ? 'Enrolling...' : '🎓 Enroll Student'}
              </button>
            )
          }
        </div>
      </div>
    </div>
  );
}
