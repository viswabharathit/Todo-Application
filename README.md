# PlanIt - Todo Application

A full-stack task and project management application built with **React** (frontend) and **Spring Boot** (backend), using **Oracle SQL** as the database.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [Setup & Installation](#setup--installation)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Security](#security)
- [Pages & Navigation](#pages--navigation)

---

## Overview

PlanIt is a personal productivity application that allows users to manage their projects and tasks efficiently. Users can register, log in, create projects, assign tasks to projects, and track task progress through various views like Today, Upcoming, and Pending.

---

## Tech Stack

### Frontend
- React 18
- React Router DOM
- Axios
- CSS (custom styling)

### Backend
- Java 17
- Spring Boot 3
- Spring Security
- JWT (JSON Web Tokens)
- Spring Data JPA

### Database
- Oracle SQL
- Oracle Sequences & Triggers for auto-increment

---

## Features

- User registration and login with JWT authentication
- Protected routes — only authenticated users can access the app
- Persistent login — token stored in localStorage
- Project management — create, edit, delete projects
- Task management — create, edit, delete, complete tasks
- Task assigned to a project with priority levels
- Due date validation — task due date must be on or before project due date
- Filtered views — Today, Upcoming, Pending tasks
- User profile — view and edit profile details
- Logout functionality
- 404 Not Found page
- Access Denied page for unauthenticated access

---

## Project Structure

```
planit/
│
├── frontend/                          # React application
│   └── src/
│       ├── assets/                    # Images, logos
│       ├── components/
│       │   ├── Loader.jsx             # Splash screen
│       │   ├── ProtectedRoute.jsx     # Auth guard
│       │   └── Sidebar.jsx            # Navigation sidebar
│       ├── layouts/
│       │   └── DashboardLayout.jsx    # Common layout with sidebar
│       ├── pages/
│       │   ├── AuthPage.jsx           # Login & Register
│       │   ├── Dashboard.jsx          # Home/Welcome page
│       │   ├── Tasks.jsx              # Task management
│       │   ├── Projects.jsx           # Project management
│       │   ├── Today.jsx              # Today's tasks
│       │   ├── Upcoming.jsx           # Upcoming tasks
│       │   ├── Pending.jsx            # Overdue tasks
│       │   ├── Profile.jsx            # User profile
│       │   ├── AccessDenied.jsx       # 403 page
│       │   └── NotFound.jsx           # 404 page
│       ├── services/
│       │   └── api.js                 # Axios instance with JWT interceptor
│       ├── styles/                    # CSS files
│       └── App.jsx                    # Route definitions
│
└── backend/                           # Spring Boot application
    └── src/main/java/
        ├── controller/                # REST controllers
        ├── service/                   # Business logic
        ├── repository/                # JPA repositories
        ├── model/                     # Entity classes
        ├── dto/                       # Data Transfer Objects
        ├── security/                  # JWT filter, config
        ├── exception/                 # Custom exceptions
        └── config/                    # CORS configuration
```

---

## Database Schema

```sql
-- Users table
CREATE TABLE USERS (
    USER_ID   NUMBER PRIMARY KEY,
    NAME      VARCHAR2(100) NOT NULL,
    EMAIL     VARCHAR2(100) UNIQUE,
    PASSWORD  VARCHAR2(255) NOT NULL,
    COUNTRY   VARCHAR2(100),
    GENDER    VARCHAR2(10),
    JWT_TOKEN VARCHAR2(500),
    CREATED_AT DATE DEFAULT SYSDATE
);

-- Projects table
CREATE TABLE projects (
    project_id   NUMBER PRIMARY KEY,
    project_name VARCHAR2(150) NOT NULL,
    description  VARCHAR2(500),
    due_date     DATE,
    user_id      NUMBER REFERENCES users(user_id),
    CONSTRAINT unique_user_project UNIQUE (project_name, user_id)
);

-- Priority table
CREATE TABLE priority (
    priority_id   NUMBER PRIMARY KEY,
    priority_name VARCHAR2(50)
);

-- Tasks table
CREATE TABLE tasks (
    task_id     NUMBER PRIMARY KEY,
    task_name   VARCHAR2(150) NOT NULL,
    description VARCHAR2(500),
    due_date    DATE,
    priority_id NUMBER REFERENCES priority(priority_id),
    project_id  NUMBER REFERENCES projects(project_id),
    status      VARCHAR2(20) DEFAULT 'Pending'
);
```

### Priority Data
| priority_id | priority_name |
|-------------|---------------|
| 1           | Priority 1    |
| 2           | Priority 2    |
| 3           | Priority 3    |

---

## Setup & Installation

### Prerequisites
- Java 17+
- Node.js 18+
- Oracle Database
- Maven

### Backend Setup

1. Clone the repository
2. Open the backend project in IntelliJ IDEA or any IDE
3. Update `application.properties` with your Oracle DB credentials:

```properties
spring.datasource.url=jdbc:oracle:thin:@localhost:1521:xe
spring.datasource.username=YOUR_USERNAME
spring.datasource.password=YOUR_PASSWORD
spring.datasource.driver-class-name=oracle.jdbc.OracleDriver
spring.jpa.hibernate.ddl-auto=none
spring.jpa.show-sql=true
server.port=8081
```

4. Run the SQL scripts to create tables, sequences, and triggers
5. Insert priority data:
```sql
INSERT INTO priority VALUES (1, 'Priority1');
INSERT INTO priority VALUES (2, 'Priority2');
INSERT INTO priority VALUES (3, 'Priority3');
COMMIT;
```

### Frontend Setup

1. Navigate to the frontend directory
2. Install dependencies:
```bash
npm install
```

---

## Running the Application

### Start Backend
```bash
# In IntelliJ — run the main Spring Boot application class
# Or via Maven:
mvn spring-boot:run
```
Backend runs on: `http://localhost:8081`

### Start Frontend
```bash
npm run dev
```
Frontend runs on: `http://localhost:5173`

---

## API Endpoints

### Users
| Method | Endpoint           | Description              | Auth Required |
|--------|--------------------|--------------------------|---------------|
| POST   | /users/register    | Register new user        | No            |
| POST   | /users/login       | Login user               | No            |
| GET    | /users/{id}        | Get user by ID           | Yes           |
| PATCH  | /users/{id}        | Update user profile      | Yes           |
| DELETE | /users/{id}        | Delete user              | Yes           |

### Projects
| Method | Endpoint                  | Description              | Auth Required |
|--------|---------------------------|--------------------------|---------------|
| POST   | /projects                 | Create project           | Yes           |
| GET    | /projects/user/{userId}   | Get projects by user     | Yes           |
| PATCH  | /projects/{id}            | Update project           | Yes           |
| DELETE | /projects/{id}            | Delete project           | Yes           |

### Tasks
| Method | Endpoint               | Description              | Auth Required |
|--------|------------------------|--------------------------|---------------|
| POST   | /tasks                 | Create task              | Yes           |
| GET    | /tasks/user/{userId}   | Get tasks by user        | Yes           |
| PUT    | /tasks/{id}            | Full update task         | Yes           |
| PATCH  | /tasks/{id}            | Partial update task      | Yes           |
| DELETE | /tasks/{id}            | Delete task              | Yes           |

---

## Security

- JWT tokens are generated on registration and refreshed on every login
- Tokens expire after **24 hours**
- All endpoints except `/users/register` and `/users/login` require a valid Bearer token
- Token is stored in `localStorage` and sent via `Authorization: Bearer <token>` header
- Spring Security validates the token on every request via `JwtAuthenticationFilter`
- OPTIONS (preflight) requests are permitted to support CORS

### Authentication Flow
```
1. User registers/logs in
2. Backend generates JWT token
3. Token + userId saved to localStorage
4. Every API request includes token in Authorization header
5. Backend validates token → sets Spring Security context
6. Protected resources are accessible
```

---

## Pages & Navigation

| Page         | Route           | Description                              |
|--------------|-----------------|------------------------------------------|
| Loader       | /               | Splash screen, redirects based on token  |
| Auth         | /auth           | Login and Register                       |
| Dashboard    | /dashboard      | Welcome page after login                 |
| Tasks        | /tasks          | Create, view, edit, delete tasks         |
| Projects     | /projects       | Create, view, edit, delete projects      |
| Today        | /today          | Tasks due today                          |
| Upcoming     | /upcoming       | Tasks due in the future                  |
| Pending      | /pending        | Overdue incomplete tasks                 |
| Profile      | /profile        | View and edit user profile               |
| Access Denied| /access-denied  | Shown when accessing without login       |
| Not Found    | *               | 404 page for unknown routes              |

---

## Validation Rules

- Task due date cannot be in the past
- Task due date must be on or before the project due date
- Project due date cannot be in the past
- Project name must be unique per user
- Password must contain 8+ characters, uppercase, lowercase, number, special character

---

## Author

Built with React + Spring Boot + Oracle SQL.
