# Multi-Tenant Feature Flag Management System

A small SaaS-style system that lets a software provider onboard multiple organizations, and lets each organization independently manage on/off feature flags for their own users — with full data isolation between organizations.

Built as a take-home assignment for Byepo Technologies.

---

## Overview

The system has three roles, each with their own dedicated frontend application:

| Role | App | Can do |
|---|---|---|
| **Super Admin** | `superadmin-frontend` | Log in with static credentials (below), create organizations, view all organizations |
| **Org Admin** | `admin-frontend` | Sign up under an org, log in, create/enable/disable/delete feature flags — scoped to their own org only |
| **End User** | `user-frontend` | Sign up under an org, log in, check whether a specific feature is enabled for their org |

> **Super Admin demo credentials** (set in `backend/.env`, not tied to any DB record):
> ```
> Email:    super@byepo.com
> Password: changeme123
> ```

All three frontends talk to a single Node.js/Express backend with a shared MongoDB database.

---

## Tech Stack

- **Backend**: Node.js, Express, MongoDB (Mongoose), JWT, bcryptjs
- **Frontend**: React (Vite), Axios, React Router (admin app only)
- **Auth**: Fully custom — no third-party auth providers

---

## Project Structure

```
project-root/
├── backend/
│   ├── config/
│   │   └── dbConnect.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── orgController.js
│   │   └── flagController.js
│   ├── middlewares/
│   │   ├── authMiddleware.js
│   │   ├── roleMiddleware.js
│   │   └── orgScopeMiddleware.js
│   ├── models/
│   │   ├── userModel.js
│   │   ├── organizationModel.js
│   │   └── featureFlagModel.js
│   ├── .env.example
│   └── index.js
├── superadmin-frontend/
├── admin-frontend/
├── user-frontend/
└── README.md
```

---

## System Roles & Access Control

- **Super Admin** is not stored in the database. It authenticates against static credentials defined in `.env`, since the spec calls for a single system-level account rather than a tenant-scoped user.
- **Org Admin** and **End User** are both stored in the `User` collection, distinguished by a `role` field, and both are tied to exactly one `Organization` via `orgId`.
- Every feature flag is scoped to an `orgId`. A compound unique index (`orgId + featureKey`) means two different organizations can each have their own flag with the same key (e.g. both can have a `dark_mode` flag) without conflicting.
- An `orgScopeMiddleware` on the backend independently re-verifies that any flag being updated/deleted actually belongs to the requesting Org Admin's organization — this is checked server-side on every request, not just enforced by hiding UI elements.

---

## API Endpoints

### Auth
```
POST /api/auth/superadmin/login
POST /api/auth/admin/signup
POST /api/auth/user/signup
POST /api/auth/login              (shared login for OrgAdmin + EndUser)
```

### Organizations
```
GET  /api/organizations/public    (no auth — populates signup dropdowns)
POST /api/organizations           (Super Admin only)
GET  /api/organizations           (Super Admin only)
```

### Feature Flags
```
POST   /api/flags                 (Org Admin only)
GET    /api/flags                 (Org Admin only — their org's flags)
PUT    /api/flags/:id             (Org Admin only — org-scoped)
DELETE /api/flags/:id             (Org Admin only — org-scoped)
POST   /api/flags/check           (End User only)
```

---

## Setup Instructions

### Prerequisites
- Node.js and npm
- A MongoDB connection (local or Atlas)

### 1. Backend

```bash
cd backend
npm install
```

Create `backend/.env` (see `.env.example`):
```
PORT=5000
MONGODB=your_mongodb_connection_string
SECRET=your_jwt_secret
SUPERADMIN_EMAIL=super@byepo.com
SUPERADMIN_PASSWORD=changeme123
```

Run:
```bash
node index.js
```

Backend runs on `http://localhost:5000`.

### 2. Frontends

Each frontend needs its own install and its own `.env`:

```bash
cd superadmin-frontend && npm install
cd ../admin-frontend && npm install
cd ../user-frontend && npm install
```

Each frontend's `.env`:
```
VITE_API_URL=http://localhost:5000/api
```

Run each in a separate terminal:
```bash
# superadmin-frontend → runs on :5173
# admin-frontend      → runs on :5174
# user-frontend       → runs on :5175
npm run dev
```

### 3. Test the flow end to end

1. Log into `superadmin-frontend` with your `.env` credentials → create an organization.
2. Sign up in `admin-frontend` under that org → log in → create a feature flag → enable it.
3. Sign up in `user-frontend` under the same org → log in → check that flag's key → should return "enabled."

---

## Design Decisions & Trade-offs

- **No shared component library across the three frontends** — each app is fully independent per the assignment's requirement for three separate frontend applications, so some code (e.g. `axiosInstance.js` setup) is duplicated rather than shared. In a larger real-world project this would move to a shared package.
- **Context API over Redux** in `admin-frontend` — the app only tracks 2-3 pieces of shared state (token, orgId), so Context is sufficient without the overhead of Redux Toolkit boilerplate.
- **No router in `superadmin-frontend` / `user-frontend`** — both are simple enough (1-2 screens) that conditional rendering via `useState` is clearer than adding React Router for two apps that don't need it.
- **EndUser signup exists in `user-frontend`** even though it wasn't explicitly itemized in the original feature list, because there was otherwise no way to create an End User account to test the check-flag flow.
- **UI is intentionally unstyled/basic** per the assignment's explicit note that polish isn't expected — focus was on correct API design, data modeling, and role/tenant isolation.

---

## What Wasn't Implemented (Out of Scope)

- Password reset / forgot password flows
- Email verification
- Pagination on org/flag lists (fine at small scale, would need it in production)
- Rate limiting / brute-force login protection
- Automated tests

---

## Author

Aman Singh
[GitHub](https://github.com/amansingh85589) · [Portfolio](https://amansingh-3dportfolio.netlify.app)