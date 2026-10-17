import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/sidebar.css';

/* ── Inline SVG Icons ─────────────────────────────────────────
   No icon library needed — pure SVG keeps the bundle small
   and matches the exact look we want
   ────────────────────────────────────────────────────────── */
const DashboardIcon = () => (
  <svg className="nav-icon" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
  </svg>
);

const StudentsIcon = () => (
  <svg className="nav-icon" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const AddStudentIcon = () => (
  <svg className="nav-icon" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="8.5" cy="7" r="4" />
    <line x1="20" y1="8" x2="20" y2="14" />
    <line x1="17" y1="11" x2="23" y2="11" />
  </svg>
);

/**
 * Sidebar component
 * Fixed left sidebar with ScholarHub branding and navigation links.
 * NavLink automatically adds an "active" class when its route is current.
 */
export default function Sidebar() {
  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-row">
          <span className="logo-icon">🎓</span>
          <span className="logo-title">ScholarHub</span>
        </div>
        <div className="logo-subtitle">Student Management</div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <span className="nav-section-label">Main Menu</span>

        <NavLink
          to="/"
          end
          className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
        >
          <DashboardIcon />
          Dashboard
        </NavLink>

        <NavLink
          to="/students"
          className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
        >
          <StudentsIcon />
          All Students
        </NavLink>

        <NavLink
          to="/students/add"
          className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
        >
          <AddStudentIcon />
          Add Student
        </NavLink>
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="sidebar-version">
          ScholarHub <span>v1.0.0</span>
        </div>
      </div>
    </aside>
  );
}
