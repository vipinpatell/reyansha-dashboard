# Reyansha Dashboard

Next.js dashboard for the Reyansha API.

## Local development

Configure the API origin in `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

The client appends `/api/v1` unless the value already ends with that prefix. The dashboard runs on port `3001`, separate from the API on port `3000`. The API must allow the dashboard origin and its session-cookie credentials through CORS.

```bash
npm install
npm run dev
```

Open [http://localhost:3001](http://localhost:3001). API documentation is available at [http://localhost:3000/docs](http://localhost:3000/docs) and `/docs-json`.

## Authentication and access control

The API authenticates the dashboard with the HttpOnly `reyansha_session` cookie. Browser requests use `credentials: 'include'`; the frontend does not read, store, or send session tokens. The server is authoritative for all permissions.

The dashboard loads `GET /api/v1/auth/me` for the current profile, assigned roles, permissions, and `mustChangePassword` state. A 401 clears in-memory account state and redirects to sign-in. A forced password change gates normal dashboard routes until the user changes their password. Successful password changes end the session and require another sign-in.

Sign-in accepts an email or username and a password. Password changes and resets require at least 12 characters and at most 72 UTF-8 bytes. Forgot-password and reset-password pages are available without a session. Public signup/bootstrap UI is not provided.

## Dashboard routes and API operations

| Dashboard route | API workflows |
| --- | --- |
| `/login` | `POST /auth/login`, `GET /auth/me` |
| `/profile` | `GET /auth/me`, `POST /auth/refresh` |
| `/change-password` | `POST /auth/change-password` |
| `/forgot-password`, `/reset-password` | `POST /auth/forgot-password`, `POST /auth/reset-password` |
| `/user-management` | List, create, read, replace, partial update, role assignment, deactivate and authorized admin password set |
| `/roles` | List, create, update and delete roles |
| `/health` | API health check |

Role assignment sends `{ "roleIds": ["<MongoDB role id>"] }`. User administration password setting sends only `{ "password": "..." }` to `PATCH /api/v1/users/:id/password`; the UI exposes it only when `/auth/me` reports both the exact `super_admin` role and `roles.manage`. The backend remains authoritative and requires the user to change that temporary password on their next sign-in.

Navigation and actions are filtered using the current account’s API-provided permissions. The API enforces access, including limited direct-report access, regardless of what the UI displays.

The live Swagger document does not define response schemas for user listing/details or the deactivate operation. The dashboard treats a successful deactivate response as accepted but cannot persistently display disabled/suspended row status or distinguish suspension until the API documents and returns those fields.
