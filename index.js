import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import Hello from './Hello.js';
import Lab5 from './Lab5/index.js';
import db from './Kambaz/Database/index.js';
import UserRoutes from './Kambaz/Users/routes.js';
import CourseRoutes from './Kambaz/Courses/routes.js';
import ModulesRoutes from './Kambaz/Modules/routes.js';
import AssignmentsRoutes from './Kambaz/Assignments/routes.js';
import EnrollmentsRoutes from './Kambaz/Enrollments/routes.js';

const CONNECTION_STRING = process.env.DATABASE_CONNECTION_STRING || 'mongodb://127.0.0.1:27017/kambaz';
mongoose.connect(CONNECTION_STRING).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('MongoDB connection error:', error);
});

const app = express();

// Configure CORS to support multiple origins (for Vercel preview deployments)
const allowedOrigins = process.env.CLIENT_URLS 
  ? process.env.CLIENT_URLS.split(',').map(url => url.trim())
  : [process.env.CLIENT_URL || 'http://localhost:3000'];

// Also allow any Vercel preview deployment
const corsOptions = {
  credentials: true,
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // Allow Vercel preview deployments (any URL containing vercel.app)
    if (origin.includes('vercel.app')) {
      return callback(null, true);
    }
    
    // Allow localhost for development
    if (origin.startsWith('http://localhost:') || origin.startsWith('https://localhost:')) {
      return callback(null, true);
    }
    
    callback(new Error('Not allowed by CORS'));
  }
};

app.use(cors(corsOptions));

const sessionOptions = {
  secret: process.env.SESSION_SECRET || 'kambaz',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: CONNECTION_STRING,
    dbName: 'kambaz',
    collectionName: 'sessions',
  }),
};

if (process.env.SERVER_ENV !== 'development') {
  sessionOptions.proxy = true;
  sessionOptions.cookie = {
    sameSite: 'none',
    secure: true,
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    // For cross-origin cookies, don't set domain - browser will handle it
    // Setting domain can cause cookies not to be sent properly
  };
} else {
  // Development: allow cookies in localhost
  sessionOptions.cookie = {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  };
}

app.use(session(sessionOptions));

// Debug middleware to log session info
app.use((req, res, next) => {
  if (req.path.includes('/api/users') && (req.path.includes('/profile') || req.path.includes('/update') || req.method === 'POST')) {
    console.log(`[Session Debug] ${req.method} ${req.path}:`, {
      hasSession: !!req.session,
      hasCurrentUser: !!req.session?.currentUser,
      sessionId: req.sessionID,
      cookies: req.headers.cookie ? 'present' : 'missing',
      origin: req.headers.origin,
      referer: req.headers.referer
    });
  }
  next();
});

app.use(express.json());

UserRoutes(app, db);
CourseRoutes(app, db);
ModulesRoutes(app, db);
AssignmentsRoutes(app, db);
EnrollmentsRoutes(app, db);
Lab5(app);
Hello(app);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
