import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getStats } from '../api/studentApi';
import '../styles/dashboard.css';

/* ── Helpers ────────────────────────────────────────────────── */
const COLORS = ['cyan', 'purple', 'pink', 'gold', 'green'];
const avatarColor = (name = '') => COLORS[name.charCodeAt(0) % COLORS.length];
const initials    = (name = '') =>
  name.split(' ').slice(0, 2).map(n => n[0] || '').join('').toUpperCase();

const GRADE_CSS = {
  '9th': 'grade-9', '10th': 'grade-10',
  '11th': 'grade-11', '12th': 'grade-12',
};

/**
 * Dashboard
 *
 * What this page does:
 * - Calls GET /api/students/stats on mount (via Axios)
 * - Renders 4 animated stat cards (total, active, graduated, inactive)
 * - Renders a CSS-only horizontal bar chart for grade distribution
 * - Lists the 5 most recently added students
 */
export default function Dashboard({ showToast }) {
  const [stats, setStats]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStats()
      .then(res => setStats(res.data))
      .catch(() => showToast('Could not load dashboard stats', 'error'))
      .finally(() => setLoading(false));
  }, []);

  // Largest grade count — used to scale bar widths (100% = tallest bar)
  const maxCount = stats?.gradeData?.reduce((m, g) => Math.max(m, g.count), 1) ?? 1;

  return (
    <div className="page dashboard">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-left">
          <h1>Dashboard</h1>
          <p>Welcome to ScholarHub — here's an overview of your school</p>
        </div>
        <Link to="/students/add" className="btn btn-primary">+ Add Student</Link>
      </div>

      {loading ? (
        <div className="spinner-container">
          <div className="spinner" />
          <span>Loading dashboard...</span>
        </div>
      ) : (
        <>
          {/* ── Stat Cards ────────────────────────────────────── */}
          <div className="stats-grid">
            <div className="glass-card stat-card cyan">
              <div className="stat-card-top">
                <div className="stat-label">Total Students</div>
                <div className="stat-icon cyan">👨‍🎓</div>
              </div>
              <div className="stat-value">{stats?.total ?? 0}</div>
            </div>

            <div className="glass-card stat-card green">
              <div className="stat-card-top">
                <div className="stat-label">Active</div>
                <div className="stat-icon green">✅</div>
              </div>
              <div className="stat-value">{stats?.active ?? 0}</div>
            </div>

            <div className="glass-card stat-card gold">
              <div className="stat-card-top">
                <div className="stat-label">Graduated</div>
                <div className="stat-icon gold">🏆</div>
              </div>
              <div className="stat-value">{stats?.graduated ?? 0}</div>
            </div>

            <div className="glass-card stat-card purple">
              <div className="stat-card-top">
                <div className="stat-label">Inactive</div>
                <div className="stat-icon purple">⏸️</div>
              </div>
              <div className="stat-value">{stats?.inactive ?? 0}</div>
            </div>
          </div>

          {/* ── Two-column Grid ───────────────────────────────── */}
          <div className="dashboard-grid">
            {/* Grade Distribution — CSS bar chart */}
            <div className="glass-card chart-section">
              <div className="section-title">📊 Grade Distribution</div>
              {stats?.gradeData?.length > 0 ? (
                <div className="grade-bars">
                  {stats.gradeData.map(g => (
                    <div className="grade-bar-item" key={g._id}>
                      <div className="grade-bar-header">
                        <span className="grade-bar-label">Grade {g._id}</span>
                        <span className="grade-bar-count">{g.count} student{g.count !== 1 ? 's' : ''}</span>
                      </div>
                      <div className="grade-bar-track">
                        <div
                          className={`grade-bar-fill ${GRADE_CSS[g._id] || 'grade-9'}`}
                          style={{ width: `${(g.count / maxCount) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
                  No data yet.{' '}
                  <Link to="/students/add" style={{ color: 'var(--cyan)' }}>Add students</Link>{' '}
                  to see grade distribution.
                </p>
              )}
            </div>

            {/* Recent Enrollments */}
            <div className="glass-card recent-section">
              <div className="section-title">🕐 Recent Enrollments</div>
              {stats?.recent?.length > 0 ? (
                <div className="recent-list">
                  {stats.recent.map(s => (
                    <Link key={s._id} to={`/students/${s._id}`} className="recent-student-item">
                      <div className={`avatar avatar-${avatarColor(s.name)}`}>
                        {initials(s.name)}
                      </div>
                      <div className="recent-student-info">
                        <div className="recent-student-name">{s.name}</div>
                        <div className="recent-student-id">{s.studentId}</div>
                      </div>
                      <span className="recent-student-grade">Grade {s.grade}</span>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="empty-state" style={{ padding: '40px 20px' }}>
                  <div className="empty-icon">📋</div>
                  <p>No students yet.</p>
                  <Link to="/students/add" className="btn btn-primary" style={{ marginTop: 8 }}>
                    + Add Student
                  </Link>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
