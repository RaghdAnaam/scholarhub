import React from 'react';

/* ── SVG Icons ─────────────────────────────────────────────────── */
const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const GridIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);

const ListIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8"  y1="6"  x2="21" y2="6"  />
    <line x1="8"  y1="12" x2="21" y2="12" />
    <line x1="8"  y1="18" x2="21" y2="18" />
    <line x1="3"  y1="6"  x2="3.01" y2="6"  />
    <line x1="3"  y1="12" x2="3.01" y2="12" />
    <line x1="3"  y1="18" x2="3.01" y2="18" />
  </svg>
);

/**
 * SearchBar
 * Renders the search input, grade/status filter dropdowns, and grid/list toggle.
 * All state lives in the parent (Students page); this component is purely presentational.
 */
export default function SearchBar({
  search, setSearch,
  grade,  setGrade,
  status, setStatus,
  view,   setView,
}) {
  return (
    <div className="students-controls">
      {/* Search */}
      <div className="controls-left">
        <div className="search-wrapper">
          <span className="search-icon"><SearchIcon /></span>
          <input
            type="text"
            className="form-input search-input"
            placeholder="Search by name, ID or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Filters + View Toggle */}
      <div className="controls-right">
        <select
          className="filter-select"
          value={grade}
          onChange={e => setGrade(e.target.value)}
        >
          <option value="">All Grades</option>
          <option>9th</option>
          <option>10th</option>
          <option>11th</option>
          <option>12th</option>
        </select>

        <select
          className="filter-select"
          value={status}
          onChange={e => setStatus(e.target.value)}
        >
          <option value="">All Status</option>
          <option>Active</option>
          <option>Inactive</option>
          <option>Graduated</option>
        </select>

        <div className="view-toggle">
          <button
            className={`view-btn${view === 'grid' ? ' active' : ''}`}
            onClick={() => setView('grid')}
            title="Grid View"
          >
            <GridIcon />
          </button>
          <button
            className={`view-btn${view === 'list' ? ' active' : ''}`}
            onClick={() => setView('list')}
            title="List View"
          >
            <ListIcon />
          </button>
        </div>
      </div>
    </div>
  );
}
