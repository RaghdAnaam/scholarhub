import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getStudent, updateStudent, deleteStudent } from '../api/studentApi';
import ConfirmModal from '../components/ConfirmModal';
import '../styles/form.css';

/* ── Helpers ─────────────────────────────────────────────────── */
const COLORS = ['cyan', 'purple', 'pink', 'gold', 'green'];
const avatarColor = (name = '') => COLORS[name.charCodeAt(0) % COLORS.length];
const initials    = (name = '') =>
  name.split(' ').slice(0, 2).map(n => n[0] || '').join('').toUpperCase();

/** Returns a formatted date string or a muted dash if the value is empty */
const fmtDate = (val) =>
  val
    ? new Date(val).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : null;

/** Renders a field value or a styled empty placeholder */
const Val = ({ v }) =>
  v ? <span className="info-field-value">{v}</span>
    : <span className="info-field-value empty">—</span>;

/**
 * StudentDetail Page
 *
 * What this page does:
 * - Fetches a single student by ID (from the URL param) on mount
 * - Displays all student info in read-only sections
 * - Toggles into an edit mode where fields become inputs
 * - Saves changes via PUT /api/students/:id
 * - Opens a ConfirmModal before deleting, then redirects to /students
 */
export default function StudentDetail({ showToast }) {
  const { id }        = useParams();     // MongoDB _id from the URL
  const navigate      = useNavigate();

  const [student,       setStudent]       = useState(null);
  const [loading,       setLoading]       = useState(true);
  const [editing,       setEditing]       = useState(false);
  const [form,          setForm]          = useState({});
  const [saving,        setSaving]        = useState(false);
  const [showDelete,    setShowDelete]    = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [subjectInput,  setSubjectInput]  = useState('');

  /* ── Fetch on mount ───────────────────────────────────────── */
  useEffect(() => {
    getStudent(id)
      .then(res => {
        setStudent(res.data);
        setForm(res.data);
      })
      .catch(() => showToast('Student not found', 'error'))
      .finally(() => setLoading(false));
  }, [id]);

  /* ── Edit helpers ─────────────────────────────────────────── */
  const set = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const cancelEdit = () => {
    setForm(student);   // reset form to saved values
    setEditing(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await updateStudent(id, form);
      setStudent(res.data);   // update what we show in read-only view
      setForm(res.data);
      setEditing(false);
      showToast('Student updated successfully ✓');
    } catch (err) {
      showToast(err.response?.data?.message || 'Update failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  /* ── Subject tags ─────────────────────────────────────────── */
  const addSubject = (e) => {
    if (e.key === 'Enter' && subjectInput.trim()) {
      e.preventDefault();
      const cur = form.subjects || [];
      if (!cur.includes(subjectInput.trim())) {
        set('subjects', [...cur, subjectInput.trim()]);
      }
      setSubjectInput('');
    }
  };
  const removeSubject = (subj) =>
    set('subjects', (form.subjects || []).filter(s => s !== subj));

  /* ── Delete ───────────────────────────────────────────────── */
  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await deleteStudent(id);
      showToast(`${student.name} was deleted`);
      navigate('/students');
    } catch {
      showToast('Delete failed. Please try again.', 'error');
      setDeleteLoading(false);
      setShowDelete(false);
    }
  };

  /* ── Loading / Error states ───────────────────────────────── */
  if (loading) return (
    <div className="page">
      <div className="spinner-container"><div className="spinner" /><span>Loading student...</span></div>
    </div>
  );

  if (!student) return (
    <div className="page">
      <div className="error-state">
        <p>Student not found.</p>
        <Link to="/students" className="btn btn-primary" style={{ marginTop: 16 }}>← Back to Students</Link>
      </div>
    </div>
  );

  const color = avatarColor(student.name);
  const inits = initials(student.name);

  const statusClass =
    student.status === 'Active'    ? 'badge-active'    :
    student.status === 'Graduated' ? 'badge-graduated' : 'badge-inactive';

  /* ── Render ───────────────────────────────────────────────── */
  return (
    <div className="page detail-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-left">
          <h1>Student Profile</h1>
          <p>View and manage this student's information</p>
        </div>
        <Link to="/students" className="btn btn-ghost">← All Students</Link>
      </div>

      {/* ── Profile Header Card ─────────────────────────────── */}
      <div className="glass-card detail-header-card">
        <div className="detail-header-content">
          {/* Large initials avatar */}
          <div className={`detail-avatar avatar-${color}`}>{inits}</div>

          <div className="detail-info">
            <h2 className="detail-name">{student.name}</h2>
            <div className="detail-id">{student.studentId}</div>
            <div className="detail-meta">
              <span className={`badge ${statusClass}`}>● {student.status}</span>
              <span>Grade {student.grade}{student.section ? ` — Section ${student.section}` : ''}</span>
              {student.gpa != null && (
                <span style={{ color: 'var(--gold)' }}>⭐ GPA {Number(student.gpa).toFixed(1)}</span>
              )}
            </div>
          </div>

          {/* Edit / Save / Delete Buttons */}
          <div className="detail-actions">
            {editing ? (
              <>
                <button className="btn btn-ghost"    onClick={cancelEdit} disabled={saving}>Cancel</button>
                <button className="btn btn-primary"  onClick={handleSave} disabled={saving}>
                  {saving ? 'Saving...' : '✓ Save Changes'}
                </button>
              </>
            ) : (
              <>
                <button className="btn btn-secondary" onClick={() => setEditing(true)}>✏ Edit</button>
                <button className="btn btn-danger"    onClick={() => setShowDelete(true)}>🗑 Delete</button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Info Grid ───────────────────────────────────────── */}
      <div className="info-grid">

        {/* Personal Info */}
        <div className="glass-card info-section">
          <div className="info-section-title">👤 Personal Information</div>
          {editing ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input className="form-input" value={form.name || ''} onChange={e => set('name', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input className="form-input" type="email" value={form.email || ''} onChange={e => set('email', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input className="form-input" value={form.phone || ''} onChange={e => set('phone', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Gender</label>
                <select className="form-select" value={form.gender || ''} onChange={e => set('gender', e.target.value)}>
                  <option>Male</option><option>Female</option><option>Other</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Date of Birth</label>
                <input className="form-input" type="date"
                  value={form.dateOfBirth ? form.dateOfBirth.substring(0, 10) : ''}
                  onChange={e => set('dateOfBirth', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select className="form-select" value={form.status || 'Active'} onChange={e => set('status', e.target.value)}>
                  <option>Active</option><option>Inactive</option><option>Graduated</option>
                </select>
              </div>
            </div>
          ) : (
            <>
              <div className="info-field">
                <span className="info-field-label">Email</span>
                <Val v={student.email} />
              </div>
              <div className="info-field">
                <span className="info-field-label">Phone</span>
                <Val v={student.phone} />
              </div>
              <div className="info-field">
                <span className="info-field-label">Gender</span>
                <Val v={student.gender} />
              </div>
              <div className="info-field">
                <span className="info-field-label">Date of Birth</span>
                <Val v={fmtDate(student.dateOfBirth)} />
              </div>
              <div className="info-field">
                <span className="info-field-label">Enrollment Date</span>
                <Val v={fmtDate(student.enrollmentDate)} />
              </div>
            </>
          )}
        </div>

        {/* Academic Info */}
        <div className="glass-card info-section">
          <div className="info-section-title">📚 Academic Information</div>
          {editing ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Grade</label>
                <select className="form-select" value={form.grade || ''} onChange={e => set('grade', e.target.value)}>
                  <option>9th</option><option>10th</option><option>11th</option><option>12th</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Section</label>
                <select className="form-select" value={form.section || ''} onChange={e => set('section', e.target.value)}>
                  <option value="">—</option>
                  <option>A</option><option>B</option><option>C</option><option>D</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">GPA</label>
                <input className="form-input" type="number" step="0.1" min="0" max="4"
                  value={form.gpa ?? ''}
                  onChange={e => set('gpa', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Subjects</label>
                <div className="tags-container">
                  {(form.subjects || []).map(subj => (
                    <span key={subj} className="tag">
                      {subj}
                      <button className="tag-remove" onClick={() => removeSubject(subj)}>×</button>
                    </span>
                  ))}
                  <input
                    className="tag-input"
                    placeholder="Add subject..."
                    value={subjectInput}
                    onChange={e => setSubjectInput(e.target.value)}
                    onKeyDown={addSubject}
                  />
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="info-field">
                <span className="info-field-label">Grade</span>
                <Val v={student.grade} />
              </div>
              <div className="info-field">
                <span className="info-field-label">Section</span>
                <Val v={student.section} />
              </div>
              <div className="info-field">
                <span className="info-field-label">GPA</span>
                <Val v={student.gpa != null ? `${Number(student.gpa).toFixed(1)} / 4.0` : null} />
              </div>
              <div className="info-field">
                <span className="info-field-label">Subjects</span>
                {student.subjects?.length > 0 ? (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
                    {student.subjects.map(s => (
                      <span key={s} className="tag" style={{ cursor: 'default' }}>{s}</span>
                    ))}
                  </div>
                ) : (
                  <span className="info-field-value empty">—</span>
                )}
              </div>
            </>
          )}
        </div>

        {/* Guardian & Contact — spans both columns in edit mode */}
        <div
          className="glass-card info-section"
          style={{ gridColumn: editing ? '1 / -1' : undefined }}
        >
          <div className="info-section-title">🏠 Guardian &amp; Contact</div>
          {editing ? (
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Guardian Name</label>
                <input className="form-input" value={form.guardianName || ''} onChange={e => set('guardianName', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Guardian Phone</label>
                <input className="form-input" value={form.guardianPhone || ''} onChange={e => set('guardianPhone', e.target.value)} />
              </div>
              <div className="form-group full-width">
                <label className="form-label">Home Address</label>
                <textarea className="form-textarea" value={form.address || ''} onChange={e => set('address', e.target.value)} />
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 32px' }}>
              <div className="info-field">
                <span className="info-field-label">Guardian Name</span>
                <Val v={student.guardianName} />
              </div>
              <div className="info-field">
                <span className="info-field-label">Guardian Phone</span>
                <Val v={student.guardianPhone} />
              </div>
              <div className="info-field" style={{ gridColumn: '1 / -1' }}>
                <span className="info-field-label">Home Address</span>
                <Val v={student.address} />
              </div>
            </div>
          )}
        </div>

      </div>{/* /info-grid */}

      {/* Confirm Delete Modal */}
      {showDelete && (
        <ConfirmModal
          studentName={student.name}
          onConfirm={handleDelete}
          onCancel={() => setShowDelete(false)}
          loading={deleteLoading}
        />
      )}
    </div>
  );
}
