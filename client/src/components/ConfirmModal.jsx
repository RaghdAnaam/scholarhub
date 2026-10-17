import React from 'react';

/**
 * ConfirmModal
 * Glassmorphism modal that appears before permanently deleting a student.
 * Clicking the overlay or "Cancel" dismisses without deleting.
 * onConfirm triggers the actual DELETE API call (handled by the parent).
 */
export default function ConfirmModal({ studentName, onConfirm, onCancel, loading }) {
  return (
    <div
      className="modal-overlay"
      onClick={onCancel}  // click outside to dismiss
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="modal"
        onClick={e => e.stopPropagation()}  // prevent overlay click from firing
      >
        <div className="modal-icon">🗑️</div>

        <h2 className="modal-title" id="modal-title">Delete Student</h2>

        <p className="modal-message">
          Are you sure you want to permanently delete{' '}
          <strong style={{ color: 'var(--text-primary)' }}>{studentName}</strong>?
          <br />
          This action <em>cannot</em> be undone.
        </p>

        <div className="modal-actions">
          <button
            className="btn btn-ghost"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="btn btn-danger"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Deleting...' : '🗑 Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
