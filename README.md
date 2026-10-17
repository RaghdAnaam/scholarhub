🎓 ScholarHub — Student Management System
 A modern student records and management dashboard built with React, Node.js, Express, and MongoDB, featuring a unique cosmic dark theme with glassmorphism UI.

---

🌟 Key Features

- **📊 Interactive Dashboard:** Key performance metrics (Total, Active, Graduated, Inactive) with CSS-only visual grade distribution charts.
- **🔍 Real-Time Search & Filtering:** Debounced search by name, student ID, or email, with filters for grade level and academic status.
- **🔄 Grid & List Views:** Instant toggle between visual student cards and a tabular overview.
- **➕ 3-Step Enrollment Wizard:** Multi-step animated student creation with step validation, subject tagging, and auto-generated IDs (`SCH-YYYY-###`).
- **✏️ In-Place Profile Editing:** View complete student profiles and toggle inline edit mode to update GPA, contact details, or guardian info.
- **🗑️ Safe Deletion Modal:** Glassmorphism confirmation prompt to prevent accidental record removal.
- **🍞 Live Notifications:** Toast messages providing instant feedback on every action.

---

 🛠️ Tech Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React 18, Vite | UI component architecture and high-performance dev build |
| **Routing** | React Router DOM v6 | Single Page Application (SPA) client-side navigation |
| **HTTP Client** | Axios | REST API communication with Vite reverse proxy |
| **Styling** | Pure CSS3 | Custom variables, glassmorphism (`backdrop-filter`), animations |
| **Backend** | Node.js, Express.js | Modular RESTful API and JSON request pipeline |
| **Database** | MongoDB, Mongoose | Schema validation, automated counters, document storage |
| **DevOps** | Docker Compose | Local containerized database orchestration |

---

 🔌 REST API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/students/stats` | Dashboard statistics & grade breakdown |
| `GET` | `/api/students` | All students (supports `?search=`, `?grade=`, `?status=`) |
| `GET` | `/api/students/:id` | Retrieve single student by ID |
| `POST` | `/api/students` | Register new student (auto-generates `studentId`) |
| `PUT` | `/api/students/:id` | Update existing student record |
| `DELETE`| `/api/students/:id` | Permanently remove a student |

---

 🚀 Quick Setup & Local Development

 Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/scholarhub.git
cd scholarhub