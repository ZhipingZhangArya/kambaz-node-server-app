# Kambaz Node.js Server

Node.js Express HTTP server for the Kambaz learning management system.

## Features

- RESTful Web APIs for courses, modules, assignments, users, and enrollments
- User authentication and session management
- Faculty authorization for user management
- CORS enabled for cross-origin requests
- Express session support

## Installation

```bash
npm install
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
SERVER_ENV=development
CLIENT_URL=http://localhost:3000
SERVER_URL=http://localhost:4000
SESSION_SECRET=your-secret-key-here
PORT=4000
```

## Running the Server

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on port 4000 (or the port specified in the PORT environment variable).

## API Endpoints

### Users
- `POST /api/users/signup` - Sign up a new user
- `POST /api/users/signin` - Sign in a user
- `POST /api/users/signout` - Sign out a user
- `POST /api/users/profile` - Get current user profile
- `GET /api/users` - Get all users (admin)
- `GET /api/users/:userId` - Get user by ID
- `PUT /api/users/:userId` - Update user (faculty only)
- `DELETE /api/users/:userId` - Delete user (faculty only)

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/users/:userId/courses` - Get courses for a user
- `POST /api/users/current/courses` - Create a course (enrolls current user)
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

### People (Course Users)
- `GET /api/courses/:courseId/users` - Get all users enrolled in a course
- `POST /api/courses/:courseId/users` - Create a user and enroll in course (faculty only)

## License

ISC

