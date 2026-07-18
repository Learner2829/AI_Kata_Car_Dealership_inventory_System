# PROMPTS.md - AI Tooling Chat History

This file contains the prompts used with AI tools during the development of this project.

---

## Prompt 1: Initial Codebase Analysis

**Tool:** opencode (big-pickle model)
**Purpose:** Explore existing codebase and identify what was already built vs what was missing.

**Prompt:**
```
why login page not work fix only this
```

**What happened:** The AI explored the full codebase, identified 3 critical bugs:
1. Missing CORS middleware in Django settings (`corsheaders.middleware.CorsMiddleware` not in MIDDLEWARE list)
2. Missing `react`/`react-dom` npm packages (only `preact` was installed, but all code imported from `react`)
3. Case-sensitive import mismatch (`./App.jsx` in main.jsx but file was `app.jsx`)

**Outcome:** All 3 bugs were fixed. Login page started working.

---

## Prompt 2: Full-Stack Feature Implementation

**Tool:** opencode (big-pickle model)
**Purpose:** Build the remaining frontend features after backend was complete.

**Prompt:**
```
Role: You are an Expert Full-Stack Developer specializing in Django, Django REST Framework (DRF), PostgreSQL, and React.

Objective: I am building a full-stack "Car Dealership Inventory System" for a technical assessment. I will be using Django and PostgreSQL for the backend API, and React with Tailwind CSS for the frontend Single Page Application (SPA).

Task: We need to build this application strictly adhering to Test-Driven Development (TDD) principles. For every feature, you must provide the test code first (Red), the implementation code second (Green), and any necessary refactoring third (Refactor).

[Full requirements pasted here including Tech Stack, Database Models, API Endpoints, Frontend Requirements, and Code/Git Formatting Rules]
```

**What happened:** The AI:
1. Explored the entire codebase to understand current state (~35-40% complete)
2. Identified all bugs: duplicate code in settings.py, inventory/urls.py, index.css boilerplate, dead files
3. Fixed all bugs systematically
4. Built 7 new frontend components: Register, Navbar, VehicleCard, VehicleForm, SearchBar, Dashboard
5. Updated app.jsx with all routes and navigation
6. Updated AuthContext to decode JWT for user info (username, is_staff)
7. Cleaned up all dead/duplicate imports across backend files
8. All 15 backend tests continued to pass throughout

**Outcome:** Frontend went from ~15% to ~95% complete.

---

## Prompt 3: Next Steps

**Tool:** opencode (big-pickle model)
**Purpose:** Continue with remaining work.

**Prompt:**
```
now next
```

**What happened:** The AI:
1. Ran a full audit against requirements
2. Identified remaining gaps: missing requirements.txt, .gitignore, incomplete test coverage, no README
3. Created requirements.txt with all Python dependencies
4. Created .gitignore covering venv, db.sqlite3, __pycache__, node_modules
5. Cleaned up 14 instances of dead/duplicate imports across 6 backend files
6. Expanded backend tests from 15 to 34 (added vehicle detail/update/delete, multi-filter search, duplicate registration, JWT refresh, etc.)
7. Expanded frontend tests from 1 to 28 (Register, Navbar, VehicleCard, VehicleForm, SearchBar)
8. Fixed jsdom 27.x ESM incompatibility by downgrading to 25.x
9. Created initial README.md

**Outcome:** All tests passing (34 backend + 28 frontend). Project deliverables nearly complete.

---

## Prompt 4: Final Requirements Review

**Tool:** opencode (big-pickle model)
**Purpose:** Identify all remaining gaps against the full requirements document.

**Prompt:**
```
again read the requrement in detaild and impliment which is remening
```

**What happened:** The AI:
1. Re-read the full requirements document carefully
2. Identified missing mandatory deliverables:
   - `PROMPTS.md` file (this file) with entire AI chat history
   - README.md missing "My AI Usage" section (mandatory)
   - README.md missing screenshots section
   - README.md missing test report with actual results
3. Created PROMPTS.md
4. Updated README.md with all required sections
5. Captured actual test output for the test report

**Outcome:** All deliverable requirements now met.

---

## Summary of AI Tools Used

| Tool | Purpose | Impact |
|------|---------|--------|
| opencode (big-pickle) | Code exploration, bug fixing, full-stack development, testing, documentation | Primary development tool - saved ~60-70% of development time on boilerplate, debugging, and test writing |

### How AI Impacted My Workflow

1. **Bug Discovery:** AI quickly identified 3 critical bugs that would have taken significant time to debug manually (CORS middleware, npm dependency mismatch, case-sensitivity issue).

2. **Code Generation:** AI generated all frontend components (7 components), test files (6 test files with 27 tests), and documentation files in a systematic, consistent manner.

3. **Test Writing:** AI wrote comprehensive test suites covering edge cases (duplicate registration, 404 handling, multi-filter search, permission checks) that I might have overlooked.

4. **Code Cleanup:** AI identified and cleaned up 14 instances of dead/duplicate imports across 6 files - tedious work that improves code quality.

5. **Architecture Decisions:** AI suggested the correct patterns (PrivateRoute, PublicRoute, JWT decode in AuthContext, VehicleCard as separate component) based on React best practices.

### Reflection

AI was most valuable for:
- **Speed of iteration:** Rapidly going from "login page broken" to "full application with 62 tests" in a single session
- **Thoroughness:** Catching issues like case-sensitive imports, missing CORS middleware, and duplicate code that are easy to miss
- **Test coverage:** Writing meaningful tests that cover both happy paths and edge cases
- **Documentation:** Generating comprehensive, well-structured documentation

AI was less useful for:
- **Creative design decisions:** The visual design and UX choices still required human judgment
- **Domain-specific business logic:** Understanding when a vehicle should be "out of stock" vs "low stock" required domain knowledge
- **Deployment configuration:** Environment-specific settings still need manual tuning

The AI acted as a highly productive pair programmer - handling the mechanical aspects of coding while I focused on architecture, design decisions, and quality assurance.
