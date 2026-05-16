# Subject Registration System

A full-stack responsive web application for university subject registration.

## Tech Stack
- **Frontend**: HTML, CSS (Vanilla), JavaScript
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL (Neon)
- **Auth**: JWT, bcryptjs

## Features
- Student Authentication (Login/Register)
- Modern Dashboard with stats
- Subject Catalog with search
- Subject Registration (Add/Modify/Delete)
- Audit Trail (History) of all operations
- Profile management
- Fully Responsive design

## Setup Instructions

### 1. Database Setup (Neon)
- Create a PostgreSQL project on [Neon](https://neon.tech).
- Run the SQL schema found in `backend/models/schema.sql` in the Neon SQL Editor.

### 2. Backend Setup
- Navigate to the `backend` folder.
- Create a `.env` file and add the following:
  ```env
  PORT=5000
  DATABASE_URL=your_neon_postgresql_url
  JWT_SECRET=your_secure_random_string
  ```
- Run `npm install`.
- Run `node server.js` to start the backend.

### 3. Frontend Setup
- Navigate to the `frontend` folder.
- Update `assets/js/api.js` with your backend URL (e.g., `http://localhost:5000/api`).
- Open `index.html` in your browser or use a live server.

## Deployment

### Backend (Render)
- Connect your GitHub repo to Render.
- Create a new "Web Service".
- Set environment variables in Render dashboard.

### Frontend (Netlify)
- Drag and drop the `frontend` folder into Netlify.
- Or connect via GitHub and set the base directory to `frontend`.

## Folder Structure
```text
/backend
  /config      - Database connection
  /controllers - Business logic
  /middleware  - JWT Auth
  /models      - SQL Schema
  /routes      - API Endpoints
  server.js    - Entry point

/frontend
  /assets
    /css       - Styles
    /js        - API, UI, and page logic
  index.html   - Login
  register.html
  dashboard.html
  ...other pages
```
