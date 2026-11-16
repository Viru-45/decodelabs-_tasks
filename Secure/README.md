# Secure Authentication App

A secure, local-development full-stack authentication application featuring a React + Vite frontend and an Express + Prisma backend backed by PostgreSQL.

---

## Architecture & Responsibilities

- **`frontend/`**: Single Page Application built with React, Vite, and React Router.
  - Implements **zero-storage security**: tokens and user state are retained in-memory only via React Context (never saved to `localStorage` or `sessionStorage`).
  - Reloading the browser intentionally clears the token and requires signing in again, minimizing client-side XSS attack exposure.
  - Provides responsive authentication screens, inline field-level validation, loading indicators, protected routes, and a profile view.
- **`backend/`**: RESTful Express API with Prisma ORM.
  - Enforces input validation using Zod (name trimming, email normalization to lowercase, password length between 12 and 72 UTF-8 bytes).
  - Hashes passwords using bcrypt with 12 salt rounds before database persistence.
  - Issues signed HS256 JSON Web Tokens (1-hour expiration) upon login.
  - Protects authenticated endpoints with bearer token verification middleware.
  - Never reveals password hashes in any response or server log.
  - Implements rate limiting on sensitive authentication routes.
- **`thunder-tests/`**: Exported Thunder Client collection and local environment for testing the REST API.

---

## Prerequisites

- **Node.js** (v18 or higher recommended) and **npm**
- A running local **PostgreSQL** instance

---

## Installation

Install dependencies in both directories:

```powershell
# In the project root
cd frontend
npm install

cd ..\backend
npm install
```

---

## Local Database Setup

1. **Create the PostgreSQL databases**:
   Using `psql`, pgAdmin, or your preferred PostgreSQL tool, create two databases:
   - Development database: `secure_auth`
   - Test database: `secure_auth_test` (the test suite strictly requires a database name ending with `_test`)

2. **Configure backend environment variables**:
   In `backend`, copy `.env.example` to `.env`:
   ```powershell
   cd backend
   Copy-Item .env.example .env
   ```
   Edit `backend\.env` with your PostgreSQL credentials and a strong secret:
   ```env
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/secure_auth?schema=public"
   TEST_DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/secure_auth_test?schema=public"
   JWT_SECRET="replace-this-with-your-own-secret-of-32-or-more-characters"
   FRONTEND_ORIGIN="http://localhost:5173"
   PORT=3000
   ```
   > [!IMPORTANT]
   > `JWT_SECRET` must be at least 32 characters long. Never commit real `.env` files.

3. **Configure frontend environment variables** (optional):
   The frontend defaults to `http://localhost:3000`. You can optionally copy `.env.example` to `frontend\.env`:
   ```powershell
   cd ..\frontend
   Copy-Item .env.example .env
   ```

4. **Run Prisma migrations on the development database**:
   ```powershell
   cd ..\backend
   npm run prisma:generate
   npm run prisma:migrate:deploy
   ```

---

## Running the Application

Run the backend and frontend in two separate PowerShell terminal windows.

### Terminal 1: Backend Server
```powershell
cd backend
npm run dev
```
The server will start on `http://localhost:3000`.

### Terminal 2: Frontend Client
```powershell
cd frontend
npm run dev
```
The Vite development server will start at `http://localhost:5173`. Open this URL in your browser.

---

## API Contract & Expected Status Codes

| Endpoint | Method | Header | Expected Body | Success Code | Error Codes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `/api/auth/register` | `POST` | `Content-Type: application/json` | `{ "name": "...", "email": "...", "password": "..." }` | **201 Created** | **400** (invalid input), **409** (email already exists), **429** (rate limit) |
| `/api/auth/login` | `POST` | `Content-Type: application/json` | `{ "email": "...", "password": "..." }` | **200 OK** | **400** (invalid input), **401** (invalid email/password), **429** (rate limit) |
| `/api/auth/profile` | `GET` | `Authorization: Bearer <token>` | None | **200 OK** | **401** (missing, invalid, or expired token) |

---

## Testing with Thunder Client

Thunder Client configuration files are located in `thunder-tests/`:

1. In VS Code, open the **Thunder Client** extension.
2. Under **Collections**, click **Import** and select `thunder-tests/thunder-collection_SecureAuth.json`.
3. Under **Environments**, click **Import** and select `thunder-tests/thunder-environment_Local.json`.
4. Ensure the **Local** environment is active.
5. **Execution flow**:
   - **Step 1: Register Account (`POST /api/auth/register`)**: Creates an account; receives HTTP 201 with public user details.
   - **Step 2: Login (`POST /api/auth/login`)**: Authenticates credentials; returns HTTP 200 with `token` and user object.
   - **Step 3: Set Token**: Copy the returned `token` into the `token` variable in your Thunder Client Local Environment.
   - **Step 4: Get Profile (`GET /api/auth/profile`)**: Sends request with `Authorization: Bearer {{token}}`; returns HTTP 200 and the public profile.

---

## Automated Backend Integration Tests

The integration test suite validates registration, email normalization, bcrypt password storage, generic authentication error messages, token expiration, and route protection.

The suite includes an automated safety guard: tests will **refuse to run** unless `TEST_DATABASE_URL` is set and its database name ends with `_test`.

```powershell
cd backend

# Apply migrations to the test database
$env:DATABASE_URL = "postgresql://postgres:YOUR_PASSWORD@localhost:5432/secure_auth_test?schema=public"
npx prisma migrate deploy

# Run the integration test suite
$env:TEST_DATABASE_URL = "postgresql://postgres:YOUR_PASSWORD@localhost:5432/secure_auth_test?schema=public"
npm test
```

---

## Frontend Build Verification

To verify the production build of the frontend:

```powershell
cd frontend
npm run build
```
This produces an optimized production bundle in `frontend/dist/`.
