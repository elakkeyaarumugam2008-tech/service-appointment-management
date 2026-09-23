# PS46 — Service Appointment Management System

A complete, working full-stack MVP built for a 2-hour college hackathon. Generic appointment platform supporting Salons, Repair Shops, Consultants, and other service businesses.

---

## 🛠️ Technology Stack

- **Frontend**: React, Vite, JavaScript, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose ORM) with local connection (`mongodb://localhost:27017/service_appointment_db`) and automatic fallback to `mongodb-memory-server` if local MongoDB is offline.
- **Communication**: REST APIs (JSON / CORS enabled)

---

## 📁 Project Structure

```
service-appointment-management/
│
├── frontend/                  # React + Vite + Tailwind CSS Frontend
│   ├── src/
│   │   ├── api/               # Axios API client
│   │   ├── components/        # UI components & pages
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
│
├── backend/                   # Node.js + Express + Mongoose Backend
│   ├── config/                # DB connection handler with fallback
│   ├── controllers/           # Services, Slots, Appointments, Seed
│   ├── models/                # Service, Slot, Appointment schemas
│   ├── routes/                # Express API routes
│   ├── server.js              # Server entry point
│   ├── .env
│   ├── .env.example
│   └── package.json
│
└── README.md                  # System Documentation
```

---

## 🚀 How to Run Locally

### 1. Start Backend Server
```bash
cd backend
npm install
npm start
```
*The backend runs on **http://localhost:5000** and auto-seeds initial hackathon demo data if the database is empty.*

### 2. Start Frontend App
```bash
cd frontend
npm install
npm run dev
```
*The frontend runs on **http://localhost:5173**.*

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/services` | Retrieve list of services |
| `POST` | `/api/services` | Create a new service |
| `GET` | `/api/slots` | Retrieve available slots |
| `POST` | `/api/slots` | Create a new slot |
| `POST` | `/api/appointments` | Book appointment (**Prevent Double-Booking**) |
| `GET` | `/api/appointments` | Retrieve appointments list |
| `PUT` | `/api/appointments/:id/status` | Update appointment status (`ACCEPTED`, `CANCELLED`, `COMPLETED`) |
| `POST` | `/api/seed` | Seed initial sample data |

---

## 🔒 Double-Booking Prevention Logic
When a customer attempts to book a slot:
1. Backend checks if slot exists.
2. Backend checks if `isBooked === true`.
3. Backend atomically executes `Slot.findOneAndUpdate({ _id: slotId, isBooked: false }, { isBooked: true })`.
4. If already booked, rejects with **HTTP 400 Bad Request**: `"This slot is no longer available."`.

---

## 👥 Demo User Roles
Toggle roles instantly using the top header bar:
- **CUSTOMER**: Browse services, select date & time slot, book appointment, track status.
- **PROVIDER**: Add services, create slots, view bookings, click `[Accept]`, `[Cancel]`, or `[Complete]`.
