import UsersDao from "./dao.js";
import EnrollmentsDao from "../Enrollments/dao.js";

export default function UserRoutes(app, db) {
  const dao = UsersDao(db);
  const enrollmentsDao = EnrollmentsDao(db);

  // Helper function to check if current user is faculty
  const isFaculty = (req) => {
    const currentUser = req.session["currentUser"];
    return currentUser && currentUser.role === "FACULTY";
  };

  const createUser = (req, res) => {
    if (!isFaculty(req)) {
      res.status(403).json({ message: "Only faculty can create users" });
      return;
    }
    const existing = dao.findUserByUsername(req.body.username);
    if (existing) {
      res.status(400).json({ message: "Username already taken" });
      return;
    }
    const newUser = dao.createUser(req.body);
    res.json(newUser);
  };

  const deleteUser = (req, res) => {
    if (!isFaculty(req)) {
      res.status(403).json({ message: "Only faculty can delete users" });
      return;
    }
    const { userId } = req.params;
    // Also delete all enrollments for this user
    db.enrollments = db.enrollments.filter(
      (enrollment) => enrollment.user !== userId
    );
    dao.deleteUser(userId);
    res.sendStatus(200);
  };

  const findAllUsers = (req, res) => {
    const users = dao.findAllUsers();
    res.json(users);
  };

  const findUserById = (req, res) => {
    const { userId } = req.params;
    const user = dao.findUserById(userId);
    if (!user) {
      res.status(404).json({ message: `User ${userId} not found` });
      return;
    }
    res.json(user);
  };

  const updateUser = (req, res) => {
    if (!isFaculty(req)) {
      res.status(403).json({ message: "Only faculty can update users" });
      return;
    }
    const userId = req.params.userId;
    const userUpdates = req.body;
    const updated = dao.updateUser(userId, userUpdates);
    if (!updated) {
      res.status(404).json({ message: `User ${userId} not found` });
      return;
    }
    // Update session if updating current user
    const currentUser = req.session["currentUser"];
    if (currentUser && currentUser._id === userId) {
      req.session["currentUser"] = updated;
    }
    res.json(updated);
  };

  // Get all users enrolled in a course
  const findUsersForCourse = (req, res) => {
    const { courseId } = req.params;
    const enrollments = enrollmentsDao.findEnrollmentsForCourse(courseId);
    const users = enrollments
      .map((enrollment) => dao.findUserById(enrollment.user))
      .filter((user) => user !== undefined);
    res.json(users);
  };

  // Create a user and enroll them in a course (faculty only)
  const createUserForCourse = (req, res) => {
    if (!isFaculty(req)) {
      res.status(403).json({ message: "Only faculty can create users" });
      return;
    }
    const { courseId } = req.params;
    const existing = dao.findUserByUsername(req.body.username);
    if (existing) {
      res.status(400).json({ message: "Username already taken" });
      return;
    }
    const newUser = dao.createUser(req.body);
    enrollmentsDao.enrollUserInCourse(newUser._id, courseId);
    res.json(newUser);
  };

  const signup = (req, res) => {
    const existing = dao.findUserByUsername(req.body.username);
    if (existing) {
      res.status(400).json({ message: "Username already taken" });
      return;
    }
    const currentUser = dao.createUser(req.body);
    req.session["currentUser"] = currentUser;
    res.json(currentUser);
  };

  const signin = (req, res) => {
    const { username, password } = req.body;
    const currentUser = dao.findUserByCredentials(username, password);
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
