import axios from 'axios';

/**
 * Axios instance with base URL pointing to /api
 * Vite's proxy (vite.config.js) forwards /api → http://localhost:5000
 * so we never hardcode a port here — it works in both dev and production
 */
const API = axios.create({ baseURL: '/api' });

// ─── Student API calls ─────────────────────────────────────────────────────

/** Fetch all students. Accepts an optional params object for search/filter. */
export const getStudents = (params = {}) => API.get('/students', { params });

/** Fetch dashboard statistics (totals, grade distribution, recent students). */
export const getStats = () => API.get('/students/stats');

/** Fetch a single student by MongoDB _id. */
export const getStudent = (id) => API.get(`/students/${id}`);

/** Create a new student. data should match the Student schema. */
export const createStudent = (data) => API.post('/students', data);

/** Update a student by id. data can be a partial object (only changed fields). */
export const updateStudent = (id, data) => API.put(`/students/${id}`, data);

/** Permanently delete a student by id. */
export const deleteStudent = (id) => API.delete(`/students/${id}`);
