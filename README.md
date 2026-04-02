# 🅿️ ParkSmart — Full-Stack Parking Management System

> Transformed from a CLI Python script into a production-ready web application.
> **100% free and local — no paid APIs required.**

---

## 📁 Project Structure

```
parking-system/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI entry point
│   │   ├── config.py            # Settings from .env
│   │   ├── database.py          # SQLAlchemy engine + session
│   │   ├── models/
│   │   │   └── __init__.py      # All ORM models
│   │   ├── schemas/
│   │   │   └── __init__.py      # Pydantic request/response schemas
│   │   ├── routers/
│   │   │   ├── auth.py          # /api/auth — register, login, me
│   │   │   ├── vehicles.py      # /api/vehicles — CRUD
│   │   │   ├── bookings.py      # /api/bookings — park-in/park-out/billing
│   │   │   ├── parking.py       # /api/parking — availability, smart recommendation
│   │   │   └── admin.py         # /api/admin — analytics, pricing, users
│   │   └── utils/
│   │       ├── security.py      # bcrypt + JWT helpers
│   │       └── logger.py        # Structured logger
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx              # React Router setup
│   │   ├── index.css            # Tailwind + custom classes
│   │   ├── context/
│   │   │   └── AuthContext.jsx  # Global auth state
│   │   ├── services/
│   │   │   └── api.js           # Axios API client
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── index.jsx    # Spinner, Alert, StatCard, Table, Modal…
│   │   │   │   └── Layout.jsx   # Driver sidebar layout
│   │   │   └── user/
│   │   │       └── ParkingGrid.jsx # Live slot visualization
│   │   └── pages/
│   │       ├── LoginPage.jsx
│   │       ├── RegisterPage.jsx
│   │       ├── DashboardPage.jsx
│   │       ├── BookPage.jsx
│   │       ├── MyBookingsPage.jsx
│   │       ├── VehiclesPage.jsx
│   │       ├── CheckoutPage.jsx
│   │       └── admin/
│   │           ├── AdminLayout.jsx
│   │           ├── AdminDashboard.jsx  # Charts: Bar, Line, Doughnut
│   │           ├── AdminBookings.jsx   # Live bookings (auto-refresh 30s)
│   │           ├── AdminPricing.jsx    # Edit rates per vehicle type
│   │           ├── AdminUsers.jsx      # Activate/deactivate users
│   │           └── AdminCoupons.jsx    # Enable/disable coupons
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
└── database/
    └── schema.sql               # Complete MySQL schema + seed data
```

---

## 🗄️ Database Schema

| Table                 | Purpose                                     |
|-----------------------|---------------------------------------------|
| `users`               | Drivers and admins (bcrypt passwords)       |
| `vehicles`            | Registered vehicles per user                |
| `pricing`             | Hourly rate + VIP multiplier per type       |
| `parking_slots`       | All 500 slots with type, floor, VIP flag    |
| `coupons`             | Discount codes (flat/percent)               |
| `bookings`            | Core booking record with in/out times       |
| `transactions`        | Payment record per booking                  |
| `analytics_snapshots` | Optional hourly snapshot cache              |

### Slot capacity

| Type     | Normal | VIP | Total | Floors |
|----------|--------|-----|-------|--------|
| Car      | 90     | 10  | 100   | 1–2    |
| Bike     | 230    | 20  | 250   | 1–3    |
| Bicycle  | 45     | 5   | 50    | 1      |
| EV       | 90     | 10  | 100   | 1      |
| **Total**| **455**| **45**| **500** |    |

---

## 🔌 API Endpoints

### Auth  `/api/auth`
| Method | Endpoint        | Auth | Description          |
|--------|-----------------|------|----------------------|
| POST   | `/register`     | —    | Create driver account |
| POST   | `/login`        | —    | Get JWT token        |
| GET    | `/me`           | ✓    | Current user info    |
| POST   | `/logout`       | ✓    | Client-side logout   |

### Vehicles  `/api/vehicles`
| Method | Endpoint     | Auth  | Description        |
|--------|--------------|-------|--------------------|
| GET    | `/`          | Driver| List my vehicles   |
| POST   | `/`          | Driver| Add vehicle        |
| DELETE | `/{id}`      | Driver| Remove vehicle     |

### Bookings  `/api/bookings`
| Method | Endpoint            | Auth  | Description                    |
|--------|---------------------|-------|--------------------------------|
| POST   | `/`                 | Driver| Create booking (park-in)       |
| POST   | `/checkout`         | Driver| Checkout + billing + payment   |
| GET    | `/my`               | Driver| My booking history             |
| GET    | `/active`           | Driver| My current active booking      |
| GET    | `/{id}`             | Driver| Booking detail                 |
| POST   | `/validate-coupon`  | —     | Validate a coupon code         |

### Parking  `/api/parking`
| Method | Endpoint               | Auth | Description                     |
|--------|------------------------|------|---------------------------------|
| GET    | `/availability`        | —    | Slots free/occupied per type    |
| GET    | `/slots/{vehicle_type}`| —    | List available slot codes       |
| GET    | `/recommend`           | —    | AI-style slot recommendation    |

### Admin  `/api/admin`
| Method | Endpoint                     | Auth  | Description               |
|--------|------------------------------|-------|---------------------------|
| GET    | `/users`                     | Admin | List all users            |
| PATCH  | `/users/{id}/toggle`         | Admin | Activate / deactivate     |
| GET    | `/bookings/active`           | Admin | All live bookings         |
| GET    | `/pricing`                   | Admin | View pricing config       |
| PATCH  | `/pricing/{vehicle_type}`    | Admin | Update rate               |
| GET    | `/coupons`                   | Admin | List all coupons          |
| PATCH  | `/coupons/{id}/toggle`       | Admin | Enable/disable coupon     |
| GET    | `/analytics/summary`         | Admin | Dashboard KPIs            |
| GET    | `/analytics/hourly-revenue`  | Admin | Revenue by hour (today)   |
| GET    | `/analytics/weekly-bookings` | Admin | Bookings last 7 days      |

---

## ⚙️ Local Setup — Step by Step

### Prerequisites
- Python 3.11+
- Node.js 18+
- MySQL 8.0+

---

### Step 1 — Database Setup

```bash
# Open MySQL CLI
mysql -u root -p

# Run the schema file
source /path/to/parking-system/database/schema.sql

# Verify
SHOW TABLES;
SELECT * FROM pricing;
SELECT slot_code FROM parking_slots LIMIT 5;
```

---

### Step 2 — Backend Setup

```bash
cd parking-system/backend

# Copy environment file
cp .env.example .env

# Edit .env — set your MySQL password and a strong SECRET_KEY
nano .env
```

**.env values to update:**
```
DB_PASSWORD=your_mysql_root_password
SECRET_KEY=run_this_to_generate: python -c "import secrets; print(secrets.token_hex(32))"
```

```bash
# Create virtual environment
python -m venv venv

# Activate
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the backend
uvicorn app.main:app --reload --port 8000
```

✅ Backend running at: `http://localhost:8000`
📖 Swagger docs at:    `http://localhost:8000/api/docs`

---

### Step 3 — Frontend Setup

```bash
# Open a new terminal
cd parking-system/frontend

# Install Node dependencies
npm install

# Start dev server
npm run dev
```

✅ Frontend running at: `http://localhost:5173`

---

## 🔑 Default Login Credentials

| Role  | Email                    | Password  |
|-------|--------------------------|-----------|
| Admin | admin@parksmart.local    | Admin@123 |
| Driver| Register a new account   | —         |

---

## 🧪 Testing the APIs (with Swagger UI)

1. Open `http://localhost:8000/api/docs`
2. Click **POST /api/auth/login** → enter admin credentials → copy the token
3. Click **Authorize** (top right) → paste token as `Bearer <token>`
4. Now all endpoints are accessible

**Quick test flow:**
```
1. POST /api/auth/register          → create a driver account
2. POST /api/auth/login             → get JWT token
3. POST /api/vehicles               → add a vehicle
4. GET  /api/parking/availability   → check free slots
5. GET  /api/parking/recommend?vehicle_type=car  → get recommendation
6. POST /api/bookings               → book a spot (note the PIN returned)
7. GET  /api/bookings/active        → see active booking
8. POST /api/bookings/checkout      → checkout with PIN + payment method
```

---

## 🤖 AI-Like Features (Rule-Based, No Paid APIs)

### Smart Recommendation (`GET /api/parking/recommend`)
Logic engine checks:
- Current hour → detects peak hours (8–10am, 5–8pm)
- Day of week → detects weekends
- Real-time slot availability from database
- Returns: recommended slot type, reason, estimated wait

### Peak Hour Detection
Uses stored booking `in_time` data to identify the busiest hour of the day.

### Most Popular Vehicle Type
Aggregates booking counts by vehicle type for the current month.

### Historical Analysis
Admin dashboard shows 7-day booking trends and hourly revenue patterns — all computed from your own database with no external APIs.

---

## 🔐 Security Features

| Feature              | Implementation                                  |
|----------------------|-------------------------------------------------|
| Password hashing     | bcrypt via `passlib` (12 rounds)                |
| Authentication       | JWT (HS256) via `python-jose`                   |
| SQL injection        | SQLAlchemy ORM — no raw SQL in business logic   |
| Input validation     | Pydantic v2 schemas on every endpoint           |
| Role-based access    | `require_admin` dependency on all admin routes  |
| CORS protection      | Configured in `main.py` with allowed origins    |
| Token expiry         | Configurable via `ACCESS_TOKEN_EXPIRE_MINUTES`  |

---

