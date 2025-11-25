import EnrollmentsDao from "./dao.js";
import CoursesDao from "../Courses/dao.js";

export default function EnrollmentsRoutes(app, db) {
  const dao = EnrollmentsDao(db);
  const coursesDao = CoursesDao(db);

  const enrollUser = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    const { courseId } = req.params;
    const courses = await coursesDao.findAllCourses();
    const course = courses.find((c) => c._id === courseId);
    if (!course) {
      res.status(404).json({ message: `Course ${courseId} not found` });
      return;
    }
    const enrollment = await dao.enrollUserInCourse(currentUser._id, courseId);
    res.json(enrollment);
  };

  const unenrollUser = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    const { courseId } = req.params;
    const status = await dao.unenrollUserFromCourse(currentUser._id, courseId);
    res.json(status);
  };

  const findEnrollmentsForUser = async (req, res) => {
    let { userId } = req.params;
    if (userId === "current") {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        res.sendStatus(401);
        return;
      }
      userId = currentUser._id;
    }
    const enrollments = await dao.findEnrollmentsForUser(userId);
    res.json(enrollments);
  };

  app.post("/api/users/current/enrollments/:courseId", enrollUser);
  app.delete("/api/users/current/enrollments/:courseId", unenrollUser);
  app.get("/api/users/:userId/enrollments", findEnrollmentsForUser);
}
