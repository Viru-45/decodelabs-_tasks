# DecodeLabs Task 2 - CRUD Backend API

A RESTful CRUD API service built with Express.js, Prisma ORM, and PostgreSQL for user management.

---

## Tech Stack
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js 5
- **ORM**: Prisma ORM
- **Database**: PostgreSQL

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env` and fill in your PostgreSQL credentials:
```bash
cp .env.example .env
```

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/project2"
PORT=3000
```

### 3. Run Prisma Migrations
```bash
npx prisma migrate dev --name init
```

### 4. Run the Server
```bash
# Development mode with hot-reload
npm run dev

# Production mode
npm start
```

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/users` | Retrieve all users |
| `GET` | `/api/users/:id` | Retrieve user by ID |
| `POST` | `/api/users` | Create a new user |
| `PUT` | `/api/users/:id` | Update an existing user |
| `DELETE` | `/api/users/:id` | Delete a user |
