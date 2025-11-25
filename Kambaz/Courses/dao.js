import model from "./model.js";
import { v4 as uuidv4 } from "uuid";

export default function CoursesDao(db) {
  const findAllCourses = () => {
    // return Database.courses;
    return model.find({}, { name: 1, description: 1 });
  };

  // This function is no longer used in routes, kept for backward compatibility
  // Routes now use EnrollmentsDao.findCoursesForUser directly
  async function findCoursesForEnrolledUser(userId) {
    // This method is deprecated - use EnrollmentsDao.findCoursesForUser instead
    // Keeping for potential backward compatibility
    const { enrollments } = db;
    const courses = await model.find({}, { name: 1, description: 1 });
    const enrolledCourses = courses.filter((course) =>
      enrollments.some(
        (enrollment) =>
          enrollment.user === userId && enrollment.course === course._id
      )
    );
    return enrolledCourses;
  }

  const createCourse = async (course) => {
    const newCourse = { ...course, _id: uuidv4() };
    return await model.create(newCourse);
    // const newCourse = { ...course, _id: uuidv4() };
    // Database.courses = [...Database.courses, newCourse];
    // return newCourse;
  };

  const deleteCourse = async (courseId) => {
    // const { courses, enrollments } = db;
    // db.courses = courses.filter((course) => course._id !== courseId);
    // db.enrollments = enrollments.filter(
    //   (enrollment) => enrollment.course !== courseId
    // );
    return await model.deleteOne({ _id: courseId });
  };

  const updateCourse = async (courseId, courseUpdates) => {
    return await model.updateOne({ _id: courseId }, { $set: courseUpdates });
    // const { courses } = Database;
    // const course = courses.find((course) => course._id === courseId);
    // Object.assign(course, courseUpdates);
    // return course;
  };

  return {
    findAllCourses,
    findCoursesForEnrolledUser,
    createCourse,
    deleteCourse,
    updateCourse,
  };
}
