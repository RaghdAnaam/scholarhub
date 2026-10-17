import React from 'react';
import { Link } from 'react-router-dom';

/* ── Helpers ──────────────────────────────────────────────────── */
const COLORS = ['cyan', 'purple', 'pink', 'gold', 'green'];

/** Picks a color deterministically based on the first letter of the name */
function avatarColor(name = '') {
  return COLORS[name.charCodeAt(0) % COLORS.length];
}

/** Returns up to 2 uppercase initials from a full name */
function initials(name = '') {
  return name
    .split(' ')
    .slice(0, 2)
    .map(n => n[0] || '')
    .join('')
    .toUpperCase();
}

/**
 * StudentCard
 * Displays a student as a glassmorphism card in the grid view.
 * Clicking the card or the eye button navigates to the detail page.
 * The delete button calls onDelete (passed from the parent) which
 * opens the ConfirmModal without navigating away.
 */
export default function StudentCard({ student, onDelete }) {
  const color = avatarColor(student.name);
  const inits = initials(student.name);

  const statusClass =
    student.status === 'Active'    ? 'badge-active'    :
    student.status === 'Graduated' ? 'badge-graduated' : 'badge-inactive';

  return (
    <div className="glass-card student-card">
      {/* Clicking the main body navigates to detail page */}
      <Link to={`/students/${student._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className="student-card-header">
          <div className={`avatar avatar-${color}`}>{inits}</div>
          <div className="student-card-info">
            <div className="student-card-name">{student.name}</div>
            <div className="student-card-id">{student.studentId}</div>
          </div>
        </div>

        <div className="student-card-divider" />

        <div className="student-card-details">
          <div className="student-card-detail">
            <span className="student-card-detail-label">Grade</span>
            <span className="student-card-detail-value">{student.grade}</span>
          </div>
          <div className="student-card-detail">
            <span className="student-card-detail-label">Section</span>
            <span className="student-card-detail-value">{student.section || '—'}</span>
          </div>
          {student.gpa != null && (
            <div className="student-card-detail">
              <span className="student-card-detail-label">GPA</span>
              <span className="student-card-detail-value">{Number(student.gpa).toFixed(1)}</span>
            </div>
          )}
        </div>
      </Link>

      {/* Footer: status badge + action buttons (appear on hover via CSS) */}
      <div className="student-card-footer">
        <span className={`badge ${statusClass}`}>
          <span>●</span> {student.status}
        </span>

        <div className="student-card-actions">
          <Link
            to={`/students/${student._id}`}
            className="card-action-btn"
            title="View Details"
          >
            👁
          </Link>
          <button
            className="card-action-btn delete"
            title="Delete Student"
            onClick={(e) => {
              e.preventDefault();  // prevent link navigation
              onDelete(student);
            }}
          >
            🗑
          </button>
        </div>
      </div>
    </div>
  );
}
