# Reyansha Dashboard

Next.js dashboard for the Reyansha API.

## Configure the API

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

The client adds `/api/v1` unless the configured URL already ends with that path. The API described in the dashboard documentation listens on port `3000`; the dashboard development and production servers therefore use port `3001`.

Install dependencies and start the dashboard:

```bash
npm install
npm run dev
```

Open [http://localhost:3001](http://localhost:3001). The API must be running and permit requests from the dashboard origin. Authentication requests include cookies and use a bearer access token when the API returns one.

## Integrated API workflows

| API area | Dashboard route | Operations |
| --- | --- | --- |
| Authentication | `/login`, `/profile`, `/change-password`, `/forgot-password`, `/reset-password`, `/bootstrap` | Login/logout, current account, refresh, change/reset password, bootstrap |
| Users | `/user-management` | List, create, read, replace/edit, assign roles, deactivate |
| Roles | `/roles` | List, create, update, delete |
| Health | `/health` | Check service health |

User edits send `PUT /users/:id`; `PATCH /users/:id` is also available from the API client for partial updates. Role assignments send `{ "roles": ["role-key"] }`. Password reset requests send an email; reset submissions send `{ "token": "...", "password": "..." }`. The API client reports non-success HTTP responses in the dashboard.

The base URL can point either to the API origin (for example `http://localhost:3000`) or directly to its versioned prefix (`http://localhost:3000/api/v1`).
