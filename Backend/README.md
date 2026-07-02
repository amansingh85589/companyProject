# Backend — Multi-Tenant Feature Flag API

Node.js/Express backend powering the Multi-Tenant Feature Flag Management System. Handles authentication, role-based access control, and org-scoped feature flag data for all three frontend apps.

> Part of a larger project — see the [root README](../README.md) for the full system overview and how this fits with the three frontend apps.

---

## Tech Stack

- Node.js + Express
- MongoDB + Mongoose
- JWT for authentication
- bcryptjs for password hashing
- dotenv for environment config

---

## Folder Structure

```
backend/
├── config/
│   └── dbConnect.js         # Mongoose connection setup
├── controllers/
│   ├── authController.js    # All JWT-issuing logic: login/signup for all 3 roles
│   ├── orgController.js     # Super Admin: create/list organizations
│   └── flagController.js    # Org Admin: flag CRUD | End User: check-flag
├── middlewares/
│   ├── authMiddleware.js    # Verifies JWT, attaches req.user
│   ├── roleMiddleware.js    # Restricts routes by role
│   └── orgScopeMiddleware.js # Confirms a flag belongs to req.user's org
├── models/
│   ├── userModel.js
│   ├── organizationModel.js
│   └── featureFlagModel.js
├── routes/
│   ├── authRoutes.js
│   ├── orgRoutes.js
│   └── flagRoutes.js
├── .env.example
└── index.js                  # Entry point — wires everything together
```

---

## Setup

```bash
npm install
```

Copy `.env.example` to `.env` and fill in real values:

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

Server starts on `http://localhost:5000`.

---

## API Reference

### Auth — `/api/auth`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/superadmin/login` | Public | Static credential check, returns Super Admin JWT |
| POST | `/admin/signup` | Public | Creates an Org Admin under a given `orgId` |
| POST | `/user/signup` | Public | Creates an End User under a given `orgId` |
| POST | `/login` | Public | Shared login for Org Admin + End User, role read from DB |

### Organizations — `/api/organizations`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/public` | Public | Minimal org list (`_id`, `name`) — populates signup dropdowns |
| POST | `/` | Super Admin | Create a new organization |
| GET | `/` | Super Admin | List all organizations |

### Feature Flags — `/api/flags`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/` | Org Admin | Create a flag, scoped to caller's org |
| GET | `/` | Org Admin | List flags for caller's own org |
| PUT | `/:id` | Org Admin | Update a flag — blocked if flag belongs to a different org |
| DELETE | `/:id` | Org Admin | Delete a flag — same org-scope check |
| POST | `/check` | End User | Check if a `featureKey` is enabled for caller's org |

---

## Middleware Chain

Protected routes always apply middleware in this order:

```
authMiddleware → roleMiddleware(role) → [orgScopeMiddleware] → controller
```

- `authMiddleware` decodes the JWT and sets `req.user`
- `roleMiddleware` checks `req.user.role` against the allowed role(s) for that route
- `orgScopeMiddleware` (only on `PUT`/`DELETE` flag routes) re-fetches the flag and verifies `flag.orgId === req.user.orgId` before allowing the request through, independent of anything the frontend does

---

## Data Models

**User** — `username`, `email` (unique), `password` (bcrypt hash), `role` (`OrgAdmin` | `EndUser`), `orgId` (ref)

**Organization** — `name` (unique)

**FeatureFlag** — `orgId` (ref), `featureKey`, `enabled` (boolean). Compound unique index on `{orgId, featureKey}` — the same key can exist independently across different organizations.

> Super Admin is intentionally **not** a DB model — it's a single system-level account authenticated against `.env` values, not a tenant-scoped user.