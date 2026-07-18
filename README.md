# Car Dealership Inventory System

A full-stack application for managing a car dealership's vehicle inventory, built with Django REST Framework (backend) and React (frontend) using Test-Driven Development (TDD).

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Django 6.0.7, Django REST Framework 3.17.1 |
| Frontend | React 18, Vite 6, Tailwind CSS 3 |
| Auth | djangorestframework-simplejwt (JWT) |
| Database | SQLite (dev) / PostgreSQL (prod) |
| Testing | Django TestCase, Vitest + Testing Library |

## Features

- **User Authentication** - Register, login, and JWT-based session management
- **Role-Based Access** - Standard users (buyers) and admin users (staff)
- **Vehicle CRUD** - Full create, read, update, delete operations (admin only for write)
- **Search & Filter** - Filter vehicles by make, model, category, and price range
- **Purchase Flow** - Buyers can purchase vehicles (stock decreases automatically)
- **Admin Dashboard** - Add, edit, delete vehicles, and restock inventory
- **Responsive UI** - Clean, mobile-friendly design with Tailwind CSS

## Project Structure

```
AI_Kata_Car_Dealership_inventory_System/
├── config/              # Django project settings
├── accounts/            # User model, auth endpoints
├── inventory/           # Vehicle model, CRUD, search, purchase
├── frontend/            # React SPA
│   └── src/
│       ├── components/  # Login, Register, Dashboard, VehicleCard, etc.
│       ├── context/     # AuthContext (JWT state management)
│       └── services/    # Axios API client with JWT interceptor
├── manage.py
├── requirements.txt
└── .gitignore
```

## API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register/` | Register new user | Public |
| POST | `/api/auth/login/` | Login, returns JWT | Public |
| POST | `/api/auth/token/refresh/` | Refresh access token | Public |
| GET | `/api/vehicles/` | List all vehicles | JWT |
| POST | `/api/vehicles/` | Create vehicle | Admin |
| GET | `/api/vehicles/search/` | Search/filter vehicles | JWT |
| GET | `/api/vehicles/<id>/` | Get vehicle detail | JWT |
| PUT | `/api/vehicles/<id>/` | Update vehicle | Admin |
| DELETE | `/api/vehicles/<id>/` | Delete vehicle | Admin |
| POST | `/api/vehicles/<id>/purchase/` | Purchase vehicle | JWT |
| POST | `/api/vehicles/<id>/restock/` | Restock vehicle | Admin |

## Setup & Installation

### Backend

```bash
# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate       # Windows
source venv/bin/activate    # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create admin user
python manage.py createsuperuser

# Start backend server
python manage.py runserver
```

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

The app runs at `http://localhost:5173` (frontend) and `http://localhost:8000` (API).

## Running Tests

### Backend Tests (34 tests)

```bash
python manage.py test accounts inventory
```

### Frontend Tests (28 tests)

```bash
cd frontend
npx vitest run
```

## Default Test Credentials

| Role | Username | Password |
|------|----------|----------|
| Admin (staff) | `admin` | `password123` |
| Buyer | `buyer` | `password123` |
