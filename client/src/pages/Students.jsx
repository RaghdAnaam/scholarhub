import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getStudents, deleteStudent } from '../api/studentApi';
import StudentCard from '../components/StudentCard';
import SearchBar from '../components/SearchBar';
import ConfirmModal from '../components/ConfirmModal';
import '../styles/students.css';

/* ── Helpers ─────────────────────────────────────────────────── */
const COLORS = ['cyan', 'purple', 'pink', 'gold', 'green'];
const avatarColor = (name = '') => COLORS[name.charCodeAt(0) % COLORS.length];
const initials    = (name = '') =>
  name.split(' ').slice(0, 2).map(n => n[0] || '').join('').toUpperCase();

const statusClass = (s) =>
  s.status === 'Active'    ? 'badge-active'    :
  s.status === 'Graduated' ? 'badge-graduated' : 'badge-inactive';

/**
 * Students Page
 *
 * What this page does:
 * - Fetches students from GET /api/students with optional query params
 * - Debounces the search input (300ms) so we don't hit the API on every keystroke
 * - Supports real-time filter by grade and status
 * - Toggles between Grid view (cards) and List view (table)
 * - Opens a ConfirmModal before deleting, then calls DELETE /api/students/:id
 */
export default function Students({ showToast }) {
  const [students,     setStudents]     = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [search,       setSearch]       = useState('');
  const [grade,        setGrade]        = useState('');
  const [status,       setStatus]       = useState('');
  const [view,         setView]         = useState('grid');
  const [toDelete,     setToDelete]     = useState(null);   // student to confirm-delete
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch students whenever search/grade/status changes
  // useCallback gives fetchStudents a stable reference for the useEffect dep array
  const fetchStudents = useCallback(() => {
    setLoading(true);
    getStudents({ search, grade, status })
      .then(res => setStudents(res.data))
      .catch(() => showToast('Failed to load students', 'error'))
      .finally(() => setLoading(false));
  }, [search, grade, status]);

  // Debounce: wait 300ms after the last change before fetching
  useEffect(() => {
    const timer = setTimeout(fetchStudents, 300);
    return () => clearTimeout(timer);
  }, [fetchStudents]);

  // Confirmed delete: call API, remove from local state, show toast
  const handleDelete = async () => {
    if (!toDelete) return;
    setDeleteLoading(true);
    try {
      await deleteStudent(toDelete._id);
      setStudents(prev => prev.filter(s => s._id !== toDelete._id));
      showToast(`${toDelete.name} was deleted successfully`);
    } catch {
      showToast('Could not delete student. Please try again.', 'error');
    } finally {
      setDeleteLoading(false);
      setToDelete(null);
    }
  };

  return (
    <div className="page">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-left">
          <h1>All Students</h1>
          <p>Search, filter, and manage your student records</p>
        </div>
        <Link to="/students/add" className="btn btn-primary">+ Add Student</Link>
      </div>

      {/* Search + Filters + View Toggle */}
      <SearchBar
        search={search} setSearch={setSearch}
        grade={grade}   setGrade={setGrade}
        status={status} setStatus={setStatus}
        view={view}     setView={setView}
      />

      {/* Result Count */}
      {!loading && (
        <p className="students-count">
          Showing <span>{students.length}</span> student{students.length !== 1 ? 's' : ''}
        </p>
      )}

      {/* ── Loading ─────────────────────────────────────────── */}
      {loading ? (
        <div className="spinner-container">
          <div className="spinner" />
          <span>Loading students...</span>
        </div>

      /* ── Empty State ────────────────────────────────────── */
      ) : students.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🎓</div>
          <h3>No students found</h3>
          <p>
            {search || grade || status
              ? 'Try clearing your filters.'
              : 'Get started by adding your first student.'}
          </p>
          {!search && !grade && !status && (
            <Link to="/students/add" className="btn btn-primary" style={{ marginTop: 12 }}>
              + Add Student
            </Link>
          )}
        </div>

      /* ── Grid View ──────────────────────────────────────── */
      ) : view === 'grid' ? (
        <div className="students-grid">
          {students.map(s => (
            <StudentCard key={s._id} student={s} onDelete={setToDelete} />
          ))}
        </div>

      /* ── List / Table View ──────────────────────────────── */
      ) : (
        <div className="students-table-wrapper">
          <table className="students-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>ID</th>
                <th>Grade</th>
                <th>Section</th>
                <th>GPA</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map(s => (
                <tr key={s._id}>
                  {/* Student name + email */}
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div
                        className={`avatar avatar-${avatarColor(s.name)}`}
                        style={{ width: 36, height: 36, fontSize: 12 }}
                      >
                        {initials(s.name)}
                      </div>
                      <div>
                        <div className="table-student-name">{s.name}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{s.email}</div>
                      </div>
                    </div>
                  </td>
                  <td><span className="table-id">{s.studentId}</span></td>
                  <td>{s.grade}</td>
                  <td>{s.section || '—'}</td>
                  <td>{s.gpa != null ? Number(s.gpa).toFixed(1) : '—'}</td>
                  <td><span className={`badge ${statusClass(s)}`}>{s.status}</span></td>
                  <td>
                    <div className="table-actions">
                      <Link
                        to={`/students/${s._id}`}
                        className="btn btn-ghost"
                        style={{ padding: '6px 14px', fontSize: 13 }}
                      >
                        View
                      </Link>
                      <button
                        className="btn btn-danger"
                        style={{ padding: '6px 14px', fontSize: 13 }}
                        onClick={() => setToDelete(s)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {toDelete && (
        <ConfirmModal
          studentName={toDelete.name}
          onConfirm={handleDelete}
          onCancel={() => setToDelete(null)}
          loading={deleteLoading}
        />
      )}
    </div>
  );
}
