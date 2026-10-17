import React, { useState, useCallback } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import AddStudent from './pages/AddStudent';
import StudentDetail from './pages/StudentDetail';
import Toast from './components/Toast';

/**
 * Root App component
 * - Owns the global toast notification state
 * - Renders the sidebar + page routes
 * - Passes showToast down to pages that need to trigger notifications
 */
export default function App() {
  const [toast, setToast] = useState(null);

  // useCallback ensures showToast has a stable reference
  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
  }, []);

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <Routes>
          <Route path="/"               element={<Dashboard     showToast={showToast} />} />
          <Route path="/students"       element={<Students      showToast={showToast} />} />
          <Route path="/students/add"   element={<AddStudent    showToast={showToast} />} />
          <Route path="/students/:id"   element={<StudentDetail showToast={showToast} />} />
        </Routes>
      </main>

      {/* key={toast.id} remounts Toast on each new notification so the timer resets */}
      {toast && (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
