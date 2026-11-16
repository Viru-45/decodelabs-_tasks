# DecodeLabs Backend Development Internship Tasks

This repository contains the milestone projects and tasks developed for the **DecodeLabs Industrial Training & Internship Program (Batch 2026)** in Backend Development.

---

## 📁 Repository Overview

```
decodelabs-_tasks/
├── rest-api-project/          # Project 1: REST API Fundamentals
│   ├── server.js              # Express REST API endpoints
│   ├── package.json           # Project dependencies & scripts
│   └── README.md
│
├── CRUD/                      # Project 2: Database-backed CRUD Operations
│   └── project-2/
│       └── backend/           # Express + Prisma + PostgreSQL CRUD service
│           ├── src/           # Controllers, routes, and DB client
│           ├── prisma/        # Schema definition & migrations
│           ├── .env.example   # Environment configuration template
│           ├── package.json
│           └── README.md
│
├── Secure/                    # Project 3: Full-Stack Secure Authentication System
│   ├── backend/               # Express + Prisma API with JWT & bcrypt
│   │   ├── controllers/
│   │   ├── middleware/        # Bearer token auth & rate limiting
│   │   ├── prisma/            # Schema definition & migrations
│   │   ├── tests/             # Automated test suite (node:test + Supertest)
│   │   ├── .env.example
│   │   └── package.json
│   ├── frontend/              # React + Vite client (In-memory security)
│   │   ├── src/               # AuthContext, components, routing
│   │   ├── .env.example
│   │   └── package.json
│   ├── thunder-tests/         # API testing collection & environment
│   └── README.md
│
├── .gitignore                 # Universal ignore rules (secrets, dependencies, logs)
└── README.md                  # Main repository index
```

---

## 🚀 Projects Breakdown

### 🔹 Project 1: REST API Project (`rest-api-project/`)
- **Focus**: HTTP protocol fundamentals, Express server configuration, request parsing, and status codes.
- **Key Features**:
  - GET and POST endpoints for user resource management.
  - JSON payload validation with error handling and proper HTTP response statuses.
- **Tech Stack**: Node.js, Express.js.

### 🔹 Project 2: CRUD Operations (`CRUD/project-2/backend/`)
- **Focus**: Persistent storage, relational data modeling, and Database CRUD logic.
- **Key Features**:
  - Full CRUD operations: Create, Read (single & all), Update, and Delete users.
  - Prisma ORM integrated with PostgreSQL for migrations and queries.
  - Controller and router modular architecture.
- **Tech Stack**: Node.js, Express.js, Prisma ORM, PostgreSQL.

### 🔹 Project 3: Secure Authentication System (`Secure/`)
- **Focus**: Industry-standard cryptographic practices, authentication flows, and frontend zero-storage security.
- **Key Features**:
  - **Password Hashing**: Strong bcrypt hashing with 12 salt rounds before database persistence.
  - **JWT Authorization**: HS256-signed JSON Web Tokens for stateless session management with 1-hour expiration.
  - **Protected Routes**: Bearer token authorization middleware on sensitive API endpoints.
  - **Rate Limiting**: Protection against brute-force credential stuffing attacks using `express-rate-limit`.
  - **Zero-Storage Client Security**: React SPA with in-memory auth state retention to eliminate XSS token theft vectors.
  - **Automated Testing**: Dedicated integration test suite via `node:test` and `supertest`.
  - **Thunder Client Collections**: Pre-configured test suite included in `thunder-tests/`.
- **Tech Stack**: React, Vite, Node.js, Express.js, Prisma ORM, PostgreSQL, bcrypt, jsonwebtoken, Zod.

---

## 🛠️ Global Setup Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [PostgreSQL](https://www.postgresql.org/) running locally on port 5432

### Running Any Project
Navigate into the respective project directory and follow its localized `README.md`:

```bash
# Example: Running Project 1
cd rest-api-project
npm install
npm start

# Example: Running Project 2
cd CRUD/project-2/backend
npm install
cp .env.example .env   # update with your postgres credentials
npx prisma migrate deploy
npm run dev

# Example: Running Project 3
# 1. Backend
cd Secure/backend
npm install
cp .env.example .env   # configure database & JWT secret
npx prisma migrate deploy
npm run dev

# 2. Frontend
cd Secure/frontend
npm install
npm run dev
```

---

## 👤 Author
- **GitHub**: [@Viru-45](https://github.com/Viru-45)
- **Program**: DecodeLabs Industrial Training Kit (Batch 2026)

