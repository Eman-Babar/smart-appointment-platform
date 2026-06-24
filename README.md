# AppointEase — Smart Appointment Platform

A full-stack AI-powered appointment booking and recommendation system built with React, Node.js, and PostgreSQL.

---

## Live Demo

> Run locally using the setup instructions below.

---

## Features

### Customer
- Register & Login with JWT authentication
- View and book available appointment slots
- Cancel appointments
- Reschedule appointments
- Receive AI-powered slot recommendations
- Submit reviews and ratings for completed appointments
- AI Assistant chatbot for instant help
- Profile management

### Admin
- Dashboard with analytics and charts
- Manage all appointments (approve / reject / complete)
- Manage services (create / edit / delete)
- View all registered users
- View all reviews and feedback

---

## 🛠 Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | React 18, Vite, Tailwind CSS      |
| Backend    | Node.js, Express.js               |
| Database   | PostgreSQL                        |
| Auth       | JWT (JSON Web Tokens), bcryptjs   |
| Charts     | Recharts                          |
| AI Chat    | OpenRouter API (Llama / Mistral)  |
| HTTP       | Axios                             |

---

## Project Structure

```
smart-appointment-platform/
├── frontend/                  # React application
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/          # ProtectedRoute
│   │   │   ├── shared/        # Navbar, Sidebar, Layout, ChatWidget
│   │   │   └── ai-chat/       # AI Chat Widget
│   │   ├── pages/             # All page components
│   │   ├── context/           # AuthContext
│   │   ├── services/          # API service functions
│   │   └── utils/             # Helper functions
│   ├── .env
│   └── package.json
│
├── backend/                   # Node.js API
│   ├── src/
│   │   ├── config/            # Database config
│   │   ├── controllers/       # Business logic
│   │   ├── middleware/        # Auth, roleCheck, errorHandler
│   │   ├── models/            # (future use)
│   │   ├── routes/            # API routes
│   │   └── server.js          # Entry point
│   ├── .env
│   └── package.json
│
├── database/
│   ├── schema.sql             # Database tables
│   └── seed.sql               # Sample data
│
└── README.md
```

---

##  Setup Instructions

### Prerequisites
- Node.js v18+
- PostgreSQL 14+
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/smart-appointment-platform.git
cd smart-appointment-platform
```

### 2. Database Setup

Open pgAdmin or psql and run:

```sql
CREATE DATABASE appointment_db;
```

Then run `database/schema.sql` in Query Tool.
Then run `database/seed.sql` for sample data.

### 3. Backend Setup

```bash
cd backend
npm install
```

Create `backend/.env` file:

```env
PORT=5000
FRONTEND_URL=http://localhost:5173

DB_HOST=localhost
DB_PORT=5432
DB_NAME=appointment_db
DB_USER=postgres
DB_PASSWORD=123

JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d

OPENROUTER_API_KEY=your_openrouter_key
```

Start backend:

```bash
npm run dev
```

### 4. Frontend Setup

```bash
cd frontend
npm install
```

Create `frontend/.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

Start frontend:

```bash
npm run dev
```

### 5. Access the App

| Service  | URL                       |
|----------|---------------------------|
| Frontend | http://localhost:5173      |
| Backend  | http://localhost:5000      |
| API      | http://localhost:5000/api  |

---

## Default Accounts

| Role     | Email                       | Password  |
|----------|-----------------------------|-----------|
| Admin    | admin@appointments.com      | admin123  |
| Customer | Register via /register page | —         |

> To make any user admin, run in pgAdmin:
> ```sql
> UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
> ```

---

## API Endpoints

### Authentication
| Method | Endpoint            | Access  | Description      |
|--------|---------------------|---------|------------------|
| POST   | /api/auth/register  | Public  | Register user    |
| POST   | /api/auth/login     | Public  | Login user       |
| GET    | /api/auth/profile   | Private | Get profile      |
| PUT    | /api/auth/profile   | Private | Update profile   |

### Appointments
| Method | Endpoint                         | Access  | Description          |
|--------|----------------------------------|---------|----------------------|
| GET    | /api/appointments/my             | Customer| My appointments      |
| GET    | /api/appointments                | Admin   | All appointments     |
| POST   | /api/appointments                | Customer| Book appointment     |
| PUT    | /api/appointments/:id/cancel     | Customer| Cancel appointment   |
| PUT    | /api/appointments/:id/approve    | Admin   | Approve appointment  |
| PUT    | /api/appointments/:id/reject     | Admin   | Reject appointment   |
| PUT    | /api/appointments/:id/complete   | Admin   | Mark as completed    |

### Services
| Method | Endpoint          | Access  | Description      |
|--------|-------------------|---------|------------------|
| GET    | /api/services     | Public  | Get all services |
| POST   | /api/services     | Admin   | Create service   |
| PUT    | /api/services/:id | Admin   | Update service   |
| DELETE | /api/services/:id | Admin   | Delete service   |

### Reviews
| Method | Endpoint                          | Access   | Description         |
|--------|-----------------------------------|----------|---------------------|
| POST   | /api/reviews                      | Customer | Submit review       |
| GET    | /api/reviews/my                   | Customer | My reviews          |
| GET    | /api/reviews/all                  | Admin    | All reviews         |
| GET    | /api/reviews/check/:appointment_id| Customer | Check if reviewed   |
| GET    | /api/reviews/service/:service_id  | Public   | Service reviews     |

### Admin
| Method | Endpoint          | Access | Description       |
|--------|-------------------|--------|-------------------|
| GET    | /api/admin/stats  | Admin  | Dashboard stats   |
| GET    | /api/admin/users  | Admin  | All users         |

### AI
| Method | Endpoint       | Access  | Description    |
|--------|----------------|---------|----------------|
| POST   | /api/ai/chat   | Private | AI Assistant   |

---

##  Database Design

### ER Diagram
![ER Diagram](docs/er-diagram.png)
### Table Descriptions

| Table | Description |
|-------|-------------|
| **users** | Stores customer and admin accounts with role-based access |
| **services** | Available appointment services with pricing and duration |
| **appointments** | Booking records linking users to services with date/time/status |
| **reviews** | User feedback and star ratings for completed appointments |
| **recommendation_history** | Tracks user preferences for AI recommendation engine |

### Relationships

- **USERS → APPOINTMENTS** — One user can book many appointments
- **SERVICES → APPOINTMENTS** — One service can have many appointments
- **APPOINTMENTS → REVIEWS** — One appointment can have one review
- **USERS → REVIEWS** — One user can write many reviews
- **USERS → RECOMMENDATION_HISTORY** — One user generates many recommendation records
- **SERVICES → RECOMMENDATION_HISTORY** — One service appears in many recommendation records

### Key Design Decisions

- **UUID** primary keys for security and scalability
- **Soft delete** on services (`is_active = false`) to preserve booking history
- **Status enum** on appointments: `pending → confirmed → completed / cancelled`
- **Unique constraint** on reviews per appointment (one review per appointment)
- **Indexes** on `user_id`, `appointment_date`, `status` for fast queries
### Tables

**users**
```sql
id, name, email, password_hash, role, phone, created_at, updated_at
```

**services**
```sql
id, name, description, duration_minutes, price, category, is_active, created_at
```

**appointments**
```sql
id, user_id (FK), service_id (FK), appointment_date, appointment_time,
status, notes, created_at, updated_at
```

**reviews**
```sql
id, user_id (FK), appointment_id (FK), rating, comment, created_at
```

**recommendation_history**
```sql
id, user_id (FK), service_id (FK), preferred_day, preferred_time, score, created_at
```

### Relationships
- User → Appointments (one to many)
- Service → Appointments (one to many)
- Appointment → Review (one to one)
- User → Recommendation History (one to many)

---

## AI & Recommendation System

### Smart Recommendation Engine
Rule-based system that analyzes user booking history:
- Tracks preferred time of day (Morning / Afternoon / Evening)
- Tracks most booked service categories
- Tracks preferred days of the week
- Score increases with each booking
- Top 3 recommendations shown on dashboard

### AI Assistant Chatbot
- Powered by OpenRouter API (free tier)
- Has access to real-time data: services, prices, user appointments
- Helps users find slots, check prices, view history
- Responds naturally to questions

---

##  Evaluation Criteria Coverage

| Area                          | Status |
|-------------------------------|--------|
| Code quality & architecture   | ✅     |
| Frontend / UI / UX            | ✅     |
| Backend / API design          | ✅     |
| Database design               | ✅     |
| AI / Recommendation system    | ✅     |
| Documentation & presentation  | ✅     |

---

##  License

MIT License — free to use and modify.