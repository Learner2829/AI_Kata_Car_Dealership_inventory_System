# Car Dealership Inventory System

A full-stack application for managing a car dealership's vehicle inventory, built with Django REST Framework (backend) and React (frontend) using Test-Driven Development (TDD).

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Django 6.0.7, Django REST Framework 3.17.1 |
| Frontend | React 18, Vite 6, Tailwind CSS 3 |
| Auth | djangorestframework-simplejwt (JWT) |
| Database | SQLite (dev) / PostgreSQL (prod) |
| Testing | Django TestCase (34 tests), Vitest + Testing Library (28 tests) |

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
├── accounts/            # User model, auth endpoints, tests
├── inventory/           # Vehicle model, CRUD, search, purchase, tests
├── frontend/            # React SPA
│   └── src/
│       ├── components/  # Login, Register, Dashboard, VehicleCard, VehicleForm, SearchBar, Navbar
│       ├── context/     # AuthContext (JWT state management)
│       └── services/    # Axios API client with JWT interceptor
├── manage.py
├── requirements.txt
├── .gitignore
├── README.md
└── PROMPTS.md           # AI tooling chat history
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

## Screenshots

### Login Page
![Login Page](screenshots/login.png)

### Registration Page
![Registration Page](screenshots/register.png)

### Dashboard - Buyer View
![Dashboard Buyer](screenshots/dashboard-buyer.png)

### Dashboard - Admin View
![Dashboard Admin](screenshots/dashboard-admin.png)

### Search & Filter
![Search Filter](screenshots/search.png)

### Vehicle Form (Admin - Add/Edit)
![Vehicle Form](screenshots/vehicle-form.png)

## Test Report

### Backend Tests: 34/34 Passing

```
Ran 34 tests in 119.503s
OK
```

#### Test Breakdown - `accounts` app (9 tests):

| Test | Description | Result |
|------|-------------|--------|
| `test_create_standard_user` | Creating a buyer with default permissions | PASS |
| `test_create_admin_user` | Creating an admin with staff privileges | PASS |
| `test_user_str_representation` | CustomUser __str__ returns username | PASS |
| `test_user_registration` | POST /api/auth/register/ creates user | PASS |
| `test_user_login` | POST /api/auth/login/ returns JWT | PASS |
| `test_duplicate_username_registration` | Duplicate username returns 400 | PASS |
| `test_missing_fields_registration` | Missing fields returns 400 | PASS |
| `test_invalid_login_credentials` | Wrong password returns 401 | PASS |
| `test_token_refresh` | POST /api/auth/token/refresh/ returns new token | PASS |

#### Test Breakdown - `inventory` app (25 tests):

| Test | Description | Result |
|------|-------------|--------|
| `test_create_vehicle_successful` | Vehicle created with all required fields | PASS |
| `test_vehicle_string_representation` | __str__ returns "Make Model" | PASS |
| `test_vehicle_default_quantity` | Quantity defaults to zero | PASS |
| `test_get_vehicles_authenticated` | Buyer can list vehicles (200) | PASS |
| `test_get_vehicles_unauthenticated` | Unauthenticated returns 401 | PASS |
| `test_create_vehicle_admin` | Admin can create vehicle (201) | PASS |
| `test_create_vehicle_buyer_forbidden` | Buyer gets 403 on create | PASS |
| `test_retrieve_vehicle_detail` | Any user can get single vehicle | PASS |
| `test_retrieve_vehicle_not_found` | Non-existent vehicle returns 404 | PASS |
| `test_update_vehicle_admin` | Admin can update via PUT | PASS |
| `test_partial_update_vehicle_admin` | Admin can partial update via PATCH | PASS |
| `test_update_vehicle_buyer_forbidden` | Buyer gets 403 on update | PASS |
| `test_delete_vehicle_admin` | Admin can delete vehicle (204) | PASS |
| `test_delete_vehicle_buyer_forbidden` | Buyer gets 403 on delete | PASS |
| `test_search_vehicles_by_make` | Search filters by make | PASS |
| `test_search_vehicles_by_model` | Search filters by model | PASS |
| `test_search_vehicles_by_category` | Search filters by category | PASS |
| `test_search_vehicles_by_price_range` | Search filters by price range | PASS |
| `test_search_vehicles_multiple_filters` | Combined filters work | PASS |
| `test_search_no_results` | Empty list when nothing matches | PASS |
| `test_purchase_vehicle_success` | Purchase decreases stock by 1 | PASS |
| `test_purchase_out_of_stock_vehicle` | Out of stock returns 400 | PASS |
| `test_purchase_nonexistent_vehicle` | Non-existent vehicle returns 404 | PASS |
| `test_restock_vehicle_admin_success` | Admin can restock (increases by 1) | PASS |
| `test_restock_vehicle_buyer_forbidden` | Buyer gets 403 on restock | PASS |

### Frontend Tests: 28/28 Passing

```
Test Files  6 passed (6)
     Tests  28 passed (28)
```

#### Test Breakdown:

| Component | Tests | Result |
|-----------|-------|--------|
| `Login.test.jsx` | Login form renders and submits credentials | 1/1 PASS |
| `Register.test.jsx` | Form renders, validation, API submission, error display | 4/4 PASS |
| `Navbar.test.jsx` | Auth state display, admin badge, logout | 5/5 PASS |
| `VehicleCard.test.jsx` | Vehicle details, purchase button, stock status, admin controls | 7/7 PASS |
| `VehicleForm.test.jsx` | Add/edit mode, validation, form submission, cancel | 5/5 PASS |
| `SearchBar.test.jsx` | Filter inputs, search submission, clear functionality | 5/5 PASS |

## Default Test Credentials

| Role | Username | Password |
|------|----------|----------|
| Admin (staff) | `admin` | `password123` |
| Buyer | `buyer` | `password123` |

---

## My AI Usage

### Tools Used

- **opencode (big-pickle model)** - Primary AI coding assistant used throughout development

### How I Used AI

1. **Bug Discovery and Fixing:** I asked the AI to investigate why the login page wasn't working. It explored the full codebase and identified 3 critical bugs that would have taken significant time to find manually:
   - Missing CORS middleware (`corsheaders.middleware.CorsMiddleware` not in Django's MIDDLEWARE list)
   - Missing `react`/`react-dom` npm packages (only `preact` was installed but all code imported from `react`)
   - Case-sensitive import mismatch (`./App.jsx` vs actual filename `app.jsx`)

2. **Full-Stack Feature Development:** I provided the complete requirements document and asked the AI to build the remaining features. It systematically:
   - Audited the current state (~35-40% complete)
   - Built 7 frontend components (Register, Navbar, VehicleCard, VehicleForm, SearchBar, Dashboard, updated app.jsx)
   - Updated AuthContext to decode JWT tokens for user role detection
   - Cleaned up 14 instances of dead/duplicate imports across 6 backend files
   - Created all supporting files (requirements.txt, .gitignore)

3. **Test Writing:** AI generated comprehensive test suites:
   - Expanded backend tests from 15 to 34 (added vehicle detail/update/delete, multi-filter search, duplicate registration, JWT refresh, 404 handling, etc.)
   - Expanded frontend tests from 1 to 28 (Register, Navbar, VehicleCard, VehicleForm, SearchBar)
   - Fixed jsdom 27.x ESM incompatibility by identifying the root cause and downgrading

4. **Documentation:** AI generated README.md, PROMPTS.md, and all structured documentation sections.

5. **Code Cleanup:** AI identified and cleaned duplicate imports, dead code, and boilerplate comments across the entire codebase.

### Impact on Workflow

- **Speed:** Went from "login page broken" to "full application with 62 passing tests" in a single session
- **Quality:** AI caught subtle issues like case-sensitive imports, duplicate variable definitions in settings.py, and missing CORS configuration
- **Test Coverage:** AI wrote meaningful edge-case tests (duplicate registration, permission checks, 404 handling, multi-filter search) that I would have likely overlooked
- **Consistency:** All generated code follows consistent patterns, naming conventions, and Tailwind CSS styling

### Reflection

AI was most valuable as a **pair programmer** - handling mechanical code generation, bug detection, and test writing while I focused on architecture decisions, requirements analysis, and quality verification. The AI accelerated development significantly but required careful review to ensure correctness and alignment with project requirements.

The main learning was that AI excels at pattern-based tasks (component generation, test boilerplate, code cleanup) but still requires human judgment for design decisions, business logic validation, and deployment configuration.

---

*Co-authored-by: AI Assistant <AI@users.noreply.github.com>*
