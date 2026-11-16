# DecodeLabs Task 1 - REST API Project

A foundational REST API built with Express.js demonstrating standard HTTP methods, request validation, and JSON responses.

---

## Tech Stack
- **Runtime**: Node.js (CommonJS)
- **Framework**: Express.js 5

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Server
```bash
npm start
```
The server will start on `http://localhost:3000`.

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Health check & welcome message |
| `GET` | `/api/users` | Retrieve mock list of users |
| `POST` | `/api/users` | Create a user (requires `name` and `email` in JSON body) |

