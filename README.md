# 🚀 DevPulse API

A secure and scalable **Issue & Feature Tracking REST API** built with **Node.js, Express.js, TypeScript, and PostgreSQL**. DevPulse helps software teams report bugs, submit feature requests, and manage issue workflows through role-based authentication and authorization.

---

## 🔗 Live Demo

- **Live API:** https://dev-pulse-seven-flax.vercel.app/
- **GitHub Repository:** https://github.com/shorifulbd1st/DevPulse

> Replace the links above with your actual deployment and repository URL.

---

## ✨ Features

- 🔐 JWT Authentication & Authorization
- 👥 Role-based Access Control (Contributor & Maintainer)
- 🐞 Create and Manage Issues
- 🔄 Update Issue Status
- 🗑️ Delete Issues (Maintainer Only)
- 🔍 Filter and Sort Issues
- 🔒 Password Hashing with bcrypt
- ✅ Input Validation
- ⚠️ Centralized Error Handling
- 📦 Modular Project Structure
- 🗄️ PostgreSQL with Raw SQL Queries

---

## 🛠️ Tech Stack

- Node.js
- Express.js
- TypeScript
- PostgreSQL
- Raw SQL (`pg`)
- JWT
- bcrypt
- dotenv

---

## 📁 Project Setup

### Clone the repository

```bash
git clone https://github.com/shorifulbd1st/DevPulse.git
cd DevPulse
```

### Install dependencies

```bash
npm install
```

### Configure environment variables

Create a `.env` file:

```env
PORT=5000
DATABASE_URL=your_database_url
JWT_SECRET=your_secret_key
BCRYPT_SALT_ROUNDS=10
```

### Run the project

```bash
npm run dev
```

---

## 📌 API Endpoints

### Authentication

| Method | Endpoint | Access |
|---------|----------|--------|
| POST | `/api/auth/signup` | Public |
| POST | `/api/auth/login` | Public |

### Issues

| Method | Endpoint | Access |
|---------|----------|--------|
| POST | `/api/issues` | Authenticated |
| GET | `/api/issues` | Public |
| GET | `/api/issues/:id` | Public |
| PATCH | `/api/issues/:id` | Contributor (Own/Open) / Maintainer |
| DELETE | `/api/issues/:id` | Maintainer |

---

## 🗄️ Database Schema

### Users

| Field |
|-------|
| id |
| name |
| email |
| password |
| role |
| created_at |
| updated_at |

### Issues

| Field |
|-------|
| id |
| title |
| description |
| type |
| status |
| reporter_id |
| created_at |
| updated_at |

---

## 🔒 Authentication

Protected routes require a valid JWT token.

```http
Authorization: Bearer <your_jwt_token>
```

---

## 📂 Project Structure

```
src/
├── config/
├── modules/
│   ├── auth/
│   └── issue/
├── middleware/
├── utils/
├── app.ts
└── server.ts
```

---

## 🚀 Deployment

- **Backend:** Vercel
- **Database:** Neon PostgreSQL

---

## 👨‍💻 Author

**Shoriful Islam**

