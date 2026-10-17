import React, { useEffect } from 'react';

const ICONS = { success: '✅', error: '❌', info: 'ℹ️' };

/**
 * Toast notification
 * Slides up from the bottom-right corner.
 * Auto-dismisses after 3 seconds (or can be manually closed).
 * The parent resets toast state via onClose.
 */
export default function Toast({ message, type = 'success', onClose }) {
  // Auto-close after 3 seconds
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);  // cleanup if component unmounts early
  }, [onClose]);

  return (
    <div className={`toast toast-${type}`} role="alert">
      <span className="toast-icon">{ICONS[type]}</span>
      <span className="toast-text">{message}</span>
      <button className="toast-close" onClick={onClose} aria-label="Dismiss">✕</button>
    </div>
  );
}
