import UsersDao from "./dao.js";
import EnrollmentsDao from "../Enrollments/dao.js";

export default function UserRoutes(app, db) {
  const dao = UsersDao();
  const enrollmentsDao = EnrollmentsDao(db);

  // Helper function to check if current user is faculty or admin
  const isFaculty = (req) => {
    const currentUser = req.session["currentUser"];
    const isAuthorized = currentUser && (currentUser.role === "FACULTY" || currentUser.role === "ADMIN");
    if (currentUser && !isAuthorized) {
      console.log(`[isFaculty] User ${currentUser._id} has role: ${currentUser.role}`);
    }
    return isAuthorized;
  };

  const createUser = async (req, res) => {
    const currentUser = req.session["currentUser"];
    console.log("[createUser] Current user:", currentUser ? { _id: currentUser._id, username: currentUser.username, role: currentUser.role } : "null");
    
    if (!isFaculty(req)) {
      console.log("[createUser] Permission denied. User role:", currentUser?.role);
      res.status(403).json({ message: "Only faculty or admin can create users" });
      return;
    }
    
    console.log("[createUser] Permission granted. Creating user...");
    const existing = await dao.findUserByUsername(req.body.username);
    if (existing) {
      res.status(400).json({ message: "Username already taken" });
      return;
    }
    const newUser = await dao.createUser(req.body);
    console.log("[createUser] User created successfully:", newUser._id);
    res.json(newUser);
  };

  const deleteUser = async (req, res) => {
    if (!isFaculty(req)) {
      res.status(403).json({ message: "Only faculty or admin can delete users" });
      return;
    }
    const { userId } = req.params;
    // Also delete all enrollments for this user
    db.enrollments = db.enrollments.filter(
      (enrollment) => enrollment.user !== userId
    );
    await dao.deleteUser(userId);
    res.sendStatus(200);
  };

  const findAllUsers = async (req, res) => {
    const { role, name } = req.query;
    
    if (role && name) {
      // Filter by both role and name
      const users = await dao.findUsersByRoleAndName(role, name);
      res.json(users);
      return;
    }
    
    if (role) {
      const users = await dao.findUsersByRole(role);
      res.json(users);
      return;
    }
    
    if (name) {
      const users = await dao.findUsersByPartialName(name);
      res.json(users);
      return;
    }
    
    const users = await dao.findAllUsers();
    res.json(users);
  };

  const findUserById = async (req, res) => {
    const { userId } = req.params;
    const user = await dao.findUserById(userId);
    if (!user) {
      res.status(404).json({ message: `User ${userId} not found` });
      return;
    }
    res.json(user);
  };

  const updateUser = async (req, res) => {
    const currentUser = req.session["currentUser"];
    console.log("[updateUser] Session check:", {
      hasSession: !!req.session,
      hasCurrentUser: !!currentUser,
      userId: currentUser?._id,
      role: currentUser?.role,
      cookies: req.headers.cookie ? "present" : "missing"
    });
    
    if (!currentUser) {
      console.log("[updateUser] No current user in session");
      res.status(401).json({ message: "Not authenticated" });
      return;
    }
    const { userId } = req.params;
    // Allow users to update their own profile, or allow faculty/admin to update any user
    if (currentUser._id !== userId && !isFaculty(req)) {
      console.log("[updateUser] Permission denied");
      res.status(403).json({ message: "Only faculty or admin can update other users" });
      return;
    }
    const userUpdates = req.body;
    await dao.updateUser(userId, userUpdates);
    // Fetch the updated user
    const updatedUser = await dao.findUserById(userId);
    if (!updatedUser) {
      res.status(404).json({ message: `User ${userId} not found` });
      return;
    }
    // Convert Mongoose document to plain object
    const updatedUserObj = updatedUser.toObject ? updatedUser.toObject() : updatedUser;
    // Update session if updating current user
    if (currentUser._id === userId) {
      req.session["currentUser"] = updatedUserObj;
      console.log("[updateUser] Session updated for user:", updatedUserObj._id);
    }
    res.json(updatedUserObj);
  };

  // Get all users enrolled in a course
  const findUsersForCourse = async (req, res) => {
    const { courseId } = req.params;
    const users = await enrollmentsDao.findUsersForCourse(courseId);
    res.json(users);
  };

  // Create a user and enroll them in a course (faculty/admin only)
  const createUserForCourse = async (req, res) => {
    if (!isFaculty(req)) {
      res.status(403).json({ message: "Only faculty or admin can create users" });
      return;
    }
    const { courseId } = req.params;
    const existing = await dao.findUserByUsername(req.body.username);
    if (existing) {
      res.status(400).json({ message: "Username already taken" });
      return;
    }
    const newUser = await dao.createUser(req.body);
    enrollmentsDao.enrollUserInCourse(newUser._id, courseId);
    res.json(newUser);
  };

  const signup = async (req, res) => {
    try {
      const existing = await dao.findUserByUsername(req.body.username);
      if (existing) {
        res.status(400).json({ message: "Username already taken" });
        return;
      }
      const currentUser = await dao.createUser(req.body);
      // Convert Mongoose document to plain object
      const userObj = currentUser.toObject ? currentUser.toObject() : currentUser;
      console.log("[signup] User signed up:", { _id: userObj._id, username: userObj.username, role: userObj.role });
      req.session["currentUser"] = userObj;
      res.json(userObj);
    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({ message: "Unable to sign up. Please try again." });
    }
  };

  const signin = async (req, res) => {
    const { username, password } = req.body;
    const currentUser = await dao.findUserByCredentials(username, password);
    if (!currentUser) {
      res.status(401).json({ message: "Unable to login. Try again later." });
      return;
    }
    // Convert Mongoose document to plain object to ensure all fields are included
    const userObj = currentUser.toObject ? currentUser.toObject() : currentUser;
    console.log("[signin] User signed in:", { _id: userObj._id, username: userObj.username, role: userObj.role });
    req.session["currentUser"] = userObj;
    res.json(userObj);
  };

  const signout = (req, res) => {
    req.session.destroy(() => {
      res.sendStatus(200);
    });
  };

  const profile = (req, res) => {
    const currentUser = req.session["currentUser"];
    console.log("[profile] Session check:", {
      hasSession: !!req.session,
      hasCurrentUser: !!currentUser,
      userId: currentUser?._id,
      role: currentUser?.role,
      cookies: req.headers.cookie ? "present" : "missing",
      sessionId: req.sessionID
    });
    
    if (!currentUser) {
      console.log("[profile] No current user in session");
      res.sendStatus(401);
      return;
    }
    console.log("[profile] Current user:", { _id: currentUser._id, username: currentUser.username, role: currentUser.role });
    res.json(currentUser);
  };

  app.post("/api/users", createUser);
  app.get("/api/users", findAllUsers);
  app.get("/api/users/:userId", findUserById);
  app.put("/api/users/:userId", updateUser);
  app.delete("/api/users/:userId", deleteUser);
  app.post("/api/users/signup", signup);
  app.post("/api/users/signin", signin);
  app.post("/api/users/signout", signout);
  app.post("/api/users/profile", profile);
  // People Table routes
  app.get("/api/courses/:courseId/users", findUsersForCourse);
  app.post("/api/courses/:courseId/users", createUserForCourse);
}
