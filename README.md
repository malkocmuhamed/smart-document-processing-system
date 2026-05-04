# Smart Document Processing System

A full-stack application for uploading, extracting, validating, and reviewing structured data from documents.

---

## Tech Stack

### Backend

* NestJS
* Prisma ORM
* PostgreSQL
* Docker *(optional for database)*

### Frontend

* Angular
* Angular Signals
* Angular Material

---

## Setup Instructions

### 1. Clone Repository

```bash
git clone https://github.com/malkocmuhamed/smart-document-processing-system.git
cd smart-processing-system
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

#### Environment Variables

Create a `.env` file in the backend folder:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/smart_docs"
```

---

### 3. Database Setup

#### Option A: Docker (Recommended)

```bash
docker run --name smart-docs-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=smart_docs \
  -p 5432:5432 \
  -d postgres:16
```

#### Option B: Local PostgreSQL

You can use a local PostgreSQL installation instead of Docker.

> Docker is optional and not required if PostgreSQL is already installed.

---

### 4. Run Migrations

```bash
npx prisma migrate dev
```

---

### 5. Prisma Database UI

For inspecting the database visually:

```bash
npx prisma studio
```

---

### 6. Start Backend

```bash
npm run start:dev
```

Backend runs at:
http://localhost:3000

---

### 7. Frontend Setup

```bash
cd frontend
npm install
ng serve
```

Frontend runs at:
http://localhost:4200

---

## Notes

* Make sure PostgreSQL is running before starting the backend
* Backend and frontend are run separately
* Docker is optional and used only for database setup

---
