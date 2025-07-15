# 🎉 Event Management REST API

A backend REST API built with Node.js, Express, Sequelize, and PostgreSQL to manage events and user registrations.

---

## 🧾 Features

- Event creation with constraints (max 1000 capacity)
- User registration with duplicate and time-based restrictions
- Upcoming events listing with custom sort
- Event statistics: total registrations, remaining capacity, and percentage used
- Full validation and error handling

---

## 🚀 Setup Instructions

### 🛠️ Prerequisites

- Node.js & npm
- PostgreSQL
- Git





⚙️ Configure .env
env
Copy
Edit
PORT=5000
DB_NAME=eventdb
DB_USER=postgres
DB_PASS=yourpassword
DB_HOST=localhost
🧱 Create DB
In PostgreSQL CLI or GUI:

sql
Copy
Edit
CREATE DATABASE eventdb;
🧪 Run the App
bash
Copy
Edit
npx sequelize-cli db:migrate  # if using CLI
npm run dev                   # with nodemon



🔌 API Endpoints

👤 Users

➕ Create User
Copy
Edit
POST /api/users
json
Copy
Edit
{
  "name": "Alice",
  "email": "alice@example.com"
}


📅 Events
➕ Create Event
Copy
Edit
POST /api/events
json
Copy
Edit
{
  "title": "React Workshop",
  "dateTime": "2025-08-10T10:00:00Z",
  "location": "Delhi",
  "capacity": 100
}


🔍 Get Event Details
http
Copy
Edit
GET /api/events/:id


✅ Register User
http
Copy
Edit
POST /api/events/:id/register
Body:
json
Copy
Edit
{
  "userId": 1
}


❌ Cancel Registration
http
Copy
Edit
DELETE /api/events/:id/register/:userId


📆 List Upcoming Events
http
Copy
Edit
GET /api/events/upcoming


📊 Event Stats
http
Copy
Edit
GET /api/events/:id/stats


📎 Example Response: Event Stats
json
Copy
Edit
{
  "totalRegistrations": 25,
  "remainingCapacity": 75,
  "percentUsed": "25.00%"
}
🧠 Business Logic Rules
Max 1000 registrations per event

No duplicate or past-event registrations

Custom sorting for upcoming events

Proper error messages & HTTP codes

🧑‍💻 Author
Your Name










### 🔧 Setup

```bash
git clone https://github.com/dinetap-backend/event-management-api.git
cd event-management-api
npm install

