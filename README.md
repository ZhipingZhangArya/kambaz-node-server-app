# Kambaz Node.js Server

Node.js Express HTTP server for the Kambaz learning management system.

## Features

- RESTful Web APIs for courses, modules, assignments, users, and enrollments
- Server-side session management
- CORS support for cross-origin requests
- User authentication and authorization
- Faculty role-based access control

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file with the following variables:
```
SERVER_ENV=development
CLIENT_URL=http://localhost:3000
SERVER_URL=http://localhost:4000
SESSION_SECRET=your-secret-key-here
PORT=4000
```

3. Start the development server:
```bash
npm run dev
```

4. Start the production server:
```bash
npm start
```

## API Routes

### Users
- `POST /api/users/signup` - Sign up a new user
- `POST /api/users/signin` - Sign in a user
- `POST /api/users/signout` - Sign out a user
- `POST /api/users/profile` - Get current user profile
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:userId` - Get user by ID
- `PUT /api/users/:userId` - Update user (faculty only)
- `DELETE /api/users/:userId` - Delete user (faculty only)
- `GET /api/courses/:courseId/users` - Get users enrolled in a course
- `POST /api/courses/:courseId/users` - Create user and enroll in course (faculty only)

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/users/:userId/courses` - Get courses for a user
- `POST /api/users/current/courses` - Create a new course
- `PUT /api/courses/:courseId` - Update a course
- `DELETE /api/courses/:courseId` - Delete a course

### Modules
- `GET /api/courses/:courseId/modules` - Get modules for a course
- `POST /api/courses/:courseId/modules` - Create a module
- `PUT /api/modules/:moduleId` - Update a module
- `DELETE /api/modules/:moduleId` - Delete a module

### Assignments
- `GET /api/courses/:courseId/assignments` - Get assignments for a course
- `POST /api/courses/:courseId/assignments` - Create an assignment
- `GET /api/assignments/:assignmentId` - Get assignment by ID
- `PUT /api/assignments/:assignmentId` - Update an assignment
- `DELETE /api/assignments/:assignmentId` - Delete an assignment

### Enrollments
- `POST /api/users/current/enrollments/:courseId` - Enroll in a course
- `DELETE /api/users/current/enrollments/:courseId` - Unenroll from a course
- `GET /api/users/:userId/enrollments` - Get enrollments for a user

## Deployment

This server can be deployed to platforms like Render or Heroku. Make sure to set the appropriate environment variables in your deployment platform.

