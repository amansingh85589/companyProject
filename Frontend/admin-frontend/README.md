# User Frontend

Used by End Users to check whether a specific feature is enabled for their organization. The smallest and simplest of the three apps.

> Part of a larger project — see the [root README](../../README.md) for the full system overview.

---

## What this app does

- Sign up as an End User under an existing organization (org picked from a dropdown)
- Log in
- Enter a feature key and submit
- See whether that feature is enabled or disabled for their organization

---

## Tech Stack

- React (Vite)
- Axios
- No router — signup/login/check-flag screens toggled via simple `useState`, same pattern as `superadmin-frontend`

---

## Folder Structure

```
src/
├── api/
│   └── axiosInstance.js     # Axios instance with baseURL + auto Authorization header
├── components/
│   ├── LoginForm.jsx
│   ├── SignupForm.jsx        # Includes org dropdown via /organizations/public
│   └── CheckFlagForm.jsx     # Input + submit + enabled/disabled result
├── pages/
│   └── CheckPage.jsx          # Wraps CheckFlagForm with a logout button
└── App.jsx                    # Toggles Signup ↔ Login ↔ CheckPage based on state
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

Runs on `http://localhost:5175` (see `vite.config.js` for the fixed port).

---

## Notes

- Token stored in `localStorage` under the key `userToken`.
- Signup here exists even though it wasn't itemized in the original spec's feature list for this app — it's necessary because no other app creates End User accounts, and there's otherwise no way to test the check-flag flow.
- A nonexistent `featureKey` returns `enabled: false` rather than an error — "flag not set" is treated as a valid, expected state.
- Requires the backend to be running on port 5000 — see the [backend README](../../backend/README.md) for setup.