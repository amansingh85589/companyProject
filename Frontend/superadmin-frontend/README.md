# Super Admin Frontend

The smallest of the three apps — used only by the software provider to onboard new organizations onto the platform.

> Part of a larger project — see the [root README](../../README.md) for the full system overview.

---

## What this app does

- Login using static Super Admin credentials (set in `backend/.env`)
- Create new organizations
- View a list of all organizations currently in the system

No signup flow exists here — Super Admin is a single system-level account, not something users register for.

---

## Tech Stack

- React (Vite)
- Axios
- No router — only two screens (login / dashboard), toggled via simple `useState`

---

## Folder Structure

```
src/
├── api/
│   └── axiosInstance.js   # Axios instance with baseURL + auto Authorization header
├── components/
│   ├── LoginForm.jsx
│   ├── CreateOrgForm.jsx
│   └── OrgList.jsx
├── pages/
│   └── Dashboard.jsx       # Combines CreateOrgForm + OrgList
└── App.jsx                 # Toggles LoginForm ↔ Dashboard based on token presence
```

---

## Setup

```bash
npm install
```

Create `.env`:
```
VITE_API_URL=http://localhost:5000/api
```

Run:
```bash
npm run dev
```

Runs on `http://localhost:5173` (see `vite.config.js` for the fixed port).

---

## Notes

- Token is stored in `localStorage` under the key `superAdminToken`.
- Requires the backend to be running on port 5000 — see the [backend README](../../backend/README.md) for setup.