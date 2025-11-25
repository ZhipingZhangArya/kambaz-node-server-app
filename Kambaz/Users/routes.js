import UsersDao from "./dao.js";
import EnrollmentsDao from "../Enrollments/dao.js";

export default function UserRoutes(app, db) {
  const dao = UsersDao();
  const enrollmentsDao = EnrollmentsDao(db);

  // Helper function to check if current user is faculty
  const isFaculty = (req) => {
    const currentUser = req.session["currentUser"];
    return currentUser && (currentUser.role === "FACULTY" || currentUser.role === "ADMIN");
  };

  const createUser = async (req, res) => {
    if (!isFaculty(req)) {
      res.status(403).json({ message: "Only faculty can create users" });
      return;
    }
    const existing = await dao.findUserByUsername(req.body.username);
    if (existing) {
      res.status(400).json({ message: "Username already taken" });
      return;
    }
    const newUser = await dao.createUser(req.body);
    res.json(newUser);
  };

  const deleteUser = async (req, res) => {
    if (!isFaculty(req)) {
      res.status(403).json({ message: "Only faculty can delete users" });
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
    if (!isFaculty(req)) {
      res.status(403).json({ message: "Only faculty or admin can update users" });
      return;
    }
    const { userId } = req.params;
    const userUpdates = req.body;
    await dao.updateUser(userId, userUpdates);
    // Fetch the updated user
    const updatedUser = await dao.findUserById(userId);
    if (!updatedUser) {
      res.status(404).json({ message: `User ${userId} not found` });
      return;
    }
    // Update session if updating current user
    const currentUser = req.session["currentUser"];
    if (currentUser && currentUser._id === userId) {
      req.session["currentUser"] = updatedUser;
    }
    res.json(updatedUser);
  };

  // Get all users enrolled in a course
  const findUsersForCourse = async (req, res) => {
    const { courseId } = req.params;
    const enrollments = enrollmentsDao.findEnrollmentsForCourse(courseId);
    const userIds = enrollments.map((enrollment) => enrollment.user);
    const users = await Promise.all(
      userIds.map((userId) => dao.findUserById(userId))
    );
    res.json(users.filter((user) => user !== null));
  };

  // Create a user and enroll them in a course (faculty only)
  const createUserForCourse = async (req, res) => {
    if (!isFaculty(req)) {
      res.status(403).json({ message: "Only faculty can create users" });
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
      req.session["currentUser"] = currentUser;
      res.json(currentUser);
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
    req.session["currentUser"] = currentUser;
    res.json(currentUser);
  };

  const signout = (req, res) => {
    req.session.destroy(() => {
      res.sendStatus(200);
    });
  };

  const profile = (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
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
